import React, { useEffect, useState, useRef, useCallback } from 'react';
// import rd3 from 'react-d3-library'
// import * as d3 from 'd3';
import { defineGrid, extendHex } from 'honeycomb-grid'
import { SVG } from '@svgdotjs/svg.js'
import { Display } from 'rot-js'
import { hexbin } from 'd3-hexbin';
import { HexGrid, Layout, Hexagon, Text, GridGenerator, HexUtils } from 'react-hexgrid';
import tippy from 'tippy.js';
import Tippy from '@tippyjs/react';
import { randomRange } from '../utils/index'
import styles from './index/index.module.scss'
import { AddSvg } from '../components/Svg/Index'
import { PlusOutlined } from '@ant-design/icons'
import { message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import ToggleSlider from '../components/Slider/ToggleSlider'
import DeploySite from '../components/DeploySite/Index'
import { Hex } from '../utils/lib'

interface node {
  x: number,
  y: number,
  z: number,
  user: {
    username: string,
    nickname: string,
    introduction: string,
    role: 'exist' | 'active' | 'v'
  }
}

let d3: any = null
let zoom: any = null
if (process.browser) {
  d3 = require('d3')
  zoom = d3.zoom();
}

const configs = {
  "hexagon": {
    "width": 1000,
    "height": 800,
    "layout": { "width": 70, "height": 70, "flat": false, "spacing": 1.1 },
    "origin": { "x": 100, "y": 100 },
    "map": "hexagon",
    "mapProps": [20]
  }
}
const config = configs['hexagon']
const layout = config.layout;
const size = { x: layout.width, y: layout.height };
const mapProps = config.mapProps[0];

export default function Home() {
  const myRef = useRef(null)
  const [hex, setHex] = useState([]);
  const ref = useRef();

  const [width, setWidth] = useState<number>(config.width);
  const [height, setHeight] = useState<number>(config.height);
  const [origin, setOrigin] = useState<{ x: number, y: number }>(config.origin);
  const [allNode, setAllNode] = useState<node[]>([
    {
      x: 0,
      y: 11,
      z: -11,
      user: {
        username: 'xiaotian',
        nickname: '小田',
        introduction: '这是一条简介',
        role: 'exist',
      }
    },
    {
      x: 0,
      y: 12,
      z: -12,
      user: {
        username: 'xiaotian',
        nickname: '小田',
        introduction: '这是一条简介',
        role: 'active',
      }
    },
    {
      x: 1,
      y: 11,
      z: -12,
      user: {
        username: 'xiaotian',
        nickname: '小田',
        introduction: '这是一条简介',
        role: 'v',
      }
    }
  ]); // 所有节点
  // 所有可以选择的节点
  const [allNodeChoose, setAllNodeChoose] = useState<any[]>([]);
  // 所有禁止选择的节点
  const [allNodeDisabled, setAllNodeDisabled] = useState<any[]>([]);
  const [isModalVisibleDeploySite, setIsModalVisibleDeploySite] = useState<boolean>(false);

  const resizeFn = useCallback(
    () => {
      if (process.browser) {
        setWidth(window.innerWidth * 1)
        setHeight(window.innerHeight * 1)

        setOrigin({
          x: (window.innerWidth * 1) / 2,
          y: (window.innerHeight * 1) / 2,
        })
      }
    },
    [],
  )

  // 计算所有可选择坐标范围
  useEffect(() => {
    if (allNode.length) {
      let points = []
      let distance = 1

      for (let i = 0; i < allNode.length; i++) {
        const eleAllNode: any = allNode[i];
        let center = new Hex(eleAllNode.x, eleAllNode.z, eleAllNode.y)

        for (let i = 0; i < hex.length; i++) {
          const ele: any = hex[i];
          let distanceResult = center.subtract({ q: ele.q, r: ele.r, s: ele.s }).len() <= distance
          if (distanceResult) {
            points.push(ele)
          }
        }
      }
      console.log('points', points)
      setAllNodeChoose(points)
    }
  }, [allNode, hex])

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

    console.log('points', points)
    setAllNodeDisabled(points)

  }, [hex])

  useEffect(() => {
    resizeFn()
    window.addEventListener('resize', resizeFn)

    // messageFn()
  }, [resizeFn]);

  useEffect(() => {
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
      console.log('transform', transform)
      let svgContentWidth = svgBox.width
      let svgContentHeight = svgBox.height

      console.log('svgContentWidth', svgContentWidth)
      console.log('svgContentHeight', svgContentHeight)

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

    let {x, y} = calcTranslate({ x: 0, y: -11 })
    svg.transition()
    .duration(1300)
    .call(
      zoom.transform,
      d3.zoomIdentity.translate(x, y).scale(1),
    )

    svg.node();
  }, []);

  useEffect(() => {
    const generator = GridGenerator.getGenerator(config.map);
    const hexagons = generator.apply(null, config.mapProps);

    console.log('hexagons', hexagons)
    setHex(hexagons)
      ; (window as any)._hexagons = hexagons
  }, []);

  /**
   * 计算偏移位置
   */
  const calcTranslate = ({ x, y }: { x: number, y: number }) => {
    // https://www.redblobgames.com/grids/hexagons/#hex-to-pixel
    // 方向不同 算法有细微差别

    let _x =layout.width * (Math.sqrt(3) * -x + Math.sqrt(3) / 2 * -y)
    let _y = layout.height * (3 / 2 * -y)
    _x = _x * layout.spacing
    _y = _y * layout.spacing
    return {
      x: _x, y: _y
    }
  }

  const handleHexagonEventClick = (e: any, className: string, point: { x: number, y: number }, mode: string) => {
    if (mode === 'choose') {
      setIsModalVisibleDeploySite(true)
      return
    } else if (mode === 'default') {
      message.info({
        content: <span>
          <ExclamationCircleOutlined />
          <span>
            请选择紧挨已注册用户的地块
          </span>
        </span>,
        className: 'custom-message',
        duration: 1,
        icon: ''
      });
      return
    }

    const svg = d3.select('#container svg')
    let {x, y} = calcTranslate({ x: point.x, y: point.y })

    const showPopoverUser = () => {
      // console.log('e', e)
      let target: any = document.querySelector(`.${className}`)
      console.log('target', target, className)
      tippy(target, {
        content: '<div class="popover-avatar-wrapper"><img src="https://img.zfn9.com/05/af/2f2325f9807107637c62effc1340224d.jpg" /></div>',
        allowHTML: true,
        trigger: 'click',
        placement: 'top',
        animation: 'scale',
        offset: [0, 36],
        appendTo: (): any => document.querySelector('#user-avatar'),
      });

      tippy(target, {
        content: `<div> <button class="user-more-button">进入主页</button> <button class="user-more-button">...</button> </div>`,
        allowHTML: true,
        placement: 'right',
        trigger: 'click',
        animation: 'scale',
        offset: [0, 16],
        appendTo: (): any => document.querySelector('#user-more'),
      });
    }

    svg.transition()
      .duration(1000)
      .call(
        zoom.transform,
        d3.zoomIdentity.translate(x, y).scale(1),
      )
      .on('end', showPopoverUser)
  }

  const messageFn = () => {
    message.info({
      content: <StyledMessageRelative>
        <ExclamationCircleOutlined />
        {/* 140 - 12 + 40 */}
        <span style={{ paddingRight: 168, overflow: 'hidden' }}>
          现在就开始建立你在元宇宙网络的个人站点吧！
          <StyledMessageButton>开始创建</StyledMessageButton>
        </span>
      </StyledMessageRelative>,
      className: 'custom-message',
      duration: 0,
      icon: ''
    });

    message.info({
      content: <span className="g-green">
        <ExclamationCircleOutlined />
        <span>
          首先，请认领一块空白的地块
        </span>
      </span>,
      className: 'custom-message',
      duration: 0,
      icon: ''
    });

    message.info({
      content: <span>
        <ExclamationCircleOutlined />
        <span>
          请选择紧挨已注册用户的地块
        </span>
      </span>,
      className: 'custom-message',
      duration: 0,
      icon: ''
    });
  };

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
      return node[0]!.user.role || 'exist'
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

      return (
        <>
          <Text>
            <tspan x="0" y="-10">{node[0]?.user.nickname || node[0]?.user.username || '暂无昵称'}</tspan>
            <tspan x="0" y="10">{node[0]?.user.introduction || '暂无简介'}</tspan>
          </Text>
        </>
      )
    }

    const nodeChoose = allNodeChoose.filter(i => i.q === x && i.s === y && i.r === z)
    if (nodeChoose.length) {
      return <Text className={styles['hexagon-add']}>+</Text>
    }
    return null
  }, [allNode, allNodeDisabled, allNodeChoose])

  return (
    <>
      <ToggleSlider></ToggleSlider>
      <DeploySite isModalVisible={isModalVisibleDeploySite} setIsModalVisible={setIsModalVisibleDeploySite}></DeploySite>
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
                    onClick={(e: any) => handleHexagonEventClick(e, `hexagon-x${x}_y${y}_z${z}`, { x: hex.q, y: hex.r }, nodeMode)}
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
      <svg width="100%" height="100%" id="mask-container">
        <defs>
          <mask id="mask" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse">
            <linearGradient id="linearGradient" gradientUnits="objectBoundingBox" x2="0" y2="1">
              <stop stopColor="white" stopOpacity="0" offset="0%" />
              <stop stopColor="white" stopOpacity="1" offset="20%" />
              <stop stopColor="white" stopOpacity="1" offset="40%" />
              <stop stopColor="white" stopOpacity="1" offset="60%" />
              <stop stopColor="white" stopOpacity="1" offset="80%" />
              <stop stopColor="white" stopOpacity="0" offset="100%" />
            </linearGradient>
            <rect width="100%" height="100%" fill="url(#linearGradient)" />
          </mask>
        </defs>
      </svg>
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
  color: #CAF12E;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  box-sizing: border-box;
`