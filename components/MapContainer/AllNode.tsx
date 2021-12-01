import React, { useCallback, useState, useEffect } from 'react'
import { isEmpty, shuffle, random, maxBy } from 'lodash'
import { getZoomPercentage } from '../../helpers/index'
import HexagonRound from '../ReactHexgrid/HexagonRound'
import NodeContent from '../IndexPage/NodeContent'
import { HexagonsState, PointState, AxialState, LayoutState, translateMapState } from '../../typings/node'
import { hexGridsByFilterState } from '../../typings/metaNetwork'
import { axialToCube, cubeToAxial, getHexagonBox, Hexagon, HexagonMemo, keyFormat, toggleLayoutHide, transformFormat } from '../../utils/index'
import { EventEmitter } from 'ahooks/lib/useEventEmitter'
import { useDebounce, useDebounceFn, useMount, useThrottleFn } from 'ahooks'
import { useWorker, WORKER_STATUS } from '@koale/useworker'
import { calcFarthestDistanceWorker, HexagonRectangleWorker } from '../../utils/worker'

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
  const [ hexagonRectangleWorkerFn, {status: hexagonRectangleWorkerStatus, kill: hexagonRectangleWorkerTerminate } ] = useWorker(HexagonRectangleWorker)
  const [ calcFarthestDistanceWorkerFn ] = useWorker(calcFarthestDistanceWorker)

  const [farthestDistance, setFarthestDistance] = useState<number>(0)
  const [currentHex, setCurrentHex] = useState<HexagonsState[]>([])
  const [currentHexPoint, setCurrentHexPoint] = useState<HexagonsState>({ q: 0, r: -11, s: 11 })

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
    let hexagonX = Math.ceil(clientWidth / hexagonWidth)
    let hexagonY = Math.ceil(clientHeight / hexagonHeight)
    
    // 需要 偶数 / 2
    let zoneRadiusX = ( hexagonX % 2 === 0 ? hexagonX : hexagonX + 1 ) / 2 * 3
    let zoneRadiusY = ( hexagonY % 2 === 0 ? hexagonY : hexagonY + 1 ) / 2 * 3

    // 寻找 cache, 超过 x 删除部分
    const _key = keyFormat(transformFormat(currentHexPoint) as PointState) + `_w${zoneRadiusX}_h${zoneRadiusY}`

    if (hexagonMap.size >= 40) {
      for ( let key of [...hexagonMap.keys()].slice(0, 20) ) {
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
        result = HexagonRectangleWorker(currentHexPoint, zoneRadiusX, zoneRadiusY)
      }

      hexagonMap.set(_key, result)
      setCurrentHex(result)
    }
  }, [ hexagonRectangleWorkerFn, hexagonRectangleWorkerStatus, hexagonRectangleWorkerTerminate ])

  const { run: load } = useDebounceFn(() => {
    const wrapper = document.querySelector('.layout-wrapper')
    const clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    const clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight

    const { left, top, right, bottom, width, height } = wrapper!.getBoundingClientRect()
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
    
    // 找到间隙最大的
    const maxResult = maxBy(list, o => o.value)!
    // console.log('maxResult', maxResult, wrapper!.getBoundingClientRect())

    const { width: hexagonWidth, height: hexagonHeight } = getHexagonBox()
    // console.log(hexagonWidth, hexagonHeight)

    const wrapperWidthMargin = Math.ceil((width - clientWidth) / 2)
    const wrapperHeightMargin = Math.ceil((height - clientHeight) / 2)

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
    } else {
      return
    }
  
    if (maxResult.value >= 0) {
      dragDistance = wrapperMargin + maxResult.value
    } else {
      dragDistance = wrapperMargin - Math.abs(maxResult.value)
    }
    // console.log('dragDistance', dragDistance)

    const { q, r, s } = currentHexPoint
    const cubeToAxialResult = cubeToAxial(q, s, r)
    let axialToCubeResult!: PointState

    // TODO: 最好能计算两个方向  也许？
    if (maxResult.key === 'left') {
      const zoneRadiusMarginX = Math.ceil(dragDistance / hexagonWidth)
      axialToCubeResult = axialToCube( cubeToAxialResult.x - zoneRadiusMarginX, cubeToAxialResult.y)
    } else if (maxResult.key === 'right') {
      const zoneRadiusMarginX = Math.ceil(dragDistance / hexagonWidth)
      axialToCubeResult = axialToCube( cubeToAxialResult.x + zoneRadiusMarginX, cubeToAxialResult.y)
    } else if (maxResult.key === 'top') {
      const zoneRadiusMarginY = Math.ceil(dragDistance / hexagonHeight)
      axialToCubeResult = axialToCube( cubeToAxialResult.x, cubeToAxialResult.y - zoneRadiusMarginY )
    } else if (maxResult.key === 'bottom') {
      const zoneRadiusMarginY = Math.ceil(dragDistance / hexagonHeight)
      axialToCubeResult = axialToCube( cubeToAxialResult.x, cubeToAxialResult.y + zoneRadiusMarginY)
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
  }, [ allNodeMap, calcFarthestDistanceWorkerFn ])

  useEffect(() => {
    const timer = setInterval(fetchZoomValue, 2000)
    return () => clearInterval(timer)
  }, [fetchZoomValue])

  focus$.useSubscription((type: string) => {
    if (type === 'zoom') {
      load()
    }
    if (type === 'positionDefault') {
      calcZone(currentDefaultPoint)
    } else if (type === 'positionOwn') {
      const { x, y, z } = hexGridsMineData
      calcZone(transformFormat({ x, y, z }) as HexagonsState)
    }
  })

  return (
    <>
      {
        // note: key must be unique between re-renders.
        // using config.mapProps+i makes a new key when the goal template changes.
        currentHex.map((hex: HexagonsState ) => {
          const { q: x, s: y, r: z } = hex
          const nodeMode = calcNodeMode({ x, y, z })
          const key = keyFormat({ x, y, z })

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