import React, { useCallback, useState, useEffect } from 'react'
import { HexGrid } from 'react-hexgrid'
import { useSpring, animated, useSpringRef, useTransition, useChain } from 'react-spring'
import { isEmpty, shuffle, random } from 'lodash'
import { isBrowser, isMobile } from 'react-device-detect'
import { useTranslation } from 'next-i18next'

import { getZoomPercentage } from '../../helpers/index'
import HexagonRound from '../ReactHexgrid/HexagonRound'
import Layout from '../ReactHexgrid/Layout'
import NodeContent from '../IndexPage/NodeContent'
import { HexagonsState, PointState, AxialState, LayoutState, translateMapState } from '../../typings/node'
import { hexGridsByFilterState } from '../../typings/metaNetwork'
import { toggleLayoutHide } from '../../utils/index'

interface Props {
  readonly width: number
  readonly height: number
  readonly size: AxialState
  readonly layout: LayoutState
  readonly allNodeDisabled: Map<string, HexagonsState>
  readonly allNodeMap: Map<string, hexGridsByFilterState>
  readonly allNodeChoose: Map<string, HexagonsState>
  readonly defaultPoint: PointState
  readonly bookmark: PointState[]
  readonly noticeBardOccupiedState: boolean
  readonly origin: AxialState
  readonly hex: HexagonsState[]
  readonly hexGridsMineData: hexGridsByFilterState
  readonly currentNode: hexGridsByFilterState
  setCurrentNodeMouse: React.Dispatch<React.SetStateAction<hexGridsByFilterState>>
  setCurrentNode: React.Dispatch<React.SetStateAction<hexGridsByFilterState>>
  setCurrentNodeChoose: React.Dispatch<React.SetStateAction<PointState>>
  setIsModalVisibleOccupied: React.Dispatch<React.SetStateAction<boolean>>
  handleHistoryView: (point: PointState) => void
  translateMap: (value: translateMapState) => void
}
import { useUser } from '../../hooks/useUser'
import useToast from '../../hooks/useToast'
import { keyFormat } from '../../utils'

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
  bookmark,
  noticeBardOccupiedState,
  origin,
  hex,
  hexGridsMineData,
  currentNode,
  setCurrentNodeMouse,
  setCurrentNode,
  setCurrentNodeChoose,
  setIsModalVisibleOccupied,
  handleHistoryView,
  translateMap
}) {
  const { t } = useTranslation('common')
  const { Toast } = useToast()
  const { isLogin } = useUser()

  const transApi = useSpringRef()
  const transition = useTransition(shuffle(hex),
    process.env.NODE_ENV !== 'development'
      ? {
        ref: transApi,
        trail: 2000 / hex.length,
        from: { opacity: 0, scale: 0 },
        enter: { opacity: 1, scale: 1 },
        leave: { opacity: 0, scale: 0 },
        delay: () => {
          return random(30, 80)
        },
        // onStart: () => {
        //   console.log('animated start')
        // }
      }
      : {}
  )
  useChain([transApi], [0.1])

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

    // console.log('calcNodeMode default')

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
 * 处理鼠标移入
 * @param e 
 * @param point 
 * @param mode 
 */
  const handleHexagonEventMouseOver = useCallback((point: PointState, mode: string) => {
    if (isBrowser && OperableNodeMode.includes(mode)) {
      // console.log('handleHexagonEventMouseOver', point)
      const { x, y, z } = point
      let node = allNodeMap.get(keyFormat({ x, y, z }))
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

  useEffect(() => {
    const timer = setInterval(fetchZoomValue, 2000)
    return () => clearInterval(timer)
  }, [fetchZoomValue])

  return (
    <div id="container">
      <HexGrid width={width} height={height} viewBox={`0, 0, ${Math.floor(width)}, ${Math.floor(height)}`} >
        <Layout
          className="layout-wrapper"
          size={size}
          flat={layout.flat}
          spacing={layout.spacing}
          origin={origin}
          onClick={(e: any) => handleLayoutEventClick(e)}
          onMouseOver={(e: any) => handleLayoutEventMouseOver(e)}
          onMouseOut={(e: any) => handleLayoutEventMouseOut(e)}
        >
          {
            // note: key must be unique between re-renders.
            // using config.mapProps+i makes a new key when the goal template changes.

            transition((style, hex: HexagonsState) => {
              const { q: x, s: y, r: z } = hex
              const nodeMode = calcNodeMode({ x, y, z })
              const key = `x${x}_y${y}_z${z}`

              return (
                <HexagonRound
                  style={style}
                  key={key}
                  q={hex.q}
                  r={hex.r}
                  s={hex.s}
                  // need space
                  className={`${`hexagon-${nodeMode}`} hexagon-${key}${isMobile ? ' nohover' : ''}`}
                >
                  <NodeContent
                    coordinate={{ x, y, z }}
                    allNodeDisabled={allNodeDisabled}
                    allNodeMap={allNodeMap}
                    allNodeChoose={allNodeChoose}
                    defaultPoint={defaultPoint}
                    bookmark={bookmark}
                    noticeBardOccupiedState={noticeBardOccupiedState}
                    isNodeOwner={isNodeOwner}
                    hexGridsMineData={hexGridsMineData}
                  ></NodeContent>
                </HexagonRound>
              )
            })
          }
        </Layout>
      </HexGrid>
    </div>
  )
})

export default MapContainer