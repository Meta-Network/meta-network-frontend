import React, { useEffect, useState, useRef, createRef, useCallback, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { HexGrid, Layout, Hexagon, Text, GridGenerator, HexUtils } from 'react-hexgrid'
import { assign, cloneDeep, isEmpty, uniqBy } from 'lodash'
import { useMount, useUnmount, useThrottleFn, useEventEmitter, useDebounceFn } from 'ahooks'

import { Hex } from '../utils/lib'
import { StoreGet, StoreSet } from '../utils/store'
import {
  cubeToAxial, calcTranslate, calcMaxDistance,
  calcCenterRangeAsMap, angle,
  isInViewPort, HandleHexagonStyle, strEllipsis,
  keyFormat, keyFormatParse, calcTranslateValue, calcForbiddenZoneRadius, calcAllNodeChooseZoneRadius, calcZoneRadius
} from '../utils/index'
import { PointState, HexagonsState, AxialState, LayoutState, translateMapState, ZoomTransform } from '../typings/node.d'
import { hexGridsByFilterState, PointScopeState } from '../typings/metaNetwork.d'
import { hexGridsCoordinateValidation, hexGrids } from '../services/metaNetwork'
import { useUser } from '../hooks/useUser'
import { fetchForbiddenZoneRadiusAPI, fetchHexGridsMineAPI, fetchHexGriidsAPI, getZoomPercentage } from '../helpers/index'
import useToast from '../hooks/useToast'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import qs from 'qs'
import { isBrowser, isMobile } from 'react-device-detect'
import { KEY_RENDER_MODE, KEY_RENDER_MODE_DEFAULT_VALUE } from '../common/config'

const ToggleSlider = dynamic(() => import('../components/Slider/ToggleSlider'), { ssr: false })
const DeploySite = dynamic(() => import('../components/DeploySite/Index'), { ssr: false })
const Occupied = dynamic(() => import('../components/Occupied/Index'), { ssr: false })
const NoticeBardOccupied = dynamic(() => import('../components/NoticeBardOccupied/Index'), { ssr: false })
const NoticeBardCreateSpace = dynamic(() => import('../components/NoticeBardCreateSpace'), { ssr: false })
const MarkContainer = dynamic(() => import('../components/MarkContainer/Index'), { ssr: false })
const HexGridsCount = dynamic(() => import('../components/HexGridsCount/Index'), { ssr: false })
const HomeArrow = dynamic(() => import('../components/HomeArrow/Index'), { ssr: false })
const MapPosition = dynamic(() => import('../components/MapPosition/Index'), { ssr: false })
const MapZoom = dynamic(() => import('../components/MapZoom/Index'), { ssr: false })
const UserInfo = dynamic(() => import('../components/IndexPage/UserInfo'), { ssr: false })
const UserInfoMouse = dynamic(() => import('../components/IndexPage/UserInfoMouse'), { ssr: false })
const NodeHistory = dynamic(() => import('../components/IndexPage/NodeHistory'), { ssr: false })
const PointDEV = dynamic(() => import('../components/PointDEV/Index'), { ssr: false })
const MapContainer = dynamic(() => import('../components/MapContainer'), { ssr: false })
const FullLoading = dynamic(() => import('../components/FullLoading'), { ssr: false })

let d3: any = null
let zoom: any = null
if (process.browser) {
  d3 = require('d3')
  zoom = d3.zoom()
}
const KeyMetaNetWorkBookmark = 'MetaNetWorkBookmark'
const KeyMetaNetWorkHistoryView = 'MetaNetWorkHistoryView'

const Home = () => {
  const { t } = useTranslation('common')
  const { Toast } = useToast()
  const router = useRouter()

  // hex all 坐标点
  const [hex, setHex] = useState<HexagonsState[]>([])
  const [currentHex, setCurrentHex] = useState<HexagonsState[]>([])
  // const [currentHexPoint, setCurrentHexPoint] = useState<HexagonsState>({ q: 0, r: 0, s: 0 })
  const [currentHexPoint, setCurrentHexPoint] = useState<HexagonsState>({ q: 0, r: -11, s: 11 })
  const [map, setMap] = useState<string>('hexagon')
  const [mapProps, setMapProps] = useState<number[]>([11])
  const [layout, setLayout] = useState<LayoutState>({ width: 66, height: 66, flat: false, spacing: 1.1 })
  const [size, setSize] = useState<AxialState>({ x: layout.width, y: layout.height })
  const [width, setWidth] = useState<number>(1000)
  const [height, setHeight] = useState<number>(800)
  const [origin, setOrigin] = useState<AxialState>({ x: 100, y: 100 })
  // 默认坐标点
  const [defaultPoint] = useState<PointState>({ x: 0, y: 11, z: -11 })
  // 默认坐标范围
  const [defaultHexGridsRange] = useState<PointScopeState>({
    xMin: -90,
    xMax: 90,
    yMin: -90,
    yMax: 90,
    zMin: -90,
    zMax: 90,
    simpleQuery: ''
  })

  // 所有节点
  const [allNode, setAllNode] = useState<hexGridsByFilterState[]>([])
  const [allNodeMap, setAllNodeMap] = useState<Map<string, hexGridsByFilterState>>(new Map())
  // 所有可以选择的节点
  const [allNodeChoose, setAllNodeChoose] = useState<Map<string, HexagonsState>>(new Map())
  // 所有禁止选择的节点
  const [allNodeDisabled, setAllNodeDisabled] = useState<Map<string, HexagonsState>>(new Map())
  // 当前选择节点
  const [currentNode, setCurrentNode] = useState<hexGridsByFilterState>({} as hexGridsByFilterState)
  const [currentNodeMouse, setCurrentNodeMouse] = useState<hexGridsByFilterState>({} as hexGridsByFilterState)
  // 当前占领节点
  const [currentNodeChoose, setCurrentNodeChoose] = useState<PointState>({} as PointState)
  // 部署网站 Modal
  const [isModalVisibleDeploySite, setIsModalVisibleDeploySite] = useState<boolean>(false)
  // 占领 Modal
  const [isModalVisibleOccupied, setIsModalVisibleOccupied] = useState<boolean>(false)
  // 占领通知状态
  const [noticeBardOccupiedState, setNoticeBardOccupiedState] = useState<boolean>(false)
  // 自己的占领坐标
  const [hexGridsMineData, setHexGridsMineData] = useState<hexGridsByFilterState>({} as hexGridsByFilterState)
  // 自己的占领坐标 完成标签
  const [hexGridsMineTag, setHexGridsMineTag] = useState<boolean>(false)
  // 收藏坐标点
  const [bookmark, setBookmark] = useState<PointState[]>([])
  // 历史预览
  const [historyView, setHistoryView] = useState<PointState[]>([])
  // 默认禁用区域半径
  const [forbiddenZoneRadius, setforbiiddenZoneRadius] = useState<number>(10)
  // FullLoading
  const [fullLoading, setFullLoading] = useState<boolean>(false)

  const { isLoggin } = useUser()
  const focus$ = useEventEmitter<string>()
  /**
   * resize event
   */
  const { run: resizeFn } = useThrottleFn(
    () => {
      if (process.browser) {
        const _width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
        const _height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight

        setWidth(_width * 1)
        setHeight(_height * 1)

        setOrigin({
          x: (_width * 1) / 2,
          y: (_height * 1) / 2,
        })
      }
    },
    { wait: 300 },
  )

  /**
   * 获取收藏记录
   */
  const fetchBookmark = useCallback(() => {
    const bookmark = StoreGet(KeyMetaNetWorkBookmark)
    let bookmarkList: PointState[] = bookmark ? JSON.parse(bookmark) : []
    setBookmark(bookmarkList)
  }, [])

  /**
   * 获取历史浏览记录
   */
  const fetchHistoryView = useCallback(() => {
    const historyViewStore = StoreGet(KeyMetaNetWorkHistoryView)
    let historyViewStoreList: PointState[] = historyViewStore ? JSON.parse(historyViewStore) : []
    setHistoryView(historyViewStoreList)
  }, [])

  /**
   * 发送事件
   */
  const { run: emitEvent } = useThrottleFn(
    () => {
      focus$.emit('zoom')
    },
    {
      wait: 300,
    },
  )


  const drag = useCallback(
    (direction: string) => {

      console.log(Math.ceil(width / layout.width))

      let point: HexagonsState | null = null

      const hexagon = Math.ceil(width / 50.13)
      // hexagon % 2 === 0 ? hexagon / 2 : (hexagon - 1 / 2)
      let zoneRadius = hexagon % 2 === 0 ? hexagon / 2 : (hexagon - 1 / 2)
      const zoomPercentage = getZoomPercentage()
      let step = zoomPercentage <= 10 ? 8 : zoomPercentage <= 25 ? 6 : zoomPercentage <= 15 ? 4 : 2
      const { q, r, s } = currentHexPoint
      if (direction === 'left') {
        point = {
          q: q - step,
          r: r,
          s: s + step
        }
      } else if (direction === 'right') {
        point = {
          q: q + step,
          r: r,
          s: s - step
        }
      }
      else if (direction === 'top') {
        point = {
          q: q,
          r: r - step,
          s: s + step
        }
      }
      else if (direction === 'bottom') {
        point = {
          q: q,
          r: r + step,
          s: s - step
        }
      }
      if (point) {
        console.log('_mapProps', point, mapProps, step)

        if (
          point.q >= mapProps[0] || point.q <= -mapProps[0]
          || point.r >= mapProps[0] || point.r <= -mapProps[0]
          || point.s >= mapProps[0] || point.s <= -mapProps[0]
        ) {
          return
        }

        const list = calcZoneRadius({
          centerPoint: point,
          hex: hex,
          zoneRadius: zoneRadius
        })
        setCurrentHex(Array.from(list, ([, value]) => value))
        console.log('list', list)
        setCurrentHexPoint(point)
      }

    
    },
    [hex, currentHexPoint, mapProps, layout.width, width],
  )


  const { run: dragThrottle } = useDebounceFn(
    (direction: string) => {
      drag(direction)
    },
    { wait: 400 },
  )

  /**
   * 设置内容拖动 缩放
   */
  const setContainerDrag = useCallback(() => {
    const svg = d3.select('#container svg')
    let oldTransform: ZoomTransform | null = null

    // const svgG = d3.select('#container svg > g')
    // const svgBox = svgG.node().getBBox()
    // const { width: boxWidth, height: boxHeight } = svgBox

    svg.call(
      zoom
        .extent([[0, 0], [width, height]])
        .scaleExtent([0.4, 4])
        // .translateExtent([[-(boxWidth / 2), -(boxHeight / 2)], [(boxWidth / 2) + width, (boxHeight / 2) + height]])
        .on('zoom', zoomed)
    )

    function zoomed({ transform }: { transform: ZoomTransform }) {
      // console.log('transform', transform, oldTransform)

      // 原点 点击不往下执行
      if (oldTransform && oldTransform.k === transform.k && oldTransform.x === transform.x && oldTransform.y === transform.y) {
        return
      }

      // 边界判定
      let tran = transform
      // console.log('transform', transform)
      oldTransform = cloneDeep(transform)

      const svg = d3.select('#container svg > g')
      svg.attr('transform', tran)

      const svgG = d3.select('#container svg > g')
      const svgBox1 = svgG.node().getBBox()
      const { width: boxWidth, height: boxHeight } = svgBox1

      // TODO: 缩放 计算有问题 暂时还不知道为什么
      // zoom.translateExtent([[-(boxWidth / 2) - width, -(boxHeight / 2) - height], [(boxWidth / 2) + width, (boxHeight / 2) + height]])
      // zoom.translateExtent([[-(boxWidth / 2) - width, -(boxHeight / 2) - height], [(boxWidth), (boxHeight)]])

      const svgContainer = svgG.node().getBoundingClientRect()
      console.log('svgContainer', svgContainer)

      let direction
      if (svgContainer.left > -600) {
        direction = 'left'
      } else if (width - svgContainer.right > -600) {
          direction = 'right'
      } else if (svgContainer.top > -600) {
        direction = 'top'
      } else if (height - svgContainer.bottom > -600) {
        direction = 'bottom'
      }
      emitEvent()

      direction && dragThrottle(direction)
    }
  }, [width, height, emitEvent, dragThrottle])

  /**
   * 偏移地图坐标
   */
  const translateMap = useCallback(
    ({
        point,
        scale,
        showUserInfo = true,
        nodeActive = true,
        callback,
        duration = 600
      }: translateMapState
    ) => {
    const svg = d3.select('#container svg')
    const { x, y, z } = point

    const showUserMore = () => {
      if (!showUserInfo) {
        return
      }
      const node = allNodeMap.get(keyFormat({ x, y, z }))
      if (!node) {
        Toast({ content: t('no-coordinate-data') })
        return
      }
      // 重复点击垱前块 Toggle
      if (currentNode.x === x && currentNode.y === y && currentNode.z === z) {
        //
      } else {
        setCurrentNode(node)
      }
    }

    const eventEnd = () => {
      const requestAnimationFrame = window.requestAnimationFrame || (window as any).mozRequestAnimationFrame ||
      (window as any).webkitRequestAnimationFrame || (window as any).msRequestAnimationFrame

      requestAnimationFrame(() => {
        callback && callback()
      })
    }

    HandleHexagonStyle({ x, y, z }, nodeActive)

    // 坐标转换，这么写方便后续能阅读懂
    const { x: hexX, y: HexY } = cubeToAxial(x, y, z)
    // 计算坐标位置
    let { x: _x, y: _y } = calcTranslate(layout, { x: hexX, y: HexY })
    // 计算缩放值
    const _scale = scale || (isBrowser ? 1.4 : isMobile ? 1.2 : 1)
    // 计算坐标位置数据
    const { x: xVal, y: yVal } = calcTranslateValue({
      x: _x,
      y: _y,
      width: width,
      height: height,
      scale: _scale
    })

    svg.transition()
      .duration(duration)
      .call(
        zoom.transform,
        d3.zoomIdentity.translate(xVal, yVal).scale(_scale),
      )
      .on('start', showUserMore)
      .on('end', eventEnd)
      svg.node()
  }, [allNodeMap, currentNode, layout, Toast, t, width, height])

  /**
   * 偏移地图坐标 默认取消动画使用
   */
  const translateMapDefault = useCallback(({ x, y, z }: PointState, nodeActive: boolean = true) => {
    const svg = d3.select('#container svg')

    HandleHexagonStyle({ x, y, z }, nodeActive)

    // 坐标转换，这么写方便后续能阅读懂
    const { x: hexX, y: HexY } = cubeToAxial(x, y, z)
    let { x: _x, y: _y } = calcTranslate(layout, { x: hexX, y: HexY })
    svg.transition()
      .duration(0)
      .call(
        zoom.transform,
        d3.zoomIdentity.translate(_x, _y).scale(1),
      )
  }, [ layout ])

  /**
   * 获取自己的坐标点
   */
  const fetchHexGridsMine = useCallback(
    async (hexList: HexagonsState[]) => {
      setHexGridsMineTag(false)

      const data = await fetchHexGridsMineAPI()

      if (data) {
        setHexGridsMineData(data)
      }

      // 默认地图偏移
      const defaultTranslateMap = () => {
        const hexagon = Math.ceil(width / 50.13)
        // hexagon % 2 === 0 ? hexagon / 2 : (hexagon - 1 / 2)
        let zoneRadius = hexagon % 2 === 0 ? hexagon / 2 : (hexagon - 1 / 2)

        if (data) {
          const { x, y, z } = data

          const point = calcZoneRadius({
            centerPoint: { q: x , s: y , r: z },
            hex: hexList,
            zoneRadius: zoneRadius
          })
    
          setCurrentHex(Array.from(point, ([, value]) => value))

          translateMapDefault({ x, y, z }, true)
        } else {

        const point = calcZoneRadius({
          centerPoint: currentHexPoint,
          hex: hexList,
          zoneRadius: zoneRadius
        })
  
        setCurrentHex(Array.from(point, ([, value]) => value))

          translateMapDefault(defaultPoint, false)
        }
      }

      const { cube } = qs.parse(window.location.search, { ignoreQueryPrefix: true })

      if (cube) {
        const _cubeData = keyFormatParse(cube as string)
        if (_cubeData) {
          translateMapDefault({ x: _cubeData.x, y: _cubeData.y, z: _cubeData.z }, true)
        } else {
          defaultTranslateMap()
        }
      } else {
        defaultTranslateMap()
      }

      setHexGridsMineTag(true)
    }, [defaultPoint, currentHexPoint, translateMapDefault, width])

  /**
   * 渲染坐标地图
   */
  const render = useCallback((list: hexGridsByFilterState[], forbiddenZoneRadius: number) => {
    const generator = GridGenerator.getGenerator(map)
    const _mapProps = list.length ? calcMaxDistance(list, 20) : mapProps
    const hexagons: HexagonsState[] = generator.apply(null, _mapProps)

    setMapProps(_mapProps)

    // console.log('list render', list)
    // console.log('list hexagons', hexagons)

    // 计算禁用坐标
    const pointsForbidden = calcForbiddenZoneRadius({
      hex: hexagons, forbiddenZoneRadius: forbiddenZoneRadius
    })
    setAllNodeDisabled(pointsForbidden)

    // 计算可选坐标
    const pointsChoose = calcAllNodeChooseZoneRadius({
      hex: hexagons,
      allNode: list,
      distance: 1
    })
    setAllNodeChoose(pointsChoose)

    // const renderMode = StoreGet(KEY_RENDER_MODE) || KEY_RENDER_MODE_DEFAULT_VALUE
    const renderMode = 'full'
    if (false && list.length) {
      // merged
      let hexChoose = Array.from(pointsChoose, ([, value]) => value)
      let hexForbidden = Array.from(pointsForbidden, ([, value]) => value)

      let hexList = [...hexChoose, ...hexForbidden]
      let hexListResult = uniqBy(hexList, n => [n.q, n.s, n.r].join())

      // console.log('newMap', hexListResult)
      setHex(hexListResult)
    } else {
      setHex(hexagons)
    }

    setContainerDrag()
    fetchHexGridsMine(hexagons)
  }, [mapProps, map, setContainerDrag, fetchHexGridsMine])

  /**
   * 获取范围坐标点
   */
  const fetchHexGriids = useCallback(
    async () => {
      const data = await fetchHexGriidsAPI(defaultHexGridsRange)

      // 获取禁用坐标
      const forbiddenZoneRadiusResult = await fetchForbiddenZoneRadiusAPI(forbiddenZoneRadius)
      if (forbiddenZoneRadiusResult !== forbiddenZoneRadius) {
        setforbiiddenZoneRadius(forbiddenZoneRadiusResult)
      }

      if (data) {
        let _map: Map<string, hexGridsByFilterState> = new Map()
        data.forEach(i => {
          const { x, y, z } = i
          _map.set(keyFormat({ x, y, z }), i)
        })

        setAllNode(data)
        setAllNodeMap(_map)

        render(data, forbiddenZoneRadiusResult)
      } else {
        render([], 0)
      }

      setFullLoading(false)
    }, [defaultHexGridsRange, forbiddenZoneRadius, render])

  /**
   * 处理收藏
   */
  const HandleBookmark = useCallback((currentNode: hexGridsByFilterState) => {
    const bookmark = StoreGet(KeyMetaNetWorkBookmark)
    const { x, y, z } = currentNode
    const point = { x, y, z }

    // 没有收藏记录
    if (isEmpty(bookmark)) {
      StoreSet(KeyMetaNetWorkBookmark, JSON.stringify([point]))
      Toast({ content: t('collection-success-tips') })
    } else {
      let bookmarkList: PointState[] = bookmark ? JSON.parse(bookmark) : []
      const bookmarkListIdx = bookmarkList.findIndex(i =>
        i.x === x &&
        i.y === y &&
        i.z === z
      )
      // 取消收藏
      if (~bookmarkListIdx) {
        bookmarkList.splice(bookmarkListIdx, 1)
        Toast({ content: t('delete-bookmark') })
      } else {
        bookmarkList.push(point)
        Toast({ content: t('collection-success-tips') })
      }

      StoreSet(KeyMetaNetWorkBookmark, JSON.stringify(bookmarkList))
    }

    fetchBookmark()
  }, [fetchBookmark, Toast, t])

  /**
   * 处理移除收藏
   */
  const HandleRemoveBookmark = useCallback(
    (bookmarkNodeList: hexGridsByFilterState[]) => {
      const bookmark = StoreGet(KeyMetaNetWorkBookmark)
      let bookmarkList: PointState[] = bookmark ? JSON.parse(bookmark) : []

      for (let i = 0; i < bookmarkNodeList.length; i++) {
        const ele = bookmarkNodeList[i]
        const idx = bookmarkList.findIndex(j =>
          j.x === ele.x &&
          j.y === ele.y &&
          j.z === ele.z
        )
        if (~idx) {
          bookmarkList.splice(idx, 1)
        }
      }

      StoreSet(KeyMetaNetWorkBookmark, JSON.stringify(bookmarkList))
      fetchBookmark()

      Toast({ content: t('success') })
    },
    [fetchBookmark, Toast, t]
  )

  // 处理占领
  const handleOccupied = useCallback(async () => {
    console.log('currentNodeChoose', currentNodeChoose)
    try {
      const resPointValidation = await hexGridsCoordinateValidation(currentNodeChoose)
      if (resPointValidation.statusCode === 200 && resPointValidation.data) {
        // ('允许占领')
      } else {
        throw new Error(resPointValidation.message)
      }
    } catch (e: any) {
      console.log(e)
      Toast({ content: e.message, type: 'warning' })
      return
    }

    try {
      const res = await hexGrids(currentNodeChoose)
      if (res.statusCode === 201) {
        Toast({ content: t('successful-occupation') })

        fetchHexGriids()
        setIsModalVisibleOccupied(false)
      } else {
        throw new Error(res.message)
      }
    } catch (e: any) {
      console.log(e)
      Toast({ content: e.message, type: 'warning' })
    }
  }, [currentNodeChoose, fetchHexGriids, Toast, t])

  // 重置定位
  const HandlePosition = useCallback(() => {
    if (isEmpty(hexGridsMineData)) {
      translateMap({
        point: defaultPoint,
        showUserInfo: false,
        nodeActive: false
      })
    } else {
      translateMap({
        point: { x: hexGridsMineData.x, y: hexGridsMineData.y, z: hexGridsMineData.z },
        showUserInfo: false
      })
    }
    setCurrentNode({} as hexGridsByFilterState)
  }, [hexGridsMineData, defaultPoint, translateMap])

  /**
   * 浏览历史
   */
  const HandleHistoryView = useCallback((point: PointState) => {
    const historyView = StoreGet(KeyMetaNetWorkHistoryView)
    const { x, y, z } = point

    // 没有历史浏览记录
    if (isEmpty(historyView)) {
      StoreSet(KeyMetaNetWorkHistoryView, JSON.stringify([point]))
    } else {
      let historyViewList: PointState[] = historyView ? JSON.parse(historyView) : []
      const historyViewIdx = historyViewList.findIndex(i =>
        i.x === x &&
        i.y === y &&
        i.z === z
      )

      // 浏览过了
      if (~historyViewIdx) {
        const temp = cloneDeep(historyViewList[historyViewIdx])
        historyViewList.splice(historyViewIdx, 1)
        historyViewList.push(temp)
      } else {
        if (historyViewList.length >= 6) {
          historyViewList.shift()
        }
        historyViewList.push(point)
      }

      StoreSet(KeyMetaNetWorkHistoryView, JSON.stringify(historyViewList))
    }

    fetchHistoryView()
  }, [fetchHistoryView])

  const handleAddItem = useCallback(
    () => {

      const hexagon = Math.ceil(width / 50.13)
      // hexagon % 2 === 0 ? hexagon / 2 : (hexagon - 1 / 2)
      let zoneRadius = hexagon % 2 === 0 ? hexagon / 2 : (hexagon - 1 / 2)

      const point = calcZoneRadius({
        centerPoint: currentHexPoint,
        hex: hex,
        zoneRadius: zoneRadius
      })

      console.log('point', point)
      setCurrentHex(Array.from(point, ([, value]) => value))
    }, [hex, currentHexPoint, width])

  const move = useCallback(({
    point,
    scale,
    showUserInfo,
    nodeActive,
    callback,
    duration
  }: translateMapState) => {
    console.log('point', point)

    const hexagon = Math.ceil(width / 50.13)
    // hexagon % 2 === 0 ? hexagon / 2 : (hexagon - 1 / 2)
    let zoneRadius = hexagon % 2 === 0 ? hexagon / 2 : (hexagon - 1 / 2)

    const { x, y, z } = point
    const list = calcZoneRadius({
      centerPoint: { q: x, r: z, s: y },
      hex: hex,
      zoneRadius: zoneRadius
    })
    setCurrentHex(Array.from(list, ([, value]) => value))
    setCurrentHexPoint({ q: x, r: z, s: y })

    translateMap({
      point,
      scale,
      showUserInfo,
      nodeActive,
      callback,
      duration
    })
  }, [hex, translateMap, width])

  // init
  useMount(
    () => {
      setFullLoading(true)

      fetchHexGriids()

      resizeFn()
      window.addEventListener('resize', resizeFn)
      fetchBookmark()
      fetchHistoryView()
    }
  )

  useUnmount(() => {
    window.removeEventListener('resize', resizeFn)
  })

  return (
    <>
      <MapContainer
        width={width}
        height={height}
        size={size}
        layout={layout}
        hex={currentHex}
        setCurrentNodeMouse={setCurrentNodeMouse}
        allNodeDisabled={allNodeDisabled}
        allNodeMap={allNodeMap}
        allNodeChoose={allNodeChoose}
        defaultPoint={defaultPoint}
        bookmark={bookmark}
        noticeBardOccupiedState={noticeBardOccupiedState}
        hexGridsMineData={hexGridsMineData}
        origin={origin}
        currentNode={currentNode}
        setCurrentNode={setCurrentNode}
        setCurrentNodeChoose={setCurrentNodeChoose}
        setIsModalVisibleOccupied={setIsModalVisibleOccupied}
        handleHistoryView={HandleHistoryView}
        translateMap={move}
      >

      </MapContainer>
      <MarkContainer></MarkContainer>
      <DeploySite
        isModalVisible={isModalVisibleDeploySite}
        setIsModalVisible={setIsModalVisibleDeploySite}></DeploySite>
      <Occupied
        isModalVisible={isModalVisibleOccupied}
        setIsModalVisible={setIsModalVisibleOccupied}
        handleOccupied={handleOccupied}></Occupied>
      {
        isEmpty(hexGridsMineData) && hexGridsMineTag && isLoggin ?
          <NoticeBardOccupied
            status={noticeBardOccupiedState}
            setNoticeBardOccupiedState={setNoticeBardOccupiedState}
          ></NoticeBardOccupied> : null
      }
      {
        !isEmpty(hexGridsMineData) && hexGridsMineTag && isLoggin && !hexGridsMineData.subdomain
        ? <NoticeBardCreateSpace></NoticeBardCreateSpace>
        : null
      }
      <HexGridsCount range={defaultHexGridsRange}></HexGridsCount>
      <HomeArrow
        hexGridsMineData={hexGridsMineData} ></HomeArrow>
      <MapPosition HandlePosition={HandlePosition}></MapPosition>
      <MapZoom></MapZoom>
      <UserInfo
        bookmark={bookmark}
        currentNode={currentNode}
        HandleBookmark={HandleBookmark}
        url={currentNode.userAvatar}
        focus$={focus$}
        translateMap={translateMap}
      ></UserInfo>
      <UserInfoMouse
        currentNode={currentNode}
        currentNodeMouse={currentNodeMouse}
        url={currentNodeMouse.userAvatar}></UserInfoMouse>
      <NodeHistory
        allNodeMap={allNodeMap}
        historyView={historyView}
        currentNode={currentNode}
        setCurrentNode={setCurrentNode}
        translateMap={translateMap}
        HandleHistoryView={HandleHistoryView}
      ></NodeHistory>
      <FullLoading loading={fullLoading} setLoading={setFullLoading} />
      <PointDEV></PointDEV>
      <div style={{ position: 'fixed', right: 0, top: 0, zIndex: 100 }}>
        <button onClick={handleAddItem}>Toggle</button>
      </div>
    </>
  )
}

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      // Will be passed to the page component as props
    },
  }
}

export default Home