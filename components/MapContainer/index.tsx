import React, { useCallback, useState } from 'react'
import { HexGrid, Layout, Hexagon, Text, GridGenerator, HexUtils } from 'react-hexgrid'
import { useSpring, animated, useSpringRef, useTransition, useChain } from 'react-spring'
import { assign, cloneDeep, isEmpty, shuffle, random } from 'lodash'
import { isBrowser, isMobile } from 'react-device-detect'
import { useTranslation } from 'next-i18next'
import { useMount, useUnmount } from 'ahooks'

import { getZoomPercentage } from '../../helpers/index'
import HexagonRound from '../ReactHexgrid/HexagonRound'
import NodeContent from '../IndexPage/NodeContent'
import { HexagonsState, PointState, AxialState, LayoutState, translateMapState } from '../../typings/node'
import { hexGridsByFilterState, PointScopeState } from '../../typings/metaNetwork'

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
  setSwitchMapStatus: any,
  switchMapStatus: boolean,
}
import { useUser } from '../../hooks/useUser'
import useToast from '../../hooks/useToast'
import { keyFormat } from '../../utils'

/**
 * requestAnimationFrame
 * cancelAnimationFrame
 */
const requestAnimationFrame = window.requestAnimationFrame || (window as any).mozRequestAnimationFrame ||
  (window as any).webkitRequestAnimationFrame || (window as any).msRequestAnimationFrame
const cancelAnimationFrame = window.cancelAnimationFrame || (window as any).mozCancelAnimationFrame
let ID: number
// 可操作的节点模式
const OperableNodeMode = ['exist', 'active']

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
  translateMap,
  setSwitchMapStatus,
  switchMapStatus
}) {
  const { t } = useTranslation('common')
  const { Toast } = useToast()
  const { isLoggin } = useUser()
  const [percentageVal, setPercentageVal] = useState<number>(0)

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
    if (nodeChooseHas) {
      return noticeBardOccupiedState ? 'choose' : 'default'
    }

    // console.log('calcNodeMode default')

    return 'default'
  }, [allNodeMap, allNodeChoose, allNodeDisabled, defaultPoint, noticeBardOccupiedState])

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
  const handleHexagonEventMouseEnter = (e: Event, point: PointState, mode: string) => {

    e.stopPropagation()
    if (isBrowser && OperableNodeMode.includes(mode)) {
      // console.log('handleHexagonEventMouseEnter', point)
      const { x, y, z } = point
      let node = allNodeMap.get(keyFormat({ x, y, z }))
      if (node && (!switchMapStatus)) {
        setCurrentNodeMouse(node)
      } else {
        setCurrentNodeMouse({} as hexGridsByFilterState)
      }
      setSwitchMapStatus(false);
    }

  }

  /**
   * 处理鼠标移出
   * @param e 
   * @param point 
   * @param mode 
   */
  const handleHexagonEventMouseLeave = (e: Event, point: PointState, mode: string) => {
    e.stopPropagation()
    if (isBrowser && OperableNodeMode.includes(mode)) {
      // console.log('handleHexagonEventMouseLeave', point)
      setCurrentNodeMouse({} as hexGridsByFilterState)
    }
  }

  /**
 * 处理点击地图事件
 */
  const handleHexagonEventClick = (e: any, point: PointState, mode: string) => {
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
      if (!isLoggin || !noticeBardOccupiedState) {
        return
      }
      Toast({ content: t('message-click-default-node') })
      return
    } else if (mode === 'disabled') {
      return
    }

    translateMap({ point })

    handleHistoryView(point)
  }

  /**
 * 获取缩放
 */
  const fetchZoomValue = useCallback(() => {
    let percentage = getZoomPercentage()
    setPercentageVal(percentage)

    cancelAnimationFrame(ID)
    ID = requestAnimationFrame(fetchZoomValue)
  }, [])

  useMount(() => {
    if (process.browser) {
      ID = requestAnimationFrame(fetchZoomValue)
    }
  })

  useUnmount(() => {
    cancelAnimationFrame(ID)
  })


  return (
    <div id="container">
      <HexGrid width={width} height={height} viewBox={`0, 0, ${Math.floor(width)}, ${Math.floor(height)}`} >
        <Layout size={size} flat={layout.flat} spacing={layout.spacing} origin={origin} className={percentageVal < 20 ? 'hide-node' : ''}>
          {
            // note: key must be unique between re-renders.
            // using config.mapProps+i makes a new key when the goal template chnages.

            transition((style, hex: HexagonsState) => {
              const { q: x, s: y, r: z } = hex
              const nodeMode = calcNodeMode({ x, y, z })
              let key = `x${x}_y${y}_z${z}`

              return (
                <HexagonRound
                  style={style}
                  key={key}
                  q={hex.q}
                  r={hex.r}
                  s={hex.s}
                  onClick={(e: any) => handleHexagonEventClick(e, { x, y, z }, nodeMode)}
                  onMouseEnter={(e: any) => handleHexagonEventMouseEnter(e, { x, y, z }, nodeMode)}
                  onMouseLeave={(e: any) => handleHexagonEventMouseLeave(e, { x, y, z }, nodeMode)}
                  // need space
                  className={`${`hexagon-${nodeMode}`} hexagon-${key}${isMobile ? ' nohover' : ''}`}>
                  {/* <Text>{HexUtils.getID(hex)}</Text> */}
                  <NodeContent
                    coordinate={{ x, y, z }}
                    allNodeDisabled={allNodeDisabled}
                    allNodeMap={allNodeMap}
                    allNodeChoose={allNodeChoose}
                    defaultPoint={defaultPoint}
                    bookmark={bookmark}
                    noticeBardOccupiedState={noticeBardOccupiedState}
                    isNodeOwner={isNodeOwner}
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