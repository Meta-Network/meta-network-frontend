import React, { useCallback, useState, useEffect } from 'react'
import { HexGrid } from 'react-hexgrid'
import { isEmpty } from 'lodash'
import { isBrowser, isMobile } from 'react-device-detect'
import { useTranslation } from 'next-i18next'
import { getZoomPercentage } from '../../helpers/index'
import Layout from '../ReactHexgrid/Layout'
import { HexagonsState, PointState, AxialState, LayoutState, translateMapState, ZoomTransform } from '../../typings/node'
import { hexGridsByFilterState } from '../../typings/metaNetwork'
import { toggleLayoutHide } from '../../utils/index'
import { useUser } from '../../hooks/useUser'
import { keyFormat } from '../../utils'
import { select } from 'd3-selection'
import { zoom } from 'd3-zoom'
import { EventEmitter } from 'ahooks/lib/useEventEmitter'
import { useMount } from 'ahooks'


interface Props {
  readonly width: number
  readonly height: number
  readonly size: AxialState
  readonly layout: LayoutState
  readonly allNodeDisabled: Map<string, HexagonsState>
  readonly allNodeMap: Map<string, hexGridsByFilterState>
  readonly allNodeChoose: Map<string, HexagonsState>
  readonly defaultPoint: PointState
  readonly noticeBardOccupiedState: boolean
  readonly origin: AxialState
  readonly hexGridsMineData: hexGridsByFilterState
  readonly currentNode: hexGridsByFilterState
  focus$: EventEmitter<string>,
  setCurrentNodeMouse: React.Dispatch<React.SetStateAction<hexGridsByFilterState>>
  setCurrentNode: React.Dispatch<React.SetStateAction<hexGridsByFilterState>>
  setCurrentNodeChoose: React.Dispatch<React.SetStateAction<PointState>>
  setIsModalVisibleOccupied: React.Dispatch<React.SetStateAction<boolean>>
  handleHistoryView: (point: PointState) => void
  translateMap: (value: translateMapState) => void
}

// 可操作的节点模式
const OperableNodeMode = ['exist', 'active']
let currentElem: any = null

const MapContainer: React.FC<Props> = React.memo(function MapContainer({
	width,
	height,
	size,
	layout,
	allNodeDisabled,
	allNodeMap,
	allNodeChoose,
	defaultPoint,
	noticeBardOccupiedState,
	origin,
	hexGridsMineData,
	currentNode,
	children,
	focus$,
	setCurrentNodeMouse,
	setCurrentNode,
	setCurrentNodeChoose,
	setIsModalVisibleOccupied,
	handleHistoryView,
	translateMap
}) {
	const { t } = useTranslation('common')
	const { isLogin } = useUser()

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
 * 处理鼠标移入
 * @param e 
 * @param point 
 * @param mode 
 */
	const handleHexagonEventMouseOver = useCallback((point: PointState, mode: string) => {
		if (isBrowser && OperableNodeMode.includes(mode)) {
			// console.log('handleHexagonEventMouseOver', point)
			const { x, y, z } = point
			const node = allNodeMap.get(keyFormat({ x, y, z }))
			if (node) {
				setCurrentNodeMouse(node)
			}
		}
	}, [allNodeMap, setCurrentNodeMouse])

	/**
   * 处理鼠标移出
   * @param e 
   * @param point 
   * @param mode 
   */
	const handleHexagonEventMouseOut = useCallback((point: PointState, mode: string) => {
		if (isBrowser && OperableNodeMode.includes(mode)) {
			// console.log('handleHexagonEventMouseOut', point)
			setCurrentNodeMouse({} as hexGridsByFilterState)
		}
	}, [setCurrentNodeMouse])
	/**
  * 处理点击地图事件
  */
	const handleHexagonEventClick = useCallback((e: any, point: PointState, mode: string) => {
		// 重复点击垱前块
		if (currentNode.x === point.x && currentNode.y === point.y && currentNode.z === point.z) {
			// console.log('eeee', e)
			e.stopPropagation()

			setCurrentNode({} as hexGridsByFilterState)
		}

		if (mode === 'choose') {
			setCurrentNodeChoose(point)
			setIsModalVisibleOccupied(true)
			return
		} else if (mode === 'default') {
			// 未登录不提示 未开启占地功能不提示
			if (!isLogin || !noticeBardOccupiedState) {
				return
			}
			return
		} else if (mode === 'disabled') {
			return
		}

		translateMap({ point })

		handleHistoryView(point)
	}, [currentNode, handleHistoryView, noticeBardOccupiedState, isLogin, translateMap, setCurrentNode, setCurrentNodeChoose, setIsModalVisibleOccupied])

	/**
 * 获取缩放
 */
	const fetchZoomValue = useCallback(() => {
		const percentage = getZoomPercentage()
		toggleLayoutHide(percentage)
	}, [])

	const handleLayoutEventClick = useCallback((e: Event) => {
		const layoutWrapper = document.querySelector('.layout-wrapper')
		if (!layoutWrapper) {
			return
		}

		// @ts-ignore
		const target = e.target.closest('.hexagon-exist') || e.target.closest('.hexagon-active')
		// @ts-ignore
		const targetChoose = e.target.closest('.hexagon-choose')

		if (target) {
			if (!layoutWrapper.contains(target)) return

			const q = target.getAttribute('data-q')
			const r = target.getAttribute('data-r')
			const s = target.getAttribute('data-s')

			const mode = calcNodeMode({ x: Number(q), y: Number(s), z: Number(r) })
			handleHexagonEventClick(e, { x: Number(q), y: Number(s), z: Number(r) }, mode)
		} else if (targetChoose) {
			if (!layoutWrapper.contains(targetChoose)) return

			const q = targetChoose.getAttribute('data-q')
			const r = targetChoose.getAttribute('data-r')
			const s = targetChoose.getAttribute('data-s')

			const mode = calcNodeMode({ x: Number(q), y: Number(s), z: Number(r) })
			handleHexagonEventClick(e, { x: Number(q), y: Number(s), z: Number(r) }, mode)
		}

	}, [calcNodeMode, handleHexagonEventClick])

	const handleLayoutEventMouseOver = useCallback((e: Event) => {
		const layoutWrapper = document.querySelector('.layout-wrapper')
		if (!layoutWrapper) {
			return
		}

		if (currentElem) return

		// @ts-ignore
		const target = e.target.closest('.hexagon-exist') || e.target.closest('.hexagon-active')

		if (!target) return

		if (!layoutWrapper.contains(target)) return

		currentElem = target

		const q = target.getAttribute('data-q')
		const r = target.getAttribute('data-r')
		const s = target.getAttribute('data-s')

		const mode = calcNodeMode({ x: Number(q), y: Number(s), z: Number(r) })
		handleHexagonEventMouseOver({ x: Number(q), y: Number(s), z: Number(r) }, mode)
	}, [calcNodeMode, handleHexagonEventMouseOver])

	const handleLayoutEventMouseOut = useCallback((e: Event) => {
		const layoutWrapper = document.querySelector('.layout-wrapper')
		if (!layoutWrapper) {
			return
		}

		if (!currentElem) return

		// @ts-ignore
		let relatedTarget = e.relatedTarget
		while (relatedTarget) {
			if (relatedTarget == currentElem) return

			relatedTarget = relatedTarget.parentNode
		}

		const q = currentElem.getAttribute('data-q')
		const r = currentElem.getAttribute('data-r')
		const s = currentElem.getAttribute('data-s')

		const mode = calcNodeMode({ x: Number(q), y: Number(s), z: Number(r) })
		handleHexagonEventMouseOut({ x: Number(q), y: Number(s), z: Number(r) }, mode)

		currentElem = null

	}, [calcNodeMode, handleHexagonEventMouseOut])


	/**
   * 设置内容拖动 缩放
   */
	const setContainerDrag = useCallback(() => {
		const containerD3Svg = select('#container svg')
		const containerD3Zoom= zoom()

    ;(window as any).containerD3Svg= containerD3Svg
		;(window as any).containerD3Zoom = containerD3Zoom

		containerD3Svg.call(
			// @ts-ignore
			containerD3Zoom
				.extent([[0, 0], [width, height]])
				.scaleExtent([0.4, 4])
				.on('zoom', zoomed)
		)

		function zoomed({ transform }: any) {
			containerD3Svg.select('g').attr('transform', transform)
			focus$.emit('zoom')
		}
	}, [width, height, focus$])

	useEffect(() => {  
		const timer = setInterval(fetchZoomValue, 2000)
		return () => clearInterval(timer)
	}, [fetchZoomValue])

	useMount(() => {
		setContainerDrag()
	})

	return (
		<div id="container">
			<HexGrid width={width} height={height} viewBox={`0, 0, ${Math.floor(width)}, ${Math.floor(height)}`} >
				<Layout
					className={`layout-wrapper${isBrowser ? ' pc' : ''}${noticeBardOccupiedState ? ' choose' : ''}`}
					size={size}
					flat={layout.flat}
					spacing={layout.spacing}
					origin={origin}
					onClick={(e: any) => handleLayoutEventClick(e)}
					onMouseOver={(e: any) => handleLayoutEventMouseOver(e)}
					onMouseOut={(e: any) => handleLayoutEventMouseOut(e)}
				>
					{children}
				</Layout>
			</HexGrid>
		</div>
	)
})

export default MapContainer