import React, { useEffect, useState, useRef, createRef, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic'
// import rd3 from 'react-d3-library'
// import * as d3 from 'd3';
import { G, Point, SVG } from '@svgdotjs/svg.js'
import { HexGrid, Layout, Hexagon, Text, GridGenerator, HexUtils } from 'react-hexgrid';
import styled from 'styled-components'
import { useSpring, animated, useSpringRef, useTransition, useChain } from 'react-spring'
import { assign, cloneDeep, isEmpty, shuffle, random } from 'lodash'
import { useMount, useUnmount, useThrottleFn, useInViewport } from 'ahooks'
import { isBrowser } from "react-device-detect"
import styles from './index/index.module.scss'

import { Hex } from '../utils/lib'
import { StoreGet, StoreSet } from '../utils/store'
import {
  cubeToAxial, calcTranslate, calcMaxDistance,
  calcCenterRangeAsMap, angle,
  isInViewPort, HandleHexagonStyle, strEllipsis
} from '../utils/index'
import { PointState, HexagonsState, AxialState, LayoutState } from '../typings/node.d'
import { hexGridsByFilterState, PointScopeState } from '../typings/metaNetwork.d'

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

import {
  hexGridsByFilter, hexGridsCoordinateValidation, hexGrids,
  hexGridsMine
} from '../services/metaNetwork'
import { useUser } from '../hooks/useUser'
import { fetchForbiddenZoneRadius } from '../helpers/index'
import useToast from '../hooks/useToast'

let d3: any = null
let zoom: any = null
if (process.browser) {
  d3 = require('d3')
  zoom = d3.zoom();
}
const KeyMetaNetWorkBookmark = 'MetaNetWorkBookmark'
const KeyMetaNetWorkHistoryView = 'MetaNetWorkHistoryView'
let ID: number

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
  // 收藏坐标点 合并数据后
  const bookmarkNode = useMemo(() => {
    let _bookmark = cloneDeep(bookmark)

    for (let i = 0; i < _bookmark.length; i++) {
      const ele = _bookmark[i];
      const { x, y, z } = ele
      const _node = allNodeMap.get(`${x}${y}${z}`)
      if (_node) {
        assign(ele, _node)
      }
    }
    // console.log('_bookmark', _bookmark)

    return _bookmark.reverse() as hexGridsByFilterState[]
  }, [allNodeMap, bookmark])

  // 历史预览
  const [historyView, setHistoryView] = useState<PointState[]>([])
  const historyViewNode = useMemo(() => {
    let _historyView = cloneDeep(historyView)

    for (let i = 0; i < _historyView.length; i++) {
      const ele = _historyView[i];
      const { x, y, z } = ele
      const _node = allNodeMap.get(`${x}${y}${z}`)
      if (_node) {
        assign(ele, _node)
      }
    }
    // console.log('_historyView', _historyView)

    return _historyView as hexGridsByFilterState[]
  }, [allNodeMap, historyView])


  // NoticeBard Occupied
  const noticeBardOccupiedAnimatedStyles = useSpring({
    from: { x: '-50%', y: -40, opacity: 0 },
    to: { x: '-50%', y: 0, opacity: 1 },
    config: {
      duration: 300
    },
    delay: 1000
  })

  // 默认禁用区域半径
  const [forbiddenZoneRadius, setforbiiddenZoneRadius] = useState<number>(10)
  // 箭头角度
  const [homeAngle, setHomeAngle] = useState<number>(0)
  // 自己的坐标是否在屏幕内
  const [inViewPortHexagonOwner, setInViewPortHexagonOwner] = useState<boolean | undefined>()
  // console.log('inViewPortHexagonOwner', inViewPortHexagonOwner)

  const { isLoggin } = useUser()


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

  /**
   * 计算角度
   */
  const calcAngle = useCallback(
    () => {
      const tag = document.querySelector<HTMLElement>('.hexagon-owner')
      const inViewPortResult = isInViewPort(tag!)
      setInViewPortHexagonOwner(inViewPortResult)

      // console.log('tag', tag, inViewPortResult)

      // 在窗口内不计算 undefined 不计算
      // 没有坐标点不计算
      if (
        (inViewPortResult || inViewPortResult === undefined)
        || isEmpty(hexGridsMineData)
      ) {
        //
      } else {

        // 没有 DOM 不计算, 没有 DOM getBoundingClientRect 不计算
        // 如果没有 DOM isInViewPort 方法里面会返回 undefined 在上面拦截

        const { x, y, width: domWidth, height: domHeight } = tag!.getBoundingClientRect()
        const angleResult = angle(
          { x: 0, y: 0 },
          {
            x: x - width / 2 + (domWidth / 2),
            y: y - height / 2 + (domHeight / 2)
          }
        )

        // console.log('angle', angleResult)
        setHomeAngle(angleResult)
      }

      cancelAnimationFrame(ID)
      ID = requestAnimationFrame(calcAngle)

    }, [hexGridsMineData, width, height]);

  // 计算所有可选择坐标范围
  useEffect(() => {
    //  未开启选择功能
    // if (!noticeBardOccupiedState) {
    //   setAllNodeChoose([])
    //   return
    // }
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

  useEffect(() => {
    if (process.browser) {
      const requestAnimationFrame = window.requestAnimationFrame || (window as any).mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame || (window as any).msRequestAnimationFrame

      ID = requestAnimationFrame(calcAngle)
    }
    return () => {
      if (process.browser) {
        const cancelAnimationFrame = window.cancelAnimationFrame || (window as any).mozCancelAnimationFrame

        cancelAnimationFrame(ID)
      }
    }
  }, [calcAngle])

  // 计算半径为10不可选区域
  const calcForbiddenZoneRadius = (hex: HexagonsState[], forbiddenZoneRadius: number) => {
    const center = new Hex(0, 0, 0)
    const points = calcCenterRangeAsMap(center, hex, forbiddenZoneRadius)

    setAllNodeDisabled(points)
    console.log('计算半径为10不可选区域 只需要执行一次')
  }

  // 获取收藏记录
  const fetchBookmark = useCallback(() => {
    const bookmark = StoreGet(KeyMetaNetWorkBookmark)
    let bookmarkList: PointState[] = bookmark ? JSON.parse(bookmark) : []
    setBookmark(bookmarkList)
  }, [])

  // 获取历史浏览记录
  const fetchHistoryView = useCallback(() => {
    const historyViewStore = StoreGet(KeyMetaNetWorkHistoryView)
    let historyViewStoreList: PointState[] = historyViewStore ? JSON.parse(historyViewStore) : []
    setHistoryView(historyViewStoreList)
  }, [])

  // 设置内容拖动 缩放
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
      svg.attr("transform", tran);
    }

    svg.node();
  }, [width, height])

  // 偏移地图坐标
  const translateMap = useCallback(({ x, y, z }: PointState, showUserInfo: boolean = true) => {
    const svg = d3.select('#container svg')

    const showUserMore = () => {

      if (!showUserInfo) {
        return
      }
      const node = allNodeMap.get(`${x}${y}${z}`)
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

  // 获取自己的坐标点
  const fetchHexGridsMine = useCallback(
    async () => {
      setHexGridsMineTag(false)
      try {
        const res = await hexGridsMine()
        if (res.statusCode === 200 && res.data) {
          setHexGridsMineData(res.data)

          translateMap({ x: res.data.x, y: res.data.y, z: res.data.z }, false)
        } else {
          throw new Error('没有占领')
        }
      } catch (e) {
        console.log(e)
        translateMap(defaultPoint, false)
      } finally {
        setHexGridsMineTag(true)
      }
    }, [defaultPoint, translateMap])

  // 渲染坐标地图
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

  // 获取范围坐标点
  const fetchHexGriids = useCallback(
    async () => {
      try {
        const res = await hexGridsByFilter(defaultHexGridsRange)

        // 获取禁用坐标
        const forbiddenZoneRadiusResult = await fetchForbiddenZoneRadius(forbiddenZoneRadius)
        if (forbiddenZoneRadiusResult !== forbiddenZoneRadius) {
          setforbiiddenZoneRadius(forbiddenZoneRadiusResult)
        }

        if (res.statusCode === 200) {

          let _map: Map<string, hexGridsByFilterState> = new Map()
          res.data.forEach(i => {
            const { x, y, z } = i
            _map.set(`${x}${y}${z}`, i)
          })

          setAllNode(res.data)
          setAllNodeMap(_map)

          render(res.data, forbiddenZoneRadiusResult)
        } else {
          // console.log('获取失败')
          throw new Error('获取失败')
        }
      } catch (e) {
        console.log('e', e)
        render([], 0)
      }
    }, [defaultHexGridsRange, forbiddenZoneRadius, render])

  // 处理点击地图事件
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
      Toast({ content: '请选择紧挨已注册用户的地块' })
      return
    } else if (mode === 'disabled') {
      return
    }

    translateMap({
      x: point.x,
      y: point.y,
      z: point.z
    })

    HandleHistoryView(point)
  }

  // 处理收藏
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

  // 处理移除收藏
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

  // 处理历史记录点击
  const HandleHistoryViewClick = useCallback((point: PointState) => {
    const { x, y, z } = point

    // 重复点击垱前块
    if (currentNode.x === x && currentNode.y === y && currentNode.z === z) {
      setCurrentNode({} as hexGridsByFilterState)
    }

    translateMap({
      x,
      y,
      z
    })

    HandleHistoryView(point)
  }, [currentNode, translateMap, HandleHistoryView])

  return (
    <>
      <ToggleSlider
        translateMap={translateMap}
        bookmarkNode={bookmarkNode}
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
        handleHexagonEventClick={handleHexagonEventClick}
        setCurrentNodeMouse={setCurrentNodeMouse}
        allNodeDisabled={allNodeDisabled}
        allNodeMap={allNodeMap}
        allNodeChoose={allNodeChoose}
        defaultPoint={defaultPoint}
        bookmark={bookmark}
        noticeBardOccupiedState={noticeBardOccupiedState}
        hexGridsMineData={hexGridsMineData}
        origin={origin}
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
            style={noticeBardOccupiedAnimatedStyles}
            status={noticeBardOccupiedState}
            setNoticeBardOccupiedState={setNoticeBardOccupiedState}
          ></NoticeBardOccupied> : null
      }
      <HexGridsCount range={defaultHexGridsRange}></HexGridsCount>
      {
        !inViewPortHexagonOwner && inViewPortHexagonOwner !== undefined && !isEmpty(hexGridsMineData) ?
          <HomeArrow angleValue={homeAngle}></HomeArrow> : null
      }
      <MapPosition HandlePosition={HandlePosition}></MapPosition>
      <MapZoom></MapZoom>
      <UserInfo
        bookmark={bookmark}
        currentNode={currentNode}
        HandleBookmark={HandleBookmark}
        url={currentNode.userAvatar}
      ></UserInfo>
      <UserInfoMouse
        currentNode={currentNode}
        currentNodeMouse={currentNodeMouse}
        url={currentNodeMouse.userAvatar}></UserInfoMouse>
      <NodeHistory
        historyViewList={historyViewNode}
        HandleHistoryViewClick={HandleHistoryViewClick}></NodeHistory>
      <PointDEV></PointDEV>
    </>
  )
}

export default Home