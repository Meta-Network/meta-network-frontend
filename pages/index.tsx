import React, { useEffect, useState, useRef, createRef, useCallback, useMemo } from 'react'
import dynamic from 'next/dynamic'
// import rd3 from 'react-d3-library'
// import * as d3 from 'd3';
// import { G, Point, SVG } from '@svgdotjs/svg.js'
import { HexGrid, Layout, Hexagon, Text, GridGenerator, HexUtils } from 'react-hexgrid'
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
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

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
  const { t } = useTranslation('common')
  const { Toast } = useToast()

  // hex all ?????????
  const [hex, setHex] = useState<HexagonsState[]>([])
  const [map, setMap] = useState<string>('hexagon')
  const [mapProps, setMapProps] = useState<number[]>([15])
  const [layout, setLayout] = useState<LayoutState>({ width: 66, height: 66, flat: false, spacing: 1.1 })
  const [size, setSize] = useState<AxialState>({ x: layout.width, y: layout.height })
  const [width, setWidth] = useState<number>(1000)
  const [height, setHeight] = useState<number>(800)
  const [origin, setOrigin] = useState<AxialState>({ x: 100, y: 100 })
  // ???????????????
  const [defaultPoint] = useState<PointState>({ x: 0, y: 11, z: -11 })
  // ??????????????????
  const [defaultHexGridsRange] = useState<PointScopeState>({
    xMin: -90,
    xMax: 90,
    yMin: -90,
    yMax: 90,
    zMin: -90,
    zMax: 90,
    simpleQuery: ''
  })

  // ????????????
  const [allNode, setAllNode] = useState<hexGridsByFilterState[]>([])
  const [allNodeMap, setAllNodeMap] = useState<Map<string, hexGridsByFilterState>>(new Map())
  // ???????????????????????????
  const [allNodeChoose, setAllNodeChoose] = useState<Map<string, HexagonsState>>(new Map())
  // ???????????????????????????
  const [allNodeDisabled, setAllNodeDisabled] = useState<Map<string, HexagonsState>>(new Map())
  // ??????????????????
  const [currentNode, setCurrentNode] = useState<hexGridsByFilterState>({} as hexGridsByFilterState)
  const [currentNodeMouse, setCurrentNodeMouse] = useState<hexGridsByFilterState>({} as hexGridsByFilterState)
  // ??????????????????
  const [currentNodeChoose, setCurrentNodeChoose] = useState<PointState>({} as PointState)
  // ???????????? Modal
  const [isModalVisibleDeploySite, setIsModalVisibleDeploySite] = useState<boolean>(false)
  // ?????? Modal
  const [isModalVisibleOccupied, setIsModalVisibleOccupied] = useState<boolean>(false)
  // ??????????????????
  const [noticeBardOccupiedState, setNoticeBardOccupiedState] = useState<boolean>(false)
  // ?????????????????????
  const [hexGridsMineData, setHexGridsMineData] = useState<hexGridsByFilterState>({} as hexGridsByFilterState)
  // ????????????????????? ????????????
  const [hexGridsMineTag, setHexGridsMineTag] = useState<boolean>(false)
  // ???????????????
  const [bookmark, setBookmark] = useState<PointState[]>([])
  // ????????????
  const [historyView, setHistoryView] = useState<PointState[]>([])
  // ????????????????????????
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
  )

  // ?????????????????????????????????
  useEffect(() => {
    // ????????????
    if (!isEmpty(hexGridsMineData)) {
      setAllNodeChoose(new Map())
      return
    }

    if (allNode.length) {
      let points: Map<string, HexagonsState> = new Map()
      let distance = 1

      for (let i = 0; i < allNode.length; i++) {
        const eleAllNode = allNode[i]
        // ?????? new hex ??????
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
  )

  useUnmount(() => {
    window.removeEventListener('resize', resizeFn)
  })

  /**
   * ???????????????10???????????????
   */
  const calcForbiddenZoneRadius = (hex: HexagonsState[], forbiddenZoneRadius: number) => {
    const center = new Hex(0, 0, 0)
    const points = calcCenterRangeAsMap(center, hex, forbiddenZoneRadius)

    setAllNodeDisabled(points)
    console.log('???????????????10??????????????? ?????????????????????')
  }

  /**
   * ??????????????????
   */
  const fetchBookmark = useCallback(() => {
    const bookmark = StoreGet(KeyMetaNetWorkBookmark)
    let bookmarkList: PointState[] = bookmark ? JSON.parse(bookmark) : []
    setBookmark(bookmarkList)
  }, [])

  /**
   * ????????????????????????
   */
  const fetchHistoryView = useCallback(() => {
    const historyViewStore = StoreGet(KeyMetaNetWorkHistoryView)
    let historyViewStoreList: PointState[] = historyViewStore ? JSON.parse(historyViewStore) : []
    setHistoryView(historyViewStoreList)
  }, [])

  /**
   * ????????????
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
   * ?????????????????? ??????
   */
  const setContainerDrag = useCallback(() => {
    const svg = d3.select('#container svg')
    let oldTransform: { k: number, x: number, y: number } | null = null

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

    function zoomed({ transform }: { transform: { k: number, x: number, y: number } }) {
      // console.log('transform', transform, oldTransform)
      // ?????? ?????????????????????
      if (oldTransform && oldTransform.k === transform.k && oldTransform.x === transform.x && oldTransform.y === transform.y) {
        return
      }

      // ????????????
      let tran = transform
      // console.log('transform', transform)
      oldTransform = cloneDeep(transform)

      const svg = d3.select('#container svg > g')
      svg.attr('transform', tran)

      const svgG = d3.select('#container svg > g')
      const svgBox1 = svgG.node().getBBox()
      const { width: boxWidth, height: boxHeight } = svgBox1

      // TODO: ?????? ??????????????? ???????????????????????????
      // zoom.translateExtent([[-(boxWidth / 2) - width, -(boxHeight / 2) - height], [(boxWidth / 2) + width, (boxHeight / 2) + height]])
      zoom.translateExtent([[-(boxWidth / 2) - width, -(boxHeight / 2) - height], [(boxWidth), (boxHeight)]])

      emitEvent()
    }
  }, [width, height, emitEvent])

  /**
   * ??????????????????
   */
  const translateMap = useCallback(({ x, y, z }: PointState, showUserInfo: boolean = true) => {
    const svg = d3.select('#container svg')

    const showUserMore = () => {

      if (!showUserInfo) {
        return
      }
      const node = allNodeMap.get(keyFormat({ x, y, z }))
      if (!node) {
        Toast({ content: t('no-coordinate-data') })
        return
      }
      // ????????????????????? Toggle
      if (currentNode.x === x && currentNode.y === y && currentNode.z === z) {
        //
      } else {
        setCurrentNode(node)
      }
    }

    HandleHexagonStyle({ x, y, z })

    // ????????????????????????????????????????????????
    const { x: hexX, y: HexY } = cubeToAxial(x, y, z)
    let { x: _x, y: _y } = calcTranslate(layout, { x: hexX, y: HexY })
    svg.transition()
      .duration(1000)
      .call(
        zoom.transform,
        d3.zoomIdentity.translate(_x, _y).scale(1),
      )
      .on('end', showUserMore)
  }, [allNodeMap, currentNode, layout, Toast, t])

  /**
   * ????????????????????????
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
   * ??????????????????
   */
  const render = useCallback((list: hexGridsByFilterState[], forbiddenZoneRadius: number) => {
    const generator = GridGenerator.getGenerator(map)
    const _mapProps = list.length ? calcMaxDistance(list) : mapProps
    const hexagons = generator.apply(null, _mapProps)

    console.log('hexagons', hexagons)
    setHex(hexagons)
    setContainerDrag()
    calcForbiddenZoneRadius(hexagons, forbiddenZoneRadius)
    fetchHexGridsMine()
  }, [mapProps, map, setContainerDrag, fetchHexGridsMine])

  /**
   * ?????????????????????
   */
  const fetchHexGriids = useCallback(
    async () => {
      const data = await fetchHexGriidsAPI(defaultHexGridsRange)

      // ??????????????????
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
    }, [defaultHexGridsRange, forbiddenZoneRadius, render])

  /**
   * ????????????
   */
  const HandleBookmark = useCallback((currentNode: hexGridsByFilterState) => {
    const bookmark = StoreGet(KeyMetaNetWorkBookmark)
    const { x, y, z } = currentNode
    const point = { x, y, z }

    // ??????????????????
    if (isEmpty(bookmark)) {
      StoreSet(KeyMetaNetWorkBookmark, JSON.stringify([point]))
      Toast({ content: t('add-bookmark') })
    } else {
      let bookmarkList: PointState[] = bookmark ? JSON.parse(bookmark) : []
      const bookmarkListIdx = bookmarkList.findIndex(i =>
        i.x === x &&
        i.y === y &&
        i.z === z
      )
      // ????????????
      if (~bookmarkListIdx) {
        bookmarkList.splice(bookmarkListIdx, 1)
        Toast({ content: t('delete-bookmark') })
      } else {
        bookmarkList.push(point)
        Toast({ content: t('add-bookmark') })
      }

      StoreSet(KeyMetaNetWorkBookmark, JSON.stringify(bookmarkList))
    }

    fetchBookmark()
  }, [fetchBookmark, Toast, t])

  /**
   * ??????????????????
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

  // ????????????
  const handleOccupied = useCallback(async () => {
    console.log('currentNodeChoose', currentNodeChoose)
    try {
      const resPointValidation = await hexGridsCoordinateValidation(currentNodeChoose)
      if (resPointValidation.statusCode === 200 && resPointValidation.data) {
        // ('????????????')
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
        Toast({ content: t('successful-occupation') })

        fetchHexGriids()
        setIsModalVisibleOccupied(false)
      } else {
        throw new Error(res.message)
      }
    } catch (e) {
      console.log(e)
      Toast({ content: e.message, type: 'warning' })
    }
  }, [currentNodeChoose, fetchHexGriids, Toast, t])

  // ????????????
  const HandlePosition = useCallback(() => {
    if (isEmpty(hexGridsMineData)) {
      translateMap(defaultPoint, false)
    } else {
      translateMap({ x: hexGridsMineData.x, y: hexGridsMineData.y, z: hexGridsMineData.z }, false)
    }
    setCurrentNode({} as hexGridsByFilterState)
  }, [hexGridsMineData, defaultPoint, translateMap])

  /**
   * ????????????
   */
  const HandleHistoryView = useCallback((point: PointState) => {
    const historyView = StoreGet(KeyMetaNetWorkHistoryView)
    const { x, y, z } = point

    // ????????????????????????
    if (isEmpty(historyView)) {
      StoreSet(KeyMetaNetWorkHistoryView, JSON.stringify([point]))
    } else {
      let historyViewList: PointState[] = historyView ? JSON.parse(historyView) : []
      const historyViewIdx = historyViewList.findIndex(i =>
        i.x === x &&
        i.y === y &&
        i.z === z
      )

      // ????????????
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

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      // Will be passed to the page component as props
    },
  }
}

export default Home