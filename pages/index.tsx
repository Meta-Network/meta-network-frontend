import React, { useEffect, useState, useRef, createRef, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic'
// import rd3 from 'react-d3-library'
// import * as d3 from 'd3';
// import { G, Point, SVG } from '@svgdotjs/svg.js'
import { HexGrid, Layout, Hexagon, Text, GridGenerator, HexUtils } from 'react-hexgrid';
import { assign, cloneDeep, isEmpty } from 'lodash'
import { useMount, useUnmount, useThrottleFn, useEventEmitter, useDebounceFn } from 'ahooks'

import { Hex } from '../utils/lib'
import { StoreGet, StoreSet } from '../utils/store'
import {
  cubeToAxial, calcTranslate, calcMaxDistance,
  calcCenterRangeAsMap, angle,
  isInViewPort, HandleHexagonStyle, strEllipsis,
  keyFormat
} from '../utils/index'
import { PointState, HexagonsState, AxialState, LayoutState } from '../typings/node.d'
import { hexGridsByFilterState, PointScopeState } from '../typings/metaNetwork.d'
import { hexGridsCoordinateValidation, hexGrids } from '../services/metaNetwork'
import { useUser } from '../hooks/useUser'
import { fetchForbiddenZoneRadiusAPI, fetchHexGridsMineAPI, fetchHexGriidsAPI } from '../helpers/index'
import useToast from '../hooks/useToast'

const ToggleSlider = dynamic(() => import('../components/Slider/ToggleSlider'), { ssr: false })
const DeploySite = dynamic(() => import('../components/DeploySite/Index'), { ssr: false })
const Occupied = dynamic(() => import('../components/Occupied/Index'), { ssr: false })
const NoticeBardOccupied = dynamic(() => import('../components/NoticeBardOccupied/Index'), { ssr: false })
const MarkContainer = dynamic(() => import('../components/MarkContainer/Index'), { ssr: false })
const HexGridsCount = dynamic(() => import('../components/HexGridsCount/Index'), { ssr: false })
const HomeArrow = dynamic(() => import('../components/HomeArrow/Index'), { ssr: false })
const MapPosition = dynamic(() => import('../components/MapPosition/Index'), { ssr: false })
const MapZoom = dynamic(() => import('../components/MapZoom/Index'), { ssr: false })
const UserInfo = dynamic(() => import('../components/IndexPage/UserInfo'), { ssr: false })
const UserInfoMouse = dynamic(() => import('../components/IndexPage/UserInfoMouse'), { ssr: false })
const NodeHistory = dynamic(() => import('../components/IndexPage/NodeHistory'), { ssr: false })
const PointDEV = dynamic(() => import('../components/PointDEV/Index'), { ssr: false })
const MapContainer = dynamic(() => import('../components/MapContainer/Index'), { ssr: false })


let d3: any = null
let zoom: any = null
if (process.browser) {
  d3 = require('d3')
  zoom = d3.zoom()
}
const KeyMetaNetWorkBookmark = 'MetaNetWorkBookmark'
const KeyMetaNetWorkHistoryView = 'MetaNetWorkHistoryView'

const Home = () => {
  const { Toast } = useToast()

  // hex all 坐标点
  const [hex, setHex] = useState<HexagonsState[]>([]);
  const [map, setMap] = useState<string>('hexagon')
  const [mapProps, setMapProps] = useState<number[]>([15])
  const [layout, setLayout] = useState<LayoutState>({ width: 66, height: 66, flat: false, spacing: 1.1 })
  const [size, setSize] = useState<AxialState>({ x: layout.width, y: layout.height })
  const [width, setWidth] = useState<number>(1000);
  const [height, setHeight] = useState<number>(800);
  const [origin, setOrigin] = useState<AxialState>({ x: 100, y: 100 });
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
  const [allNode, setAllNode] = useState<hexGridsByFilterState[]>([]);
  const [allNodeMap, setAllNodeMap] = useState<Map<string, hexGridsByFilterState>>(new Map());
  // 所有可以选择的节点
  const [allNodeChoose, setAllNodeChoose] = useState<Map<string, HexagonsState>>(new Map());
  // 所有禁止选择的节点
  const [allNodeDisabled, setAllNodeDisabled] = useState<Map<string, HexagonsState>>(new Map());
  // 当前选择节点
  const [currentNode, setCurrentNode] = useState<hexGridsByFilterState>({} as hexGridsByFilterState);
  const [currentNodeMouse, setCurrentNodeMouse] = useState<hexGridsByFilterState>({} as hexGridsByFilterState);
  // 当前占领节点
  const [currentNodeChoose, setCurrentNodeChoose] = useState<PointState>({} as PointState);
  // 部署网站 Modal
  const [isModalVisibleDeploySite, setIsModalVisibleDeploySite] = useState<boolean>(false);
  // 占领 Modal
  const [isModalVisibleOccupied, setIsModalVisibleOccupied] = useState<boolean>(false);
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
  );

  // 计算所有可选择坐标范围
  useEffect(() => {
    // 已经占领
    if (!isEmpty(hexGridsMineData)) {
      setAllNodeChoose(new Map())
      return
    }

    if (allNode.length) {
      let points: Map<string, HexagonsState> = new Map()
      let distance = 1

      for (let i = 0; i < allNode.length; i++) {
        const eleAllNode = allNode[i];
        // 捕获 new hex 错误
        try {
          let center = new Hex(eleAllNode.x, eleAllNode.z, eleAllNode.y)
          calcCenterRangeAsMap(center, hex, distance, points)
        } catch (e) {
          console.log('e', e)
          continue
        }
      }

      setAllNodeChoose(points)
    }
  }, [allNode, hex, noticeBardOccupiedState, hexGridsMineData])


  // init
  useMount(
    () => {
      fetchHexGriids()

      resizeFn()
      window.addEventListener('resize', resizeFn)
      fetchBookmark()
      fetchHistoryView()
    }
  );

  useUnmount(() => {
    window.removeEventListener('resize', resizeFn)
  })

  /**
   * 计算半径为10不可选区域
   */
  const calcForbiddenZoneRadius = (hex: HexagonsState[], forbiddenZoneRadius: number) => {
    const center = new Hex(0, 0, 0)
    const points = calcCenterRangeAsMap(center, hex, forbiddenZoneRadius)

    setAllNodeDisabled(points)
    console.log('计算半径为10不可选区域 只需要执行一次')
  }

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
  const { run: emitEvent } = useDebounceFn(
    () => {
      focus$.emit('zoom')
    },
    {
      wait: 300,
    },
  )

  /**
   * 设置内容拖动 缩放
   */
  const setContainerDrag = useCallback(() => {
    const svg = d3.select('#container svg')
    let oldTransform: { k: number, x: number, y: number } | null = null

    svg.call(
      zoom
        .extent([[0, 0], [width, height]])
        .scaleExtent([0.4, 4])
        .on("zoom", zoomed)
    )

    function zoomed({ transform }: { transform: { k: number, x: number, y: number } }) {
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
      let svgBox = svg.node().getBBox()
      let svgContentWidth = svgBox.width
      let svgContentHeight = svgBox.height

      // console.log('svgContentWidth', svgContentWidth)
      // console.log('svgContentHeight', svgContentHeight)

      const numberFloor = (n: number, k: number) => {
        return Math.floor((n / 2) * k)
      }

      if (transform.x >= numberFloor(svgContentWidth, transform.k)) {
        tran = assign(transform, { x: numberFloor(svgContentWidth, transform.k) })
      }
      if (transform.y >= numberFloor(svgContentHeight, transform.k)) {
        tran = assign(transform, { y: numberFloor(svgContentHeight, transform.k) })
      }

      if (transform.x <= numberFloor(-(svgContentWidth), transform.k)) {
        tran = assign(transform, { x: numberFloor(-(svgContentWidth), transform.k) })
      }
      if (transform.y <= numberFloor(-(svgContentHeight), transform.k)) {
        tran = assign(transform, { y: numberFloor(-(svgContentHeight), transform.k) })
      }
      svg.attr('transform', tran);

      emitEvent()
    }

    svg.node();
  }, [width, height, emitEvent])

  /**
   * 偏移地图坐标
   */
  const translateMap = useCallback(({ x, y, z }: PointState, showUserInfo: boolean = true) => {
    const svg = d3.select('#container svg')

    const showUserMore = () => {

      if (!showUserInfo) {
        return
      }
      const node = allNodeMap.get(keyFormat({ x, y, z }))
      if (!node) {
        Toast({ content: '没有坐标数据' })
        return
      }
      // 重复点击垱前块 Toggle
      if (currentNode.x === x && currentNode.y === y && currentNode.z === z) {
        //
      } else {
        setCurrentNode(node)
      }
    }

    HandleHexagonStyle({ x, y, z })

    // 坐标转换，这么写方便后续能阅读懂
    const { x: hexX, y: HexY } = cubeToAxial(x, y, z)
    let { x: _x, y: _y } = calcTranslate(layout, { x: hexX, y: HexY })
    svg.transition()
      .duration(1000)
      .call(
        zoom.transform,
        d3.zoomIdentity.translate(_x, _y).scale(1),
      )
      .on('end', showUserMore)
  }, [allNodeMap, currentNode, layout, Toast])

  /**
   * 获取自己的坐标点
   */
  const fetchHexGridsMine = useCallback(
    async () => {
      setHexGridsMineTag(false)
      const data = await fetchHexGridsMineAPI()
      if (data) {
        setHexGridsMineData(data)
        translateMap({ x: data.x, y: data.y, z: data.z }, false)
      } else {
        translateMap(defaultPoint, false)
      }

      setHexGridsMineTag(true)
    }, [defaultPoint, translateMap])

  /**
   * 渲染坐标地图
   */
  const render = useCallback((list: hexGridsByFilterState[], forbiddenZoneRadius: number) => {
    const generator = GridGenerator.getGenerator(map);
    const _mapProps = list.length ? calcMaxDistance(list) : mapProps
    const hexagons = generator.apply(null, _mapProps);

    console.log('hexagons', hexagons)
    setHex(hexagons)
    setContainerDrag()
    calcForbiddenZoneRadius(hexagons, forbiddenZoneRadius)
    fetchHexGridsMine()
  }, [mapProps, map, setContainerDrag, fetchHexGridsMine]);

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
          _map.set(keyFormat({x, y, z}), i)
        })

        setAllNode(data)
        setAllNodeMap(_map)

        render(data, forbiddenZoneRadiusResult)
      } else {
        render([], 0)
      }
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
      Toast({ content: '收藏成功' })
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
        Toast({ content: '取消收藏' })
      } else {
        bookmarkList.push(point)
        Toast({ content: '收藏成功' })
      }

      StoreSet(KeyMetaNetWorkBookmark, JSON.stringify(bookmarkList))
    }

    fetchBookmark()
  }, [fetchBookmark, Toast])

  /**
   * 处理移除收藏
   */
  const HandleRemoveBookmark = useCallback(
    (bookmarkNodeList: hexGridsByFilterState[]) => {
      const bookmark = StoreGet(KeyMetaNetWorkBookmark)
      let bookmarkList: PointState[] = bookmark ? JSON.parse(bookmark) : []

      for (let i = 0; i < bookmarkNodeList.length; i++) {
        const ele = bookmarkNodeList[i];
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

      Toast({ content: '移除收藏成功' })
    },
    [fetchBookmark, Toast]
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
    } catch (e) {
      console.log(e)
      Toast({ content: e.message, type: 'warning' })
      return
    }

    try {
      const res = await hexGrids(currentNodeChoose)
      if (res.statusCode === 201) {
        Toast({ content: '占领成功' })

        fetchHexGriids()
        setIsModalVisibleOccupied(false)
      } else {
        throw new Error(res.message)
      }
    } catch (e) {
      console.log(e)
      Toast({ content: e.message, type: 'warning' })
    }
  }, [currentNodeChoose, fetchHexGriids, Toast])

  // 重置定位
  const HandlePosition = useCallback(() => {
    if (isEmpty(hexGridsMineData)) {
      translateMap(defaultPoint, false)
    } else {
      translateMap({ x: hexGridsMineData.x, y: hexGridsMineData.y, z: hexGridsMineData.z }, false)
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

  return (
    <>
      <ToggleSlider
        translateMap={translateMap}
        allNodeMap={allNodeMap}
        bookmark={bookmark}
        defaultHexGridsRange={defaultHexGridsRange}
        HandleRemoveBookmark={HandleRemoveBookmark}
      >
      </ToggleSlider>
      <MapContainer
        width={width}
        height={height}
        size={size}
        layout={layout}
        hex={hex}
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
        HandleHistoryView={HandleHistoryView}
        translateMap={translateMap}
      ></MapContainer>
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
      <PointDEV></PointDEV>
    </>
  )
}

export default Home