import React, { useEffect, useState, useRef, createRef, useCallback, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { GridGenerator } from 'react-hexgrid'
import { assign, cloneDeep, isEmpty, uniqBy } from 'lodash'
import { useMount, useUnmount, useThrottleFn, useEventEmitter, useDebounceFn } from 'ahooks'

import { StoreGet, StoreSet } from '../utils/store'
import {
  cubeToAxial, calcTranslate, calcMaxDistance,
  HandleHexagonStyle,
  keyFormat, keyFormatParse, calcTranslateValue, calcForbiddenZoneRadius, calcAllNodeChooseZoneRadius,
} from '../utils/index'
import { PointState, HexagonsState, AxialState, LayoutState, translateMapState, ZoomTransform } from '../typings/node.d'
import { hexGridsByFilterState, PointScopeState } from '../typings/metaNetwork.d'
import { hexGridsCoordinateValidation, hexGrids } from '../services/metaNetwork'
import { useUser } from '../hooks/useUser'
import { fetchForbiddenZoneRadiusAPI, fetchHexGridsMineAPI, fetchHexGridsAPI, getZoomPercentage } from '../helpers/index'
import useToast from '../hooks/useToast'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import qs from 'qs'
import { isBrowser, isMobile } from 'react-device-detect'
import * as d3 from 'd3'

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
const MapContainer = dynamic(() => import('../components/MapContainerCase'), { ssr: false })
const AllNode = dynamic(() => import('../components/MapContainerCase/AllNode'), { ssr: false })
const FullLoading = dynamic(() => import('../components/FullLoading'), { ssr: false })

const KeyMetaNetWorkBookmark = 'MetaNetWorkBookmark'
const KeyMetaNetWorkHistoryView = 'MetaNetWorkHistoryView'
const map = 'hexagon'
const layout: LayoutState = { width: 66, height: 66, flat: false, spacing: 1.1 }
const size: AxialState = { x: layout.width, y: layout.height }
// 默认坐标点
const defaultPoint: PointState = { x: 0, y: 11, z: -11 }
// 默认坐标范围
const defaultHexGridsRange: PointScopeState = {
  xMin: -90,
  xMax: 90,
  yMin: -90,
  yMax: 90,
  zMin: -90,
  zMax: 90,
  simpleQuery: ''
}
const mapProps: number[] = [11]

const Home = () => {
  const { t } = useTranslation('common')
  const { Toast } = useToast()

  const [width, setWidth] = useState<number>(1000)
  const [height, setHeight] = useState<number>(800)
  const [origin, setOrigin] = useState<AxialState>({ x: 100, y: 100 })
  // 所有节点
  // const [allNode, setAllNode] = useState<hexGridsByFilterState[]>([])
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
  const [forbiddenZoneRadius, setForbiddenZoneRadius] = useState<number>(10)
  // FullLoading
  const [fullLoading, setFullLoading] = useState<boolean>(false)

  const { isLogin } = useUser()
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
        callback && callback()
      }

      HandleHexagonStyle({ x, y, z }, nodeActive)

      if (!(window as any).containerD3Svg) {
        return
      }
      
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

      ;(window as any).containerD3Svg.transition()
        .duration(duration)
        .call(
          // @ts-ignore
          (window as any).containerD3Zoom.transform,
          d3.zoomIdentity.translate(xVal, yVal).scale(_scale),
        )
        .on('start', showUserMore)
        .on('end', eventEnd)
    }, [allNodeMap, currentNode, Toast, t, width, height])

  /**
   * 偏移地图坐标 默认取消动画使用
   */
  const translateMapDefault = useCallback(({ x, y, z }: PointState, nodeActive: boolean = true) => {
    HandleHexagonStyle({ x, y, z }, nodeActive)

    // 坐标转换，这么写方便后续能阅读懂
    const { x: hexX, y: HexY } = cubeToAxial(x, y, z)
    let { x: _x, y: _y } = calcTranslate(layout, { x: hexX, y: HexY })

    if (!(window as any).containerD3Svg) {
      return
    }

    ;(window as any).containerD3Svg.transition()
      .duration(1000)
      .call(
        // @ts-ignore
        (window as any).containerD3Zoom.transform,
        d3.zoomIdentity.translate(_x, _y).scale(1),
      )
  }, [])

  /**
   * 获取自己的坐标点
   */
  const fetchHexGridsMine = useCallback(
    async () => {
      setHexGridsMineTag(false)

      const data = await fetchHexGridsMineAPI()

      if (data) {
        setHexGridsMineData(data)
      }

      // 默认地图偏移
      const defaultTranslateMap = () => {
        if (data) {
          const { x, y, z } = data
          translateMapDefault({ x, y, z }, true)
        } else {
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
    }, [translateMapDefault])


  /**
   * 获取范围坐标点
   */
  const fetchHexGrids = useCallback(
    async () => {
      const data = await fetchHexGridsAPI(defaultHexGridsRange)

      // 获取禁用坐标
      const forbiddenZoneRadiusResult = await fetchForbiddenZoneRadiusAPI(forbiddenZoneRadius)
      if (forbiddenZoneRadiusResult !== forbiddenZoneRadius) {
        setForbiddenZoneRadius(forbiddenZoneRadiusResult)
      }

      // 计算禁用坐标
      const pointsForbidden = calcForbiddenZoneRadius({ forbiddenZoneRadius: forbiddenZoneRadius})

      if (data) {
        let dataMap: Map<string, hexGridsByFilterState> = new Map()
        data.forEach(i => {
          const { x, y, z } = i
          dataMap.set(keyFormat({ x, y, z }), i)
        })

        // setAllNode(data)
        setAllNodeMap(dataMap)

        // 计算可选坐标
        const pointsChoose = calcAllNodeChooseZoneRadius({ allNodeMap: dataMap, forbidden: pointsForbidden })
        setAllNodeChoose(pointsChoose)
      }

      fetchHexGridsMine()
      setAllNodeDisabled(pointsForbidden)
      setFullLoading(false)
    }, [forbiddenZoneRadius, fetchHexGridsMine])

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

        fetchHexGrids()
        setIsModalVisibleOccupied(false)
      } else {
        throw new Error(res.message)
      }
    } catch (e: any) {
      console.log(e)
      Toast({ content: e.message, type: 'warning' })
    }
  }, [currentNodeChoose, fetchHexGrids, Toast, t])

  // 重置定位
  const HandlePosition = useCallback(() => {
    if (isEmpty(hexGridsMineData)) {

      focus$.emit('positionDefault')

      translateMap({
        point: defaultPoint,
        showUserInfo: false,
        nodeActive: false
      })
    } else {
      focus$.emit('positionOwn')

      translateMap({
        point: { x: hexGridsMineData.x, y: hexGridsMineData.y, z: hexGridsMineData.z },
        showUserInfo: false
      })
    }
    setCurrentNode({} as hexGridsByFilterState)
  }, [hexGridsMineData, translateMap, focus$])

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


  // init
  useMount(
    () => {
      setFullLoading(true)

      fetchHexGrids()

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
      <ToggleSlider
        translateMap={translateMap}
        allNodeMap={allNodeMap}
        bookmark={bookmark}
        defaultHexGridsRange={defaultHexGridsRange}
        hexGridsMineData={hexGridsMineData}
        HandleRemoveBookmark={HandleRemoveBookmark}
      >
      </ToggleSlider>
      <MapContainer
        width={width}
        height={height}
        size={size}
        layout={layout}
        setCurrentNodeMouse={setCurrentNodeMouse}
        allNodeDisabled={allNodeDisabled}
        allNodeMap={allNodeMap}
        allNodeChoose={allNodeChoose}
        defaultPoint={defaultPoint}
        noticeBardOccupiedState={noticeBardOccupiedState}
        hexGridsMineData={hexGridsMineData}
        origin={origin}
        currentNode={currentNode}
        setCurrentNode={setCurrentNode}
        setCurrentNodeChoose={setCurrentNodeChoose}
        setIsModalVisibleOccupied={setIsModalVisibleOccupied}
        handleHistoryView={HandleHistoryView}
        translateMap={translateMap}
        focus$={focus$}
      >
        <AllNode
          allNodeDisabled={allNodeDisabled}
          allNodeMap={allNodeMap}
          allNodeChoose={allNodeChoose}
          defaultPoint={defaultPoint}
          bookmark={bookmark}
          noticeBardOccupiedState={noticeBardOccupiedState}
          hexGridsMineData={hexGridsMineData}
          focus$={focus$}
        ></AllNode>
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
        isEmpty(hexGridsMineData) && hexGridsMineTag && isLogin ?
          <NoticeBardOccupied
            status={noticeBardOccupiedState}
            setNoticeBardOccupiedState={setNoticeBardOccupiedState}
          ></NoticeBardOccupied> : null
      }
      {
        !isEmpty(hexGridsMineData) && hexGridsMineTag && isLogin && !hexGridsMineData.subdomain
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