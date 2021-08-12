import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
// import rd3 from 'react-d3-library'
// import * as d3 from 'd3';
import { SVG } from '@svgdotjs/svg.js'
import { Display } from 'rot-js'
import { hexbin } from 'd3-hexbin';
import { HexGrid, Layout, Hexagon, Text, GridGenerator, HexUtils } from 'react-hexgrid';
import { Popover, Menu, Dropdown, message } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined, DownOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import { useSpring, animated } from 'react-spring'
import { assign, cloneDeep, isEmpty } from 'lodash'
import { useMount } from 'ahooks'

import styles from './index/index.module.scss'
import { Hex } from '../utils/lib'
import { StoreGet, StoreSet } from '../utils/store'
import { cubeToAxial, calcTranslate } from '../utils/index'
import { PointState } from '../typings/node.d'
import { hexGridsByFilterState } from '../typings/metaNetwork.d'
import { InviitationsMineState } from '../typings/ucenter.d'

import ToggleSlider from '../components/Slider/ToggleSlider'
import DeploySite from '../components/DeploySite/Index'
import Occupied from '../components/Occupied/Index'
import UserAvatar from '../components/IndexPage/UserAvatar'
import UserMore from '../components/IndexPage/UserMore'
import { AddSvg } from '../components/Svg/Index'
import NoticeBardOccupied from '../components/NoticeBardOccupied/Index'
import MarkContainer from '../components/MarkContainer/Index'

import {
  hexGridsByFilter, hexGridsCoordinateValidation, hexGrids,
  hexGridsMine
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

export default function Home() {
  // hex all 坐标点
  const [hex, setHex] = useState([]);
  const [config, setConfig] = useState({
    "width": 1000,
    "height": 800,
    "layout": { "width": 70, "height": 70, "flat": false, "spacing": 1.1 },
    "origin": { "x": 100, "y": 100 },
    "map": "hexagon",
    "mapProps": [15]
  })
  const [map, setMap] = useState<string>('hexagon')
  const [mapProps, setMapProps] = useState<number[]>([15])
  const [layout, setLayout] = useState( { "width": 70, "height": 70, "flat": false, "spacing": 1.1 })
  const [size, setSize] = useState({ x: layout.width, y: layout.height })
  const [width, setWidth] = useState<number>(config.width);
  const [height, setHeight] = useState<number>(config.height);
  const [origin, setOrigin] = useState<{ x: number, y: number }>(config.origin);
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
  }, [ allNode, bookmark ])
  // Animated react spriing
  // User Info
  const [stylesUserInfo, apiUserInfo] = useSpring(() => ({ opacity: 0, display: 'none' }))
  // NoticeBard Occupied
  const noticeBardOccupiedAnimatedStyles = useSpring({
    from: { x: '-50%', y: -40, opacity: 0 },
    to: { x: '-50%', y: 0, opacity: 1 },
    config: {
      duration: 300
    }
  })

  // resize event
  const resizeFn = () => {
    if (process.browser) {
      setWidth(window.innerWidth * 1)
      setHeight(window.innerHeight * 1)

      setOrigin({
        x: (window.innerWidth * 1) / 2,
        y: (window.innerHeight * 1) / 2,
      })
    }
  }

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
        const eleAllNode: any = allNode[i];
        // 捕获 new hex 错误
        try {
          let center = new Hex(eleAllNode.x, eleAllNode.z, eleAllNode.y)

          for (let i = 0; i < hex.length; i++) {
            const ele: any = hex[i];
            let distanceResult = center.subtract({ q: ele.q, r: ele.r, s: ele.s }).len() <= distance
            if (distanceResult) {
              points.push(ele)
            }
          }
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
    let points = []
    let distance = 10
    let center = new Hex(0, 0, 0)

    for (let i = 0; i < hex.length; i++) {
      const ele: any = hex[i];
      let distanceResult = center.subtract({ q: ele.q, r: ele.r, s: ele.s }).len() <= distance
      if (distanceResult) {
        points.push(ele)
      }
    }

    setAllNodeDisabled(points)
  }, [hex])

  // init
  useMount(
    () => {
      fetchHexGriids()
      fetchHexGridsMine()

      resizeFn()
      window.addEventListener('resize', resizeFn)

      document.addEventListener('click', () => {
        apiUserInfo.start({ opacity: 0, display: 'none' })
      }, false)

      fetchInviteCode()
      fetchBookmark()
    }
  );

  // 计算最远距离
  const calcMaxDistance = (node: hexGridsByFilterState[]) => {
    let max = 0
    for (let i = 0; i < node.length; i++) {
      const ele = node[i];
      if (Math.abs(ele.x) > max) {
        max = Math.abs(ele.x)
      }
      if (Math.abs(ele.y) > max) {
        max = Math.abs(ele.y)
      }
      if (Math.abs(ele.z) > max) {
        max = Math.abs(ele.z)
      }
    }

    return [max + 6]
  }

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
        translateMap({ x: 0, y: 11, z: -11 }, false)
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
    }

    svg.node();
  }, [width, height])

  // 渲染坐标地图
  useEffect(() => {
    const generator = GridGenerator.getGenerator(map);
    const _mapProps = allNode.length ? calcMaxDistance(allNode) : mapProps
    const hexagons = generator.apply(null, _mapProps);

    console.log('hexagons', hexagons)
    setHex(hexagons)
    setContainerDrag()
  }, [ mapProps, allNode, map, setContainerDrag ]);

  // 获取范围坐标点
  const fetchHexGriids = useCallback(
    async () => {
      try {
        const res = await hexGridsByFilter({
          "xMin": -40,
          "xMax": 40,
          "yMin": -40,
          "yMax": 40,
          "zMin": -40,
          "zMax": 40
        })
        if (res.statusCode === 200) {
          setAllNode(res.data)
        } else {
          console.log('获取失败')
        }
      } catch (e) {
        console.log('e', e)
      }
  }, [])

  // 偏移地图坐标
  const translateMap = useCallback(({ x, y, z }: PointState, showUserInfo: boolean = true) => {
    const svg = d3.select('#container svg')

    const showUserMore = () => {
      if (!showUserInfo) {
        return
      }
      const node = allNode.filter(i => i.x === x && i.y === y && i.z === z)
      if (!node.length) {
        messageFn('没有坐标数据')
        return
      }
      setCurrentNode(node[0])
      apiUserInfo.start({ opacity: 1, display: 'block' })
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
  }, [ allNode, apiUserInfo, layout ])

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

  // 计算节点模式
  const calcNodeMode = ({
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


  }

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
            <tspan x="0" y="-10">{node[0]?.username || '暂无昵称'}</tspan>
            <tspan x="0" y="10">{'暂无简介'}</tspan>
            {/* 自己的坐标点 */}
            {
              (
                !isEmpty(hexGridsMineData) &&
                hexGridsMineData.x === node[0].x &&
                hexGridsMineData.y === node[0].y &&
                hexGridsMineData.z === node[0].z
              ) ?
              <tspan x="0" y="-30">🏡</tspan> : null
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
  }, [allNode, allNodeDisabled, allNodeChoose, bookmark, hexGridsMineData])

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

  return (
    <>
      <ToggleSlider
        translateMap={translateMap}
        bookmarkNode={bookmarkNode}
        inviteCodeData={inviteCodeData}
        HandleRemoveBookmark={HandleRemoveBookmark}></ToggleSlider>
      <div id="container">
        <HexGrid width={width} height={height} viewBox={`0, 0, ${Math.floor(width)}, ${Math.floor(height)}`} >
          <Layout size={size} flat={layout.flat} spacing={layout.spacing} origin={origin}>
            {
              // note: key must be unique between re-renders.
              // using config.mapProps+i makes a new key when the goal template chnages.
              hex.map((hex: any, i) => {
                let x = hex.q
                let y = hex.s
                let z = hex.r

                const nodeMode = calcNodeMode({ x, y, z })

                return (
                  <Hexagon
                    key={i}
                    q={hex.q}
                    r={hex.r}
                    s={hex.s}
                    onClick={(e: any) => handleHexagonEventClick(e, { x, y, z }, nodeMode)}
                    className={`${styles[`hexagon-${nodeMode}`]} hexagon-x${x}_y${y}_z${z}`}>
                    {/* <Text>{HexUtils.getID(hex)}</Text> */}
                    {/* <Text>{`x: ${hex.q}, z: ${hex.r}, y: ${hex.s}`}</Text> */}
                    {/* <Text>{`x: ${hex.q}, z: ${hex.r}, y: ${hex.s}`}</Text> */}
                    {
                      nodeContent({
                        x: x,
                        y: y,
                        z: z
                      })
                    }
                  </Hexagon>
                )
              })
            }
          </Layout>
        </HexGrid>
        <div className="point"></div>
      </div>
      <MarkContainer></MarkContainer>
      <animated.div style={stylesUserInfo}>
        <UserAvatar url={ 'https://ci.xiaohongshu.com/34249aac-c781-38cb-8de2-97199467b200?imageView2/2/w/1080/format/jpg/q/75' }></UserAvatar>
      </animated.div>

      <animated.div style={stylesUserInfo}>
        <UserMore bookmark={bookmark} currentNode={currentNode} HandleBookmark={HandleBookmark}></UserMore>
      </animated.div>

      <DeploySite isModalVisible={isModalVisibleDeploySite} setIsModalVisible={setIsModalVisibleDeploySite}></DeploySite>
      <Occupied isModalVisible={isModalVisibleOccupied} setIsModalVisible={setIsModalVisibleOccupied} handleOccupied={handleOccupied}></Occupied>
      {
        isEmpty(hexGridsMineData) && hexGridsMineTag ?
        <NoticeBardOccupied style={ noticeBardOccupiedAnimatedStyles } status={noticeBardOccupiedState} setNoticeBardOccupiedState={setNoticeBardOccupiedState}></NoticeBardOccupied> : null
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
const StyledUserInfo = styled.div`
  position: fixed;
  left: 700px;
  top: 400px;
  z-index: 10;
  background-color: #fff;
  width: 100px;
  height: 100px;
`