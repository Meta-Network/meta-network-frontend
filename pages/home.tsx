import React, { useEffect, useState, useRef } from 'react';
// import rd3 from 'react-d3-library'
// import * as d3 from 'd3';
import { defineGrid, extendHex } from 'honeycomb-grid'
import { SVG } from '@svgdotjs/svg.js'
import { Display } from 'rot-js'
import { hexbin } from 'd3-hexbin';
import { HexGrid, Layout, Hexagon, Text, GridGenerator, HexUtils } from 'react-hexgrid';
import tippy from 'tippy.js';
import { randomRange } from '../utils/index'

let d3: any = null
if (process.browser) {
  d3 = require('d3')
}

const configs = {
  "hexagon": {
    "width": 1000,
    "height": 800,
    "layout": { "width": 8, "height": 8, "flat": false, "spacing": 1.1 },
    "origin": { "x": 0, "y": 0 },
    "map": "hexagon",
    "mapProps": [ 3 ]
  }
}
const config = configs['hexagon']
const layout = config.layout;
const size = { x: layout.width, y: layout.height };

export default function Home() {
  const myRef = useRef(null)
  const [hex, setHex] = useState([]);

  useEffect(() => {
    const width = window.innerWidth * 0.9
    const height = window.innerHeight * 0.9
      const container = d3.select('#container')
      const svg = d3.select('#container svg')
      let widthSvg = svg.attr('width')
      let heightSvg = svg.attr('height')

      container.call(d3.zoom()
          .extent([[0, 0], [width, height]])
          .scaleExtent([1, 4])
          .on("zoom", zoomed))

      function zoomed({transform}: any) {
        // 边界判定
        console.log('transform', transform)
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
        const svg = d3.select('#container svg')
        svg.attr("transform", tran);
      }
      // svg.node();

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

  const handleHexagonEventClick = (e: any, className: string) => {
    console.log('e', e)
    let target: any = document.querySelector(`.${className}`)
    console.log('target', target, className)
    tippy(target, {
      content: '<div class="popover-avatar-wrapper"><img src="https://img.zfn9.com/05/af/2f2325f9807107637c62effc1340224d.jpg" /></div>',
      allowHTML: true,
      trigger: 'click',
      placement: 'top',
      animation: 'scale',
    });
  }

  return (
    <div id="container">
      <HexGrid width={config.width} height={config.height}>
          <Layout size={size} flat={layout.flat} spacing={layout.spacing} origin={config.origin}>
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
                const mode = test[num]

                return (
                  <Hexagon
                    key={i}
                    q={hex.q}
                    r={hex.r}
                    s={hex.s}
                    onClick={ (e: any) => handleHexagonEventClick(e, `hexagon-x${hex.q}_y${hex.s}_z${hex.r}`) }
                    className={ `hexagon-${mode} hexagon-x${hex.q}_y${hex.s}_z${hex.r}` }>
                    {/* <Text>{HexUtils.getID(hex)}</Text> */}
                    <Text>{`x: ${hex.q}, z: ${hex.r}, y: ${hex.s}`}</Text>
                  </Hexagon>
                )
              })
            }
          </Layout>
        </HexGrid>
    </div>
  )
}
