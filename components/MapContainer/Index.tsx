import React, { useCallback } from 'react'
import { HexGrid, Layout, Hexagon, Text, GridGenerator, HexUtils } from 'react-hexgrid'
import { useSpring, animated, useSpringRef, useTransition, useChain } from 'react-spring'
import { assign, cloneDeep, isEmpty, shuffle, random } from 'lodash'
import { isBrowser } from "react-device-detect"

import HexagonRound from '../ReactHexgrid/HexagonRound'
import NodeContent from '../IndexPage/NodeContent'
import { HexagonsState, PointState, AxialState, LayoutState } from '../../typings/node.d'
import { hexGridsByFilterState, PointScopeState } from '../../typings/metaNetwork.d'

interface Props {
  width: number
  height: number
  size: AxialState
  layout: LayoutState
  allNodeDisabled: Map<string, HexagonsState>
  allNodeMap: Map<string, hexGridsByFilterState>
  allNodeChoose: Map<string, HexagonsState>
  defaultPoint: PointState
  bookmark: PointState[]
  noticeBardOccupiedState: boolean
  origin: AxialState
  hex: HexagonsState[]
  hexGridsMineData: hexGridsByFilterState
  setCurrentNodeMouse: React.Dispatch<React.SetStateAction<hexGridsByFilterState>>
  handleHexagonEventClick: (e: any, point: PointState, mode: string) => void
}


const MapContainer: React.FC<Props> = React.memo(function MapContainer({
  width,
  height,
  size,
  layout,
  handleHexagonEventClick,
  allNodeDisabled,
  allNodeMap,
  allNodeChoose,
  defaultPoint,
  bookmark,
  noticeBardOccupiedState,
  origin,
  hex,
  hexGridsMineData,
  setCurrentNodeMouse
}) {

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
    // console.log('calcNodeMode')

    // 禁止选择节点
    const nodeDisabledHas = allNodeDisabled.has(`${x}${y}${z}`)
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

    const nodeHas = allNodeMap.has(`${x}${y}${z}`)
    if (nodeHas) {
      // return node[0]!.user.role || 'exist'
      return 'exist'
    }

    const nodeChooseHas = allNodeChoose.has(`${x}${y}${z}`)
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
    if (isBrowser && mode === 'exist') {
      // console.log('handleHexagonEventMouseEnter', point)
      const { x, y, z } = point
      let node = allNodeMap.get(`${x}${y}${z}`)
      if (node) {
        setCurrentNodeMouse(node)
      }
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
    if (isBrowser && mode === 'exist') {
      // console.log('handleHexagonEventMouseLeave', point)
      setCurrentNodeMouse({} as hexGridsByFilterState)
    }
  }

  return (
    <div id="container">
      <HexGrid width={width} height={height} viewBox={`0, 0, ${Math.floor(width)}, ${Math.floor(height)}`} >
        <Layout size={size} flat={layout.flat} spacing={layout.spacing} origin={origin}>
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
                  className={`${`hexagon-${nodeMode}`} hexagon-${key}`}>
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