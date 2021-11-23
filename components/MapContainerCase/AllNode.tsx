import React, { useCallback, useState, useEffect } from 'react'
import { HexGrid } from 'react-hexgrid'
import { useSpring, animated, useSpringRef, useTransition, useChain } from 'react-spring'
import { isEmpty, shuffle, random, maxBy } from 'lodash'
import { isBrowser, isMobile } from 'react-device-detect'
import { useTranslation } from 'next-i18next'
import { getZoomPercentage } from '../../helpers/index'
import HexagonRound from '../ReactHexgrid/HexagonRound'
import NodeContent from '../IndexPage/NodeContent'
import { HexagonsState, PointState, AxialState, LayoutState, translateMapState } from '../../typings/node'
import { hexGridsByFilterState } from '../../typings/metaNetwork'
import { axialToCube, calcZoneRadius, cubeToAxial, getHexagonWidth, toggleLayoutHide, transformFormat } from '../../utils/index'
import { useUser } from '../../hooks/useUser'
import { keyFormat } from '../../utils'
import { EventEmitter } from 'ahooks/lib/useEventEmitter'
import { useDebounce, useDebounceFn, useThrottleFn } from 'ahooks'

interface Props {
  readonly width: number
  readonly allNodeDisabled: Map<string, HexagonsState>
  readonly allNodeMap: Map<string, hexGridsByFilterState>
  readonly allNodeChoose: Map<string, HexagonsState>
  readonly defaultPoint: PointState
  readonly bookmark: PointState[]
  readonly noticeBardOccupiedState: boolean
  readonly hexGridsMineData: hexGridsByFilterState
  readonly hex: HexagonsState[]
  focus$: EventEmitter<string>
}

const AllNode: React.FC<Props> = React.memo(function AllNode({
  width,
  allNodeDisabled,
  allNodeMap,
  allNodeChoose,
  defaultPoint,
  bookmark,
  noticeBardOccupiedState,
  hexGridsMineData,
  hex,
  focus$,
}) {
  const { t } = useTranslation('common')
  const { isLogin } = useUser()

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
 * 获取缩放
 */
  const fetchZoomValue = useCallback(() => {
    const percentage = getZoomPercentage()
    toggleLayoutHide(percentage)
  }, [])

  useEffect(() => {

    if (!hex.length) {
      return
    }

    const hexagon = Math.ceil(width / getHexagonWidth())
    let zoneRadius = hexagon % 2 === 0 ? hexagon / 2 : (hexagon - 1 / 2)
    
    console.log('zoneRadius', zoneRadius)

    const point = calcZoneRadius({
      centerPoint: currentHexPoint,
      hex: hex,
      zoneRadius: zoneRadius - 2
    })

    setCurrentHex(Array.from(point, ([, value]) => value))
  }, [ hex, width, currentHexPoint ])

  const { run: load } = useDebounceFn(() => {

    const wrapper = document.querySelector('.layout-wrapper')
    console.log('wrapper', wrapper?.getBoundingClientRect())

    const { left, top, right, bottom } = wrapper!.getBoundingClientRect()
    const leftMargin = left
    const rightMargin = window.innerWidth - right
    const topMargin = top
    const bottomMargin = window.innerHeight - bottom

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
        value: window.innerWidth - right
      },
      {
        key: 'bottom',
        value: window.innerHeight - bottom
      }
    ]
    
    // 找到间隙最大的
    const maxResult = maxBy(list, o => o.value)
    console.log('max', maxResult)

    if (maxResult!.value <= 0) {
      return
    }
     
    const zoneRadiusMargin = Math.ceil(maxResult!.value / getHexagonWidth())
    console.log('zoneRadiusMargin', zoneRadiusMargin)

    const hexagon = Math.ceil(width / getHexagonWidth())
    // hexagon % 2 === 0 ? hexagon / 2 : (hexagon - 1 / 2)
    let zoneRadius = hexagon % 2 === 0 ? hexagon / 2 : (hexagon - 1 / 2)

    console.log('zoneRadius', zoneRadius)

    const { q, r, s } = currentHexPoint
    const cubeToAxialResult = cubeToAxial(q, s, r)
    let axialToCubeResult: PointState | undefined

    if (maxResult!.key === 'left') {
      axialToCubeResult = axialToCube( cubeToAxialResult.x - zoneRadiusMargin, cubeToAxialResult.y)
    } else if (maxResult!.key === 'right') {
      axialToCubeResult = axialToCube( cubeToAxialResult.x + zoneRadiusMargin, cubeToAxialResult.y)
    } else if (maxResult!.key === 'top') {
      axialToCubeResult = axialToCube( cubeToAxialResult.x, cubeToAxialResult.y - zoneRadiusMargin )
    } else if (maxResult!.key === 'bottom') {
      axialToCubeResult = axialToCube( cubeToAxialResult.x, cubeToAxialResult.y + zoneRadiusMargin)
    }

    if (!axialToCubeResult) {
      return
    }

    const point = calcZoneRadius({
      centerPoint: transformFormat(axialToCubeResult) as HexagonsState,
      hex: hex,
      zoneRadius: zoneRadius - 2
    })

    setCurrentHex(Array.from(point, ([, value]) => value))
    setCurrentHexPoint(transformFormat(axialToCubeResult) as HexagonsState)
  }, { wait: 800 })


  useEffect(() => {
    const timer = setInterval(fetchZoomValue, 2000)
    return () => clearInterval(timer)
  }, [fetchZoomValue])

  focus$.useSubscription((type: string) => {
    console.log('zzz', type)
    if (type === 'zoom') {
      load()
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
    </>
  )
})

export default AllNode