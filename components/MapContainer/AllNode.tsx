import React, { useCallback, useState, useEffect, useMemo } from 'react'
import { isEmpty, maxBy } from 'lodash'
import { getZoomPercentage } from '../../helpers/index'
import HexagonRound from '../ReactHexgrid/HexagonRound'
import NodeContent from '../IndexPage/NodeContent'
import { HexagonsState, PointState } from '../../typings/node'
import { hexGridsByFilterState, RenderMode } from '../../typings/metaNetwork'
import { axialToCube, cubeToAxial, getHexagonBox, keyFormat, toggleLayoutHide, transformFormat } from '../../utils/index'
import { EventEmitter } from 'ahooks/lib/useEventEmitter'
import { useDebounceFn, useMount } from 'ahooks'
import { useWorker, WORKER_STATUS } from '@koale/useworker'
import { calcFarthestDistanceWorker, HexagonRectangleWorker, HexagonRectangleMemo } from '../../utils/worker'
import { StoreGet } from '../../utils/store'
import { KEY_RENDER_MODE, KEY_RENDER_MODE_VALUE_FULL, KEY_RENDER_MODE_VALUE_SIMPLE } from '../../common/config'

interface Props {
  readonly allNodeDisabled: Map<string, HexagonsState>
  readonly allNodeMap: Map<string, hexGridsByFilterState>
  readonly allNodeChoose: Map<string, HexagonsState>
  readonly defaultPoint: PointState
  readonly bookmark: PointState[]
  readonly noticeBardOccupiedState: boolean
  readonly hexGridsMineData: hexGridsByFilterState
  focus$: EventEmitter<string>
}

// key x_y_z_distance
const hexagonMap = new Map()
const currentDefaultPoint: HexagonsState = { q: 0, r: -11, s: 11 }
// const currentDefaultCenterPoint: HexagonsState = { q: 0, r: 0, s: 0 }

const AllNode: React.FC<Props> = React.memo(function AllNode({
	allNodeDisabled,
	allNodeMap,
	allNodeChoose,
	defaultPoint,
	bookmark,
	noticeBardOccupiedState,
	hexGridsMineData,
	focus$,
}) {
	const [hexagonRectangleWorkerFn, { status: hexagonRectangleWorkerStatus, kill: hexagonRectangleWorkerTerminate }] = useWorker(HexagonRectangleWorker)
	const [calcFarthestDistanceWorkerFn] = useWorker(calcFarthestDistanceWorker)

	const [farthestDistance, setFarthestDistance] = useState<number>(0)
	const [currentHex, setCurrentHex] = useState<HexagonsState[]>([])
	const [currentHexPoint, setCurrentHexPoint] = useState<HexagonsState>({ q: 0, r: -11, s: 11 })
	const [ allowZoom, setAllowZoom ] = useState<boolean>(true)

	const renderMode = useMemo((): RenderMode => StoreGet(KEY_RENDER_MODE) || KEY_RENDER_MODE_VALUE_FULL, [])

	/**
   * 计算节点模式
   */
	const calcNodeMode = useCallback(({ x, y, z }: PointState) => {
		// 禁止选择节点
		const nodeDisabledHas = allNodeDisabled.has(keyFormat({ x, y, z }))
		if (nodeDisabledHas) {
			return 'disabled'
		}

		if (!allNodeMap.size) {
			// 没有节点
			if (x === defaultPoint.x && y === defaultPoint.y && z === defaultPoint.z) {
				return 'choose'
			} else {
				return 'default'
			}
		}

		const node = allNodeMap.get(keyFormat({ x, y, z }))
		if (node) {
			if (node.subdomain) {
				return 'active'
			}
			return 'exist'
		}

		const nodeChooseHas = allNodeChoose.has(keyFormat({ x, y, z }))
		// 如果已经占领了 不会显示 choose 地块
		if (nodeChooseHas && isEmpty(hexGridsMineData)) {
			return noticeBardOccupiedState ? 'choose' : 'default'
		}

		return 'default'
	}, [allNodeMap, allNodeChoose, allNodeDisabled, defaultPoint, noticeBardOccupiedState, hexGridsMineData])

	/**
   * 节点是不是拥有者
   */
	const isNodeOwner = useCallback(({ x, y, z }: PointState) => {
		return !isEmpty(hexGridsMineData) &&
      hexGridsMineData.x === x &&
      hexGridsMineData.y === y &&
      hexGridsMineData.z === z
	}, [hexGridsMineData])

	/**
 * 获取缩放
 */
	const fetchZoomValue = useCallback(() => {
		const percentage = getZoomPercentage()
		toggleLayoutHide(percentage)
	}, [])

	/**
   * calc zone range
   */
	const calcZone = useCallback(async (currentHexPoint: HexagonsState) => {
		const clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
		const clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight

		// 计算一屏幕格子数量 忽略间隙计算
		const { width: hexagonWidth, height: hexagonHeight } = getHexagonBox()
		const hexagonX = Math.ceil(clientWidth / hexagonWidth)
		const hexagonY = Math.ceil(clientHeight / hexagonHeight)

		// 需要 偶数 / 2
		const zoneRadiusX = (hexagonX % 2 === 0 ? hexagonX : hexagonX + 1) / 2 * 3
		const zoneRadiusY = (hexagonY % 2 === 0 ? hexagonY : hexagonY + 1) / 2 * 3

		// 寻找 cache, 超过 x 删除部分
		const _key = keyFormat(transformFormat(currentHexPoint) as PointState) + `_w${zoneRadiusX}_h${zoneRadiusY}`

		if (hexagonMap.size >= 40) {
			for (const key of [...hexagonMap.keys()].slice(0, 20)) {
				hexagonMap.delete(key)
			}
		}

		const hexagonResult = hexagonMap.get(_key)
		if (hexagonResult) {
			setCurrentHex(hexagonResult)
		} else {
			let result: HexagonsState[] = []
			try {
				// TODO: 待优化
				if (hexagonRectangleWorkerStatus === WORKER_STATUS.RUNNING) {
					hexagonRectangleWorkerTerminate()
				}
				result = await hexagonRectangleWorkerFn(currentHexPoint, zoneRadiusX, zoneRadiusY)
			} catch (e) {
				console.error(e)
				result = HexagonRectangleMemo(currentHexPoint, zoneRadiusX, zoneRadiusY)
			}

			hexagonMap.set(_key, result)
			setCurrentHex(result)
		}
	}, [hexagonRectangleWorkerFn, hexagonRectangleWorkerStatus, hexagonRectangleWorkerTerminate])

	const { run: load } = useDebounceFn(() => {
		const wrapper = document.querySelector('.layout-wrapper')
		const clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
		const clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight

		const { left, top, right, bottom, width, height } = wrapper!.getBoundingClientRect()

		const calcDistance = (list: { key: string; value: number; }[]): { dragDistance: number, maxResult: { key: string; value: number; } } => {
			// 找到间隙最大的
			const maxResult = maxBy(list, o => o.value)!

			// 默认地图比屏幕大 判断一种

			// 计算拖动举例
			let dragDistance = 0
			let wrapperMargin = 0
			// x >= 0 1700 + x
			// x < 0 abs 1700 - abs x 
			if (maxResult.key === 'left' || maxResult.key === 'right') {
				wrapperMargin = Math.abs(wrapperWidthMargin)
			} else if (maxResult.key === 'top' || maxResult.key === 'bottom') {
				wrapperMargin = Math.abs(wrapperHeightMargin)
			}

			if (maxResult.value >= 0) {
				dragDistance = wrapperMargin + maxResult.value
			} else {
				dragDistance = wrapperMargin - Math.abs(maxResult.value)
			}
			// console.log('dragDistance', dragDistance)

			return {
				dragDistance,
				maxResult
			}
		}

		const list = [
			{
				key: 'left',
				value: left
			},
			{
				key: 'top',
				value: top
			},
			{
				key: 'right',
				value: clientWidth - right
			},
			{
				key: 'bottom',
				value: clientHeight - bottom
			}
		]

		const { width: hexagonWidth, height: hexagonHeight } = getHexagonBox()
		// console.log(hexagonWidth, hexagonHeight)

		const wrapperWidthMargin = Math.ceil((width - clientWidth) / 2)
		const wrapperHeightMargin = Math.ceil((height - clientHeight) / 2)

		const { q, r, s } = currentHexPoint
		const cubeToAxialResult = cubeToAxial(q, s, r)
		let axialToCubeResult!: PointState

		const { maxResult, dragDistance } = calcDistance(list)

		const marginX = () => {
			const _list = [{
				key: 'left',
				value: left
			},
			{
				key: 'right',
				value: clientWidth - right
			},
			]
			const { dragDistance: dragDistanceX, maxResult: maxResultX } = calcDistance(_list)
			let zoneRadiusMarginX = 0

			// 至少偏移两格
			if (dragDistanceX > hexagonWidth * 2) {
				zoneRadiusMarginX = maxResultX.key === 'left' ? -Math.ceil(dragDistanceX / hexagonWidth) : Math.ceil(dragDistanceX / hexagonWidth)
			}

			return zoneRadiusMarginX
		}

		const marginY = () => {
			const _list = [{
				key: 'top',
				value: top
			},
			{
				key: 'bottom',
				value: clientHeight - bottom
			}]
			const { dragDistance: dragDistanceY, maxResult: maxResultY } = calcDistance(_list)
			let zoneRadiusMarginY = 0

			// 至少偏移两格
			if (dragDistanceY > hexagonHeight * 2) {
				zoneRadiusMarginY = maxResultY.key === 'top' ? -Math.ceil(dragDistanceY / hexagonHeight) : Math.ceil(dragDistanceY / hexagonHeight)
			}

			return zoneRadiusMarginY
		}

		if (maxResult.key === 'left') {
			const zoneRadiusMarginX = Math.ceil(dragDistance / hexagonWidth)
			axialToCubeResult = axialToCube(cubeToAxialResult.x - zoneRadiusMarginX, cubeToAxialResult.y + marginY())
		} else if (maxResult.key === 'right') {
			const zoneRadiusMarginX = Math.ceil(dragDistance / hexagonWidth)
			axialToCubeResult = axialToCube(cubeToAxialResult.x + zoneRadiusMarginX, cubeToAxialResult.y + marginY())
		} else if (maxResult.key === 'top') {
			const zoneRadiusMarginY = Math.ceil(dragDistance / hexagonHeight)
			axialToCubeResult = axialToCube(cubeToAxialResult.x + marginX(), cubeToAxialResult.y - zoneRadiusMarginY)
		} else if (maxResult.key === 'bottom') {
			const zoneRadiusMarginY = Math.ceil(dragDistance / hexagonHeight)
			axialToCubeResult = axialToCube(cubeToAxialResult.x + marginX(), cubeToAxialResult.y + zoneRadiusMarginY)
		}

		// 超过范围不拖动
		// 容差
		const _farthestDistance = farthestDistance + 6
		if (
			farthestDistance !== 0
      && (axialToCubeResult.x >= _farthestDistance
        || axialToCubeResult.y >= _farthestDistance
        || axialToCubeResult.z >= _farthestDistance)
		) {
			return
		}

		calcZone(transformFormat(axialToCubeResult) as HexagonsState)
		setCurrentHexPoint(transformFormat(axialToCubeResult) as HexagonsState)
	}, { wait: 400 })

	useMount(() => {
		calcZone(currentDefaultPoint)
	})

	useEffect(() => {
		calcFarthestDistanceWorkerFn(allNodeMap).then(result => {
			setFarthestDistance(result)
		}).catch(e => {
			console.error(e)
			const _farthestDistance = calcFarthestDistanceWorker(allNodeMap)
			setFarthestDistance(_farthestDistance)
		})
	}, [allNodeMap, calcFarthestDistanceWorkerFn])

	useEffect(() => {
		const timer = setInterval(fetchZoomValue, 2000)
		return () => clearInterval(timer)
	}, [fetchZoomValue])

	focus$.useSubscription((type: string) => {
		if (type === 'positionDefault') {
			setAllowZoom(false)
      
			calcZone(currentDefaultPoint)
		} else if (type === 'positionOwn') {
			setAllowZoom(false)

			const { x, y, z } = hexGridsMineData
			calcZone(transformFormat({ x, y, z }) as HexagonsState)
		}
		if (type === 'zoom') {
			if (allowZoom) {
				load()
			}
		}

		if (type === 'allowZoom') {
			setAllowZoom(true)
		}
	})

	return (
		<>
			{
				// note: key must be unique between re-renders.
				// using config.mapProps+i makes a new key when the goal template changes.
				currentHex.map((hex: HexagonsState) => {
					const { q: x, s: y, r: z } = hex
					const key = keyFormat({ x, y, z })
					// TODO：和 full 拖动判断似乎有点冲突
					// TODO: 移动到 worker 里面处理
					// 简易渲染模式
					if ( renderMode === KEY_RENDER_MODE_VALUE_SIMPLE && !(allNodeDisabled.get(key) || allNodeMap.get(key) || allNodeChoose.get(key))) return

					const nodeMode = calcNodeMode({ x, y, z })

					return (
						<HexagonRound
							key={key}
							q={hex.q}
							r={hex.r}
							s={hex.s}
							// need space
							className={`${`hexagon-${nodeMode}`} hexagon-${key}`}
						>
							<NodeContent
								coordinate={{ x, y, z }}
								allNodeDisabled={allNodeDisabled}
								allNodeMap={allNodeMap}
								allNodeChoose={allNodeChoose}
								defaultPoint={defaultPoint}
								bookmark={bookmark}
								isNodeOwner={isNodeOwner}
								hexGridsMineData={hexGridsMineData}
							></NodeContent>
						</HexagonRound>
					)
				})
			}
		</>
	)
})

export default AllNode