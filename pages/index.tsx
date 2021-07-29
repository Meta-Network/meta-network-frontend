import React, { useEffect, useState, useRef, useCallback } from 'react';
// import rd3 from 'react-d3-library'
// import * as d3 from 'd3';
import { defineGrid, extendHex } from 'honeycomb-grid'
import { SVG } from '@svgdotjs/svg.js'
import { Display } from 'rot-js'
import { hexbin } from 'd3-hexbin';
import { HexGrid, Layout, Hexagon, Text, GridGenerator, HexUtils } from 'react-hexgrid';
import tippy from 'tippy.js';
import { randomRange } from '../utils/index'
import styles from './index/index.module.scss'
import { AddSvg } from '../components/Svg/Index'
import { PlusOutlined } from '@ant-design/icons'
import { message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import styled from 'styled-components'

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
    "layout": { "width": 80, "height": 80, "flat": false, "spacing": 1.1 },
    "origin": { "x": 100, "y": 100 },
    "map": "hexagon",
    "mapProps": [10]
  }
}
const config = configs['hexagon']
const layout = config.layout;
const size = { x: layout.width, y: layout.height };

export default function Home() {
  const myRef = useRef(null)
  const [hex, setHex] = useState([]);

  const [width, setWidth] = useState<number>(config.width);
  const [height, setHeight] = useState<number>(config.height);
  const [origin, setOrigin] = useState<{ x: number, y: number }>(config.origin);


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

  useEffect(() => {
    resizeFn()
    window.addEventListener('resize', resizeFn)

    messageFn()
  }, [resizeFn]);

  useEffect(() => {
    const svg = d3.select('#container svg')

    svg.call(
      zoom
        .extent([[0, 0], [width, height]])
        .scaleExtent([0.6, 4])
        .on("zoom", zoomed)
    )

    function zoomed({ transform }: any) {
      // 边界判定
      // console.log('transform', transform)
      let tran = transform

      // const numberFloor = (n: number, k: number) => {
      //   return Math.floor(n * k)
      // }

      // if (transform.x >= numberFloor(220, transform.k)) {
      //   tran = Object.assign(transform, { x: numberFloor(220, transform.k) })
      // }
      // if (transform.y >= numberFloor(220, transform.k)) {
      //   tran = Object.assign(transform, { y: numberFloor(220, transform.k) })
      // }
      // if (transform.x <= numberFloor(-400, transform.k)) {
      //   tran = Object.assign(transform, { x: numberFloor(-400, transform.k) })
      // }
      // if (transform.y <= numberFloor(-400, transform.k)) {
      //   tran = Object.assign(transform, { y: numberFloor(-400, transform.k) })
      // }
      const svg = d3.select('#container svg > g')
      svg.attr("transform", tran);
    }
    svg.node();

    const initCenter = () => {
      const svg = d3.select('#container svg')
      let widthSvg = svg.attr('width')
      let heightSvg = svg.attr('height')

      // console.log('log transform', JSON.stringify(svg.attr('width')))
      // svg.attr("transform", `translate(${(width - widthSvg) / 2}, ${(height - heightSvg) / 2})`);
    }
    initCenter()

  }, []);

  useEffect(() => {
    const generator = GridGenerator.getGenerator(config.map);
    const hexagons = generator.apply(null, config.mapProps);

    console.log('hexagons', hexagons)
    setHex(hexagons)
  }, []);

  const handleHexagonEventClick = (e: any, className: string, point: { x: number, y: number }) => {
    // console.log('e', e)
    // let target: any = document.querySelector(`.${className}`)
    // console.log('target', target, className)
    // tippy(target, {
    //   content: '<div class="popover-avatar-wrapper"><img src="https://img.zfn9.com/05/af/2f2325f9807107637c62effc1340224d.jpg" /></div>',
    //   allowHTML: true,
    //   trigger: 'click',
    //   placement: 'top',
    //   animation: 'scale',
    // });

    // https://www.redblobgames.com/grids/hexagons/#hex-to-pixel
    // 方向不同 算法有细微差别
    const svg = d3.select('#container svg')
    let _x = layout.width * (Math.sqrt(3) * -point.x + Math.sqrt(3) / 2 * -point.y)
    let _y = layout.height * (3 / 2 * -point.y)
    _x = _x * layout.spacing
    _y = _y * layout.spacing

    console.log('point', point, _x, _y)

    svg.transition()
      .duration(1000)
      .call(
        zoom.transform,
        d3.zoomIdentity.translate(_x, _y).scale(1)
      )
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

  return (
    <>
      <div id="container">
        <HexGrid width={width} height={height} viewBox={`0, 0, ${Math.floor(width)}, ${Math.floor(height)}`} >
          <Layout size={size} flat={layout.flat} spacing={layout.spacing} origin={origin}>
            {
              // note: key must be unique between re-renders.
              // using config.mapProps+i makes a new key when the goal template chnages.
              hex.map((hex: any, i) => {

                let num = randomRange(1, 5)
                let test: any = {
                  1: 'default',
                  2: 'choose',
                  3: 'exist',
                  4: 'active',
                  5: 'v',
                }
                // const mode = test[num]
                const mode = test[1]

                return (
                  <Hexagon
                    key={i}
                    q={hex.q}
                    r={hex.r}
                    s={hex.s}
                    onClick={(e: any) => handleHexagonEventClick(e, `hexagon-x${hex.q}_y${hex.s}_z${hex.r}`, { x: hex.q, y: hex.r })}
                    className={`${styles[`hexagon-${mode}`]} hexagon-x${hex.q}_y${hex.s}_z${hex.r}`}>
                    {/* <Text>{HexUtils.getID(hex)}</Text> */}
                    {/* <Text>{`x: ${hex.q}, z: ${hex.r}, y: ${hex.s}`}</Text> */}
                    {/* <Text>{`x: ${hex.q}, z: ${hex.r}, y: ${hex.s}`}</Text> */}
                    {
                      mode === 'default' ?
                        null :
                        mode === 'choose' ?
                          <Text className={styles['hexagon-add']}>+</Text> :
                          <Text>
                            <tspan x="0" y="-10">小田 XIAO TIAN</tspan>
                            <tspan x="0" y="10">这是一条简介</tspan>
                          </Text>
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