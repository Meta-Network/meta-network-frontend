import React, { useEffect, useState, useRef, createRef, useCallback, useMemo } from 'react';
// import rd3 from 'react-d3-library'
// import * as d3 from 'd3';
import { SVG } from '@svgdotjs/svg.js'
import { Display } from 'rot-js'
import { hexbin } from 'd3-hexbin';
import { HexGrid, Layout, Hexagon, Text, GridGenerator, HexUtils } from 'react-hexgrid';
import HexagonRound from '../components/ReactHexgrid/HexagonRound'

import { Popover, Menu, Dropdown, message } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined, DownOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import { useSpring, animated, useSpringRef, useTransition, useChain } from 'react-spring'
import { assign, cloneDeep, isEmpty, shuffle, random } from 'lodash'
import { useMount, useUnmount, useThrottleFn, useInViewport } from 'ahooks'

import styles from './index/index.module.scss'
import { Hex } from '../utils/lib'
import { StoreGet, StoreSet } from '../utils/store'
import { cubeToAxial, calcTranslate, calcMaxDistance, calcCenterRange, angle, isInViewPort, HandleHexagonStyle, strEllipsis, randomRange } from '../utils/index'
import { PointState, HexagonsState } from '../typings/node.d'
import { hexGridsByFilterState, PointScopeState } from '../typings/metaNetwork.d'
import { InviitationsMineState } from '../typings/ucenter.d'

import ToggleSlider from '../components/Slider/ToggleSlider'
import DeploySite from '../components/DeploySite/Index'
import Occupied from '../components/Occupied/Index'
import UserAvatar from '../components/IndexPage/UserAvatar'
import UserMore from '../components/IndexPage/UserMore'
import { AddSvg } from '../components/Svg/Index'
import NoticeBardOccupied from '../components/NoticeBardOccupied/Index'
import MarkContainer from '../components/MarkContainer/Index'
import HexGridsCount from '../components/HexGridsCount/Index'
import HomeArrow from '../components/HomeArrow/Index'

import {
  hexGridsByFilter, hexGridsCoordinateValidation, hexGrids,
  hexGridsMine, hexGridsForbiddenZoneRadius, hexGridsCountByFilter
} from '../services/metaNetwork'
import { invitationsMine } from '../services/ucenter'


let d3: any = null
let zoom: any = null
if (process.browser) {
  d3 = require('d3')
  zoom = d3.zoom();
}

// const configs = {
//   "hexagon": {
//     "width": 1000,
//     "height": 800,
//     "layout": { "width": 70, "height": 70, "flat": false, "spacing": 1.1 },
//     "origin": { "x": 100, "y": 100 },
//     "map": "hexagon",
//     "mapProps": [22]
//   }
// }

const Home = () => {
  // hex all 坐标点
  const [hex, setHex] = useState<HexagonsState[]>([]);
  // const [config, setConfig] = useState({
  //   "width": 1000,
  //   "height": 800,
  //   "layout": { "width": 70, "height": 70, "flat": false, "spacing": 1.1 },
  //   "origin": { "x": 100, "y": 100 },
  //   "map": "hexagon",
  //   "mapProps": [15]
  // })
  const [map, setMap] = useState<string>('hexagon')
  const [mapProps, setMapProps] = useState<number[]>([15])
  const [layout, setLayout] = useState({ "width": 66, "height": 66, "flat": false, "spacing": 1.1 })
  const [size, setSize] = useState({ x: layout.width, y: layout.height })
  const [width, setWidth] = useState<number>(1000);
  const [height, setHeight] = useState<number>(800);
  const [origin, setOrigin] = useState<{ x: number, y: number }>({ "x": 100, "y": 100 });
  // 默认坐标点
  const defaultPoint = { x: 0, y: 11, z: -11 }
  // 默认坐标范围
  const defaultHexGridsRange: PointScopeState = {
    "xMin": -90,
    "xMax": 90,
    "yMin": -90,
    "yMax": 90,
    "zMin": -90,
    "zMax": 90,
    "simpleQuery": ''
  }

  // 所有节点
  const [allNode, setAllNode] = useState<hexGridsByFilterState[]>([]);
  // 所有可以选择的节点
  const [allNodeChoose, setAllNodeChoose] = useState<any[]>([]);
  // 所有禁止选择的节点
  const [allNodeDisabled, setAllNodeDisabled] = useState<any[]>([]);
  // 当前选择节点
  const [currentNode, setCurrentNode] = useState<hexGridsByFilterState>({} as hexGridsByFilterState);
  // 当前占领节点
  const [currentNodeChoose, setCurrentNodeChoose] = useState<PointState>({} as PointState);
  // 部署网站 Modal
  const [isModalVisibleDeploySite, setIsModalVisibleDeploySite] = useState<boolean>(false);
  // 占领 Modal
  const [isModalVisibleOccupied, setIsModalVisibleOccupied] = useState<boolean>(false);
  // 邀请码
  const [inviteCodeData, setInviteCodeData] = useState<InviitationsMineState[]>([])
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
      const _node = allNode.filter(node =>
        node.x === ele.x &&
        node.y === ele.y &&
        node.z === ele.z
      )
      if (_node.length) {
        assign(ele, _node)
      }
    }

    return _bookmark as hexGridsByFilterState[]
  }, [allNode, bookmark])
  // Animated react spriing
  // User Info
  const [stylesUserInfo, apiUserInfo] = useSpring(() => ({ opacity: 0, display: 'none' }))
  // 拖动隐藏开关
  const [userInfoTag, setUserInfoTag] = useState<boolean>(false)

  // NoticeBard Occupied
  const noticeBardOccupiedAnimatedStyles = useSpring({
    from: { x: '-50%', y: -40, opacity: 0 },
    to: { x: '-50%', y: 0, opacity: 1 },
    config: {
      duration: 300
    }
  })
  // map render
  const transApi = useSpringRef()
  const transition = useTransition(shuffle(hex), {
    ref: transApi,
    trail: 3000 / hex.length,
    // trail: 1000,
    from: { opacity: 0, scale: 0 },
    enter: { opacity: 1, scale: 1 },
    leave: { opacity: 0, scale: 0 },
    delay: () => {
      return random(400, 1200)
    },
    onStart: () => {
      console.log('animated start')
    }
  })
  useChain([transApi], [ 0.1 ])

  // 默认禁用区域半径
  const [forbiiddenZoneRadius, setforbiiddenZoneRadius] = useState<number>(10)
  // 统计所有坐标点
  const [hexGridsCountData, setHexGridsCountData] = useState<number>(0)
  // 箭头角度
  const [homeAngle, setHomeAngle] = useState<number>(0)
  // 自己的坐标是否在屏幕内
  const [inViewPortHexagonOwner, setInViewPortHexagonOwner] = useState<boolean | undefined>()
  // console.log('inViewPortHexagonOwner', inViewPortHexagonOwner)


  /**
   * resize event
   */
  const { run: resizeFn } = useThrottleFn(
    () => {
      if (process.browser) {
        setWidth(window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth * 1)
        setHeight(window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight * 1)

        setOrigin({
          x: (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth * 1) / 2,
          y: (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight * 1) / 2,
        })
      }
    },
    { wait: 300 },
  );

  /**
   * 计算角度
   */
  const { run: calcAngle } = useThrottleFn(
    () => {
      const _init = () => {
        const tag = document.querySelector<HTMLElement>('.hexagon-owner')
        const inViewPortResult = isInViewPort(tag!)
        setInViewPortHexagonOwner(inViewPortResult)

        // 在窗口内不计算 undefined 不计算
        if (inViewPortHexagonOwner || inViewPortHexagonOwner === undefined) {
          return
        }

        // 没有坐标点不计算
        if (isEmpty(hexGridsMineData)) {
          return
        }

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

        console.log('angle', angleResult)
        setHomeAngle(angleResult)
      }
      if (process.browser) {
        _init()
      }
    },
    { wait: 300 },
  );

  // 隐藏用户信息
  const hideUserInfo = useCallback(() => {
    // console.log(111)
    apiUserInfo.start({ opacity: 0, display: 'none' })
  }, [apiUserInfo])
  // const { run: hideUserInfoThrottle } = useThrottleFn(
  //   () => {
  //     hideUserInfo();
  //   },
  //   { wait: 300 },
  // );

  // 计算所有可选择坐标范围
  useEffect(() => {
    //  未开启选择功能
    if (!noticeBardOccupiedState) {
      setAllNodeChoose([])
      return
    }
    // 已经占领
    if (!isEmpty(hexGridsMineData)) {
      setAllNodeChoose([])
      return
    }

    if (allNode.length) {
      let points = []
      let distance = 1

      for (let i = 0; i < allNode.length; i++) {
        const eleAllNode = allNode[i];
        // 捕获 new hex 错误
        try {
          let center = new Hex(eleAllNode.x, eleAllNode.z, eleAllNode.y)
          const pointsRes = calcCenterRange(center, hex, distance)
          points.push(...pointsRes)
        } catch (e) {
          console.log('e', e)
          continue
        }
      }
      setAllNodeChoose(points)
    }
  }, [allNode, hex, noticeBardOccupiedState, hexGridsMineData])

  // 计算半径为10不可选区域
  useEffect(() => {
    const center = new Hex(0, 0, 0)
    const points = calcCenterRange(center, hex, forbiiddenZoneRadius)

    setAllNodeDisabled(points)
  }, [hex, forbiiddenZoneRadius])

  // init
  useMount(
    () => {
      fetchHexGriids()
      fetchFoorbiddenZoneRadius()
      fetchHexGridsMine()

      resizeFn()
      window.addEventListener('resize', resizeFn)
      document.addEventListener('click', hideUserInfo, false)

      fetchInviteCode()
      fetchBookmark()
      fetchHexGridsCountByFilter()
    }
  );

  useUnmount(() => {
    window.removeEventListener('resize', resizeFn)
    document.removeEventListener('resize', hideUserInfo)
  })



  // 获取收藏记录
  const fetchBookmark = useCallback(() => {
    const key = 'MetaNetWorkBookmark'
    const bookmark = StoreGet(key)
    let bookmarkList: PointState[] = bookmark ? JSON.parse(bookmark) : []
    setBookmark(bookmarkList)
  }, [])

  // 获取邀请码
  const fetchInviteCode = useCallback(
    async () => {
      try {
        const res = await invitationsMine()
        if (res.statusCode === 200) {
          setInviteCodeData(res.data)
        }
      } catch (e) {
        console.log(e)
      }
    }, [])

  // 获取禁用区域半径
  const fetchFoorbiddenZoneRadius = useCallback(
    async () => {
      try {
        const res = await hexGridsForbiddenZoneRadius()
        if (res.statusCode === 200 && res.data > 0) {
          setforbiiddenZoneRadius(res.data)
        }
      } catch (e) {
        console.log(e)
      }
    }, [])

  // 获取统计所有坐标点
  const fetchHexGridsCountByFilter = useCallback(
    async () => {
      try {
        const res = await hexGridsCountByFilter(defaultHexGridsRange)
        if (res.statusCode === 200) {
          setHexGridsCountData(res.data)
        }
      } catch (e) {
        console.log(e)
      }
    }, [])

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
    }, [])

  // 设置内容拖动 缩放
  const setContainerDrag = useCallback(() => {
    const svg = d3.select('#container svg')

    svg.call(
      zoom
        .extent([[0, 0], [width, height]])
        .scaleExtent([0.4, 4])
        .on("zoom", zoomed)
    )

    function zoomed({ transform }: any) {
      // 边界判定
      let tran = transform

      const svg = d3.select('#container svg > g')
      let svgBox = svg.node().getBBox()
      // console.log('transform', transform)
      let svgContentWidth = svgBox.width
      let svgContentHeight = svgBox.height

      // console.log('svgContentWidth', svgContentWidth)
      // console.log('svgContentHeight', svgContentHeight)

      const numberFloor = (n: number, k: number) => {
        return Math.floor((n / 2) * k)
      }

      if (transform.x >= numberFloor(svgContentWidth, transform.k)) {
        tran = Object.assign(transform, { x: numberFloor(svgContentWidth, transform.k) })
      }
      if (transform.y >= numberFloor(svgContentHeight, transform.k)) {
        tran = Object.assign(transform, { y: numberFloor(svgContentHeight, transform.k) })
      }

      if (transform.x <= numberFloor(-(svgContentWidth), transform.k)) {
        tran = Object.assign(transform, { x: numberFloor(-(svgContentWidth), transform.k) })
      }
      if (transform.y <= numberFloor(-(svgContentHeight), transform.k)) {
        tran = Object.assign(transform, { y: numberFloor(-(svgContentHeight), transform.k) })
      }
      svg.attr("transform", tran);

      // TODO: 应该需要优化
      if (!userInfoTag) {
        hideUserInfo()
      }

      calcAngle()
    }

    svg.node();
  }, [width, height])

  // 渲染坐标地图
  const render = useCallback((list: hexGridsByFilterState[]) => {
    const generator = GridGenerator.getGenerator(map);
    const _mapProps = list.length ? calcMaxDistance(list) : mapProps
    const hexagons = generator.apply(null, _mapProps);

    console.log('hexagons', hexagons)
    setHex(hexagons)
    setContainerDrag()
  }, [mapProps, map, setContainerDrag]);

  // 获取范围坐标点
  const fetchHexGriids = useCallback(
    async () => {
      try {
        const res = await hexGridsByFilter(defaultHexGridsRange)
        if (res.statusCode === 200) {
          setAllNode(res.data)
          render(res.data)
        } else {
          // console.log('获取失败')
          throw new Error('获取失败')
        }
      } catch (e) {
        console.log('e', e)
        render([])
      }
    }, [ render ])

  // 偏移地图坐标
  const translateMap = useCallback(({ x, y, z }: PointState, showUserInfo: boolean = true) => {
    const svg = d3.select('#container svg')

    const showUserMore = () => {
      setUserInfoTag(true)

      HandleHexagonStyle({ x, y, z })
      if (!showUserInfo) {
        setUserInfoTag(false)
        return
      }
      const node = allNode.filter(i => i.x === x && i.y === y && i.z === z)
      if (!node.length) {
        messageFn('没有坐标数据')
        return
      }
      setCurrentNode(node[0])
      apiUserInfo.start({ opacity: 1, display: 'block' })
      setUserInfoTag(false)
    }

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
  }, [allNode, apiUserInfo, layout])

  // 处理点击地图事件
  const handleHexagonEventClick = (e: any, point: PointState, mode: string) => {
    if (mode === 'choose') {
      setCurrentNodeChoose(point)
      setIsModalVisibleOccupied(true)
      return
    } else if (mode === 'default') {
      messageFn('请选择紧挨已注册用户的地块')
      return
    } else if (mode === 'disabled') {
      return
    }

    translateMap({
      x: point.x,
      y: point.y,
      z: point.z
    })
  }

  // const messageFn = () => {
  //   message.info({
  //     content: <StyledMessageRelative>
  //       <ExclamationCircleOutlined />
  //       {/* 140 - 12 + 40 */}
  //       <span style={{ paddingRight: 168, overflow: 'hidden' }}>
  //         现在就开始建立你在元宇宙网络的个人站点吧！
  //         <StyledMessageButton>开始创建</StyledMessageButton>
  //       </span>
  //     </StyledMessageRelative>,
  //     className: 'custom-message',
  //     duration: 0,
  //     icon: ''
  //   });

  //   message.info({
  //     content: <span className="g-green">
  //       <ExclamationCircleOutlined />
  //       <span>
  //         首先，请认领一块空白的地块
  //       </span>
  //     </span>,
  //     className: 'custom-message',
  //     duration: 0,
  //     icon: ''
  //   });

  //   message.info({
  //     content: <span>
  //       <ExclamationCircleOutlined />
  //       <span>
  //         请选择紧挨已注册用户的地块
  //       </span>
  //     </span>,
  //     className: 'custom-message',
  //     duration: 0,
  //     icon: ''
  //   });
  // };

  // 节点是不是拥有者
  const isNodeOwner = useCallback(({ x, y, z }: PointState) => {
    return !isEmpty(hexGridsMineData) &&
      hexGridsMineData.x === x &&
      hexGridsMineData.y === y &&
      hexGridsMineData.z === z
  }, [hexGridsMineData])

  // 计算节点模式
  const calcNodeMode = useCallback(({
    x, y, z
  }: {
    x: number,
    y: number,
    z: number
  }) => {
    // 禁止选择节点
    const nodeDisabled = allNodeDisabled.filter(i => i.q === x && i.s === y && i.r === z)
    if (nodeDisabled.length) {
      return 'disabled'
    }

    if (allNode.length === 0) {
      // 没有节点
      if (x === 0 && y === 10 + 1 && z === -10 - 1) {
        return 'choose'
      } else {
        return 'default'
      }
    }

    const node = allNode.filter(i => i.x === x && i.y === y && i.z === z)
    if (node.length) {
      // return node[0]!.user.role || 'exist'
      return 'exist'
    }

    const nodeChoose = allNodeChoose.filter(i => i.q === x && i.s === y && i.r === z)
    if (nodeChoose.length) {
      return 'choose'
    }
    return 'default'


  }, [allNode, allNodeChoose, allNodeDisabled])

  // 节点内容
  const nodeContent = useCallback(({
    x, y, z
  }: {
    x: number,
    y: number,
    z: number
  }) => {
    // 禁止选择节点
    const nodeDisabled = allNodeDisabled.filter(i => i.q === x && i.s === y && i.r === z)
    if (nodeDisabled.length) {
      return null
    }

    if (allNode.length === 0) {
      // 没有节点
      if (x === 0 && y === 10 + 1 && z === -10 - 1) {
        return (
          <Text className={styles['hexagon-add']}>+</Text>
        )
      } else {
        return null
      }
    }

    const node = allNode.filter(i => i.x === x && i.y === y && i.z === z)
    if (node.length) {

      // 是否收藏
      const isBookmark = bookmark.findIndex(i =>
        i.x === node[0].x &&
        i.y === node[0].y &&
        i.z === node[0].z
      )

      return (
        <>
          <Text>
            <tspan x="0" y="-10">{strEllipsis(node[0]?.userNickname || node[0]?.username) || '暂无昵称'}</tspan>
            <tspan x="0" y="10">{strEllipsis(node[0]?.userBio) || '暂无简介'}</tspan>
            {/* 自己的坐标点 */}
            {
              isNodeOwner(node[0]) ?
                <tspan x="0" y="-30" className="hexagon-owner">🏡</tspan> : null
            }
            {/* 收藏的坐标点 */}
            {
              ~isBookmark ?
                <tspan x="0" y="38">⭐️</tspan> : null
            }
          </Text>
        </>
      )
    }

    const nodeChoose = allNodeChoose.filter(i => i.q === x && i.s === y && i.r === z)
    if (nodeChoose.length) {
      return <Text className={styles['hexagon-add']}>+</Text>
    }
    return null
  }, [allNode, allNodeDisabled, allNodeChoose, bookmark, isNodeOwner])

  const messageFn = (text: string) => {
    message.info({
      content: <span>
        <ExclamationCircleOutlined />
        <span>
          {text}
        </span>
      </span>,
      className: 'custom-message',
      icon: ''
    })
  }

  // 处理收藏
  const HandleBookmark = (currentNode: hexGridsByFilterState) => {
    const key = 'MetaNetWorkBookmark'
    const bookmark = StoreGet(key)
    const x = currentNode.x
    const y = currentNode.y
    const z = currentNode.z
    const point = { x, y, z }

    // 没有收藏记录
    if (isEmpty(bookmark)) {
      StoreSet(key, JSON.stringify([point]))
      messageFn('收藏成功')
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
        messageFn('取消收藏')
      } else {
        bookmarkList.push(point)
        messageFn('收藏成功')
      }

      StoreSet(key, JSON.stringify(bookmarkList))
    }

    fetchBookmark()
  }

  // 处理移除收藏
  const HandleRemoveBookmark = useCallback(
    (bookmarkNodeList: hexGridsByFilterState[]) => {
      const key = 'MetaNetWorkBookmark'
      const bookmark = StoreGet(key)
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

      StoreSet(key, JSON.stringify(bookmarkList))
      fetchBookmark()

      messageFn('移除收藏成功')
    },
    [fetchBookmark]
  )

  // 处理占领
  const handleOccupied = async () => {
    console.log('currentNodeChoose', currentNodeChoose)
    try {
      const resPointValidation = await hexGridsCoordinateValidation(currentNodeChoose)
      if (resPointValidation.statusCode === 200 && resPointValidation.data) {
        // message.info('允许占领')
      } else {
        message.warning(resPointValidation.message)
        return
      }
    } catch (e) {
      console.log(e)
      message.warning(e.message)
      return
    }

    try {
      const res = await hexGrids(currentNodeChoose)
      if (res.statusCode === 201) {
        messageFn('占领成功')
        fetchHexGriids()
        setIsModalVisibleOccupied(false)
      } else {
        message.warning(res.message)
      }
    } catch (e) {
      console.log(e)
      message.warning(e.message)
    }
  }

  // 重置定位
  const HandlePosition = useCallback(() => {
    if (isEmpty(hexGridsMineData)) {
      translateMap(defaultPoint, false)
    } else {
      translateMap({ x: hexGridsMineData.x, y: hexGridsMineData.y, z: hexGridsMineData.z }, false)
    }
  }, [hexGridsMineData, translateMap])

  // 箭头 重置定位
  const HandleResetOwnerPosition = useCallback(() => {
    if (!isEmpty(hexGridsMineData)) {
      translateMap({ x: hexGridsMineData.x, y: hexGridsMineData.y, z: hexGridsMineData.z }, false)
    }
  }, [hexGridsMineData, translateMap])

  return (
    <>
      <ToggleSlider
        translateMap={translateMap}
        bookmarkNode={bookmarkNode}
        inviteCodeData={inviteCodeData}
        defaultHexGridsRange={defaultHexGridsRange}
        HandleRemoveBookmark={HandleRemoveBookmark}
        HandlePosition={HandlePosition}>
      </ToggleSlider>
      <div id="container">
        <HexGrid width={width} height={height} viewBox={`0, 0, ${Math.floor(width)}, ${Math.floor(height)}`} >
          <Layout size={size} flat={layout.flat} spacing={layout.spacing} origin={origin}>
            {
              // note: key must be unique between re-renders.
              // using config.mapProps+i makes a new key when the goal template chnages.
              // transition((style: any, item: any) => {
              //   console.log('style', style)
              //   console.log('item', item)
              //   return <></>
              // })

              // hex.map((hex: any, i) => {
                transition((style, hex: HexagonsState) => {
                let x = hex.q
                let y = hex.s
                let z = hex.r

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
                    className={`${`hexagon-${nodeMode}`} hexagon-${key}`}>
                    {/* <Text>{HexUtils.getID(hex)}</Text> */}
                    {
                      nodeContent({
                        x: x,
                        y: y,
                        z: z
                      })
                    }
                  </HexagonRound>
                )
              })
            }
          </Layout>
        </HexGrid>
        <div className="point"></div>
      </div>
      <MarkContainer></MarkContainer>
      <animated.div style={stylesUserInfo}>
        <UserAvatar url={currentNode.userAvatar || 'https://ci.xiaohongshu.com/34249aac-c781-38cb-8de2-97199467b200?imageView2/2/w/1080/format/jpg/q/75'}></UserAvatar>
      </animated.div>

      <animated.div style={stylesUserInfo}>
        <UserMore bookmark={bookmark} currentNode={currentNode} HandleBookmark={HandleBookmark}></UserMore>
      </animated.div>

      <DeploySite isModalVisible={isModalVisibleDeploySite} setIsModalVisible={setIsModalVisibleDeploySite}></DeploySite>
      <Occupied isModalVisible={isModalVisibleOccupied} setIsModalVisible={setIsModalVisibleOccupied} handleOccupied={handleOccupied}></Occupied>
      {
    isEmpty(hexGridsMineData) && hexGridsMineTag ?
      <NoticeBardOccupied style={noticeBardOccupiedAnimatedStyles} status={noticeBardOccupiedState} setNoticeBardOccupiedState={setNoticeBardOccupiedState}></NoticeBardOccupied> : null
  }
  <HexGridsCount count={hexGridsCountData}></HexGridsCount>
  {
    !inViewPortHexagonOwner && inViewPortHexagonOwner !== undefined && !isEmpty(hexGridsMineData) ?
      <HomeArrow angleValue={homeAngle} HandleResetOwnerPosition={HandleResetOwnerPosition}></HomeArrow> : null
  }
    </>
  )
}

const StyledMessageRelative = styled.span`
  position: relative;
`

const StyledMessageButton = styled.button`
  width: 140px;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  position: absolute;
  right: -12px;
  top: -10px;
  bottom: -10px;
  border-radius: 0 4px 4px 0;
  border: none;
  border-left: 1px solid #131313;
  outline: none;
  cursor: pointer;
  background-color: transparent;
  color: ${props => props.theme.colorGreen};
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  box-sizing: border-box;
`

export default Home