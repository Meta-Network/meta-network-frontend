import React, { useEffect, useState, useRef } from 'react';
// import rd3 from 'react-d3-library'
// import * as d3 from 'd3';
import { defineGrid, extendHex } from 'honeycomb-grid'
import { SVG } from '@svgdotjs/svg.js'
import { Display } from 'rot-js'
import { hexbin } from 'd3-hexbin';
import { HexGrid, Layout, Hexagon, Text, GridGenerator, HexUtils } from 'react-hexgrid';

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
  },
  "triangle": {
    "width": 1000,
    "height": 800,
    "layout": { "width": 9, "height": 9, "flat": false, "spacing": 1.05 },
    "origin": { "x": -45, "y": -35 },
    "map": "triangle",
    "mapProps": [ 5 ]
  },
  "parallelogram": {
    "width": 1000,
    "height": 800,
    "layout": { "width": 7, "height": 7, "flat": true, "spacing": 1.05 },
    "origin": { "x": 0, "y": 0 },
    "map": "parallelogram",
    "mapProps": [ -2, 2, -2, 2 ]
  },
  "rectangle": {
    "width": 1000,
    "height": 800,
    "layout": { "width": 6, "height": 6, "flat": false, "spacing": 1.02 },
    "origin": { "x": -45, "y": -40 },
    "map": "rectangle",
    "mapProps": [ 10, 10 ]
  },
  "orientedRectangle": {
    "width": 1000,
    "height": 800,
    "layout": { "width": 6, "height": 6, "flat": false, "spacing": 1.1 },
    "origin": { "x": -45, "y": -15 },
    "map": "orientedRectangle",
    "mapProps": [ 7, 7 ]
  },
  "ring": {
    "width": 1000,
    "height": 800,
    "layout": { "width": 6, "height": 6, "flat": false, "spacing": 1.1 },
    "origin": { "x": 0, "y": 0 },
    "map": "ring",
    "mapProps": [ {"q":0,"r":0,"s":0}, 3 ]
  },
  "spiral": {
    "width": 1000,
    "height": 800,
    "layout": { "width": 6, "height": 6, "flat": false, "spacing": 1.1 },
    "origin": { "x": 0, "y": 0 },
    "map": "spiral",
    "mapProps": [ {"q":0,"r":0,"s":0}, 3 ]
  }
}
const config = configs['hexagon']
const layout = config.layout;
const size = { x: layout.width, y: layout.height };

export default function Home() {
  const myRef = useRef(null)
  const [hex, setHex] = useState([]);

  // useEffect(() => {
  //   let o = {
  //     width: 11,
  //     height: 5
  //   }
  //   let d = new Display(o);
  //   document.body.appendChild(d.getContainer());
    
  //   for (let i=0; i<o.width; i++) {
  //     for (let j=0; j<o.height; j++) {
  //       if (!i || !j || i+1 == o.width || j+1 == o.height) {
  //         d.draw(i, j, "#", "gray");
  //       } else {
  //         d.draw(i, j, ".", "#666");
  //       }
  //     }
  //   }
  //   d.draw(o.width >> 1, o.height >> 1, "@", "goldenrod");
  // }, []);

  // useEffect(() => {
  //   const draw = SVG().addTo('body').size('800px', '800px%')

  //   const Hex = extendHex({ size: 50 })
  //   const Grid = defineGrid(Hex)
  //   // get the corners of a hex (they're the same for all hexes created with the same Hex factory)
  //   const corners = Hex().corners()
  //   // an SVG symbol can be reused
  //   const hexSymbol = draw.symbol()
  //       // map the corners' positions to a string and create a polygon
  //       .polygon(corners.map(({ x, y }) => `${x},${y}`))
  //       .fill('none')
  //       .stroke({ width: 1, color: '#999' })

  //   // render 10,000 hexes
  //   Grid.rectangle({ width: 2, height: 2 }).forEach(hex => {
  //       const { x, y } = hex.toPoint()
  //       // use hexSymbol and set its position for each hex
  //       draw.use(hexSymbol).translate(x, y)
  //   })
  // }, []);

  // useEffect(() => {
  //   const width = 600
  //   const height = 600
  //   const data = () => {
  //     const randomX = d3.randomNormal( width / 2, 80);
  //     const randomY = d3.randomNormal(height / 2, 80);
  //     return Array.from({length: 2000}, () => [randomX(), randomY()]);
  //   }

  //     const svg = d3.select('#container')
  //         .append("svg")
  //         .attr("viewBox", [0, 0, 600, 600]);
    
  //     const g = svg.append("g");
    
  //     g.selectAll("circle")
  //       .data(data)
  //       .join("circle")
  //         .attr("cx", ([x]) => x)
  //         .attr("cy", ([, y]) => y)
  //         .attr("r", 1.5);
    
  //     svg.call(d3.zoom()
  //         .extent([[0, 0], [width, height]])
  //         .scaleExtent([1, 8])
  //         .on("zoom", zoomed));
    
  //     function zoomed({transform}: any) {
  //       // 边界判定
  //       console.log('transform', transform)
  //       let tran = transform

  //       const numberFloor = (n: number, k: number) => {
  //         return Math.floor(n * k)
  //       }

  //       if (transform.x >= numberFloor(220, transform.k)) {
  //         tran = Object.assign(transform, { x: numberFloor(220, transform.k) })
  //       }
  //       if (transform.y >= numberFloor(220, transform.k)) {
  //         tran = Object.assign(transform, { y: numberFloor(220, transform.k) })
  //       }
  //       if (transform.x <= numberFloor(-400, transform.k)) {
  //         tran = Object.assign(transform, { x: numberFloor(-400, transform.k) })
  //       }
  //       if (transform.y <= numberFloor(-400, transform.k)) {
  //         tran = Object.assign(transform, { y: numberFloor(-400, transform.k) })
  //       }
  //       g.attr("transform", tran);
  //     }
  //     svg.node();

  // }, []);


  useEffect(() => {
    const width = 600
    const height = 600
      const svg = d3.select('#container')
      svg.call(d3.zoom()
          .extent([[0, 0], [width, height]])
          .scaleExtent([1, 8])
          .on("zoom", zoomed));

      function zoomed({transform}: any) {
        // 边界判定
        console.log('transform', transform)
        let tran = transform

        const numberFloor = (n: number, k: number) => {
          return Math.floor(n * k)
        }

        if (transform.x >= numberFloor(220, transform.k)) {
          tran = Object.assign(transform, { x: numberFloor(220, transform.k) })
        }
        if (transform.y >= numberFloor(220, transform.k)) {
          tran = Object.assign(transform, { y: numberFloor(220, transform.k) })
        }
        if (transform.x <= numberFloor(-400, transform.k)) {
          tran = Object.assign(transform, { x: numberFloor(-400, transform.k) })
        }
        if (transform.y <= numberFloor(-400, transform.k)) {
          tran = Object.assign(transform, { y: numberFloor(-400, transform.k) })
        }
        const svg = d3.select('#container svg')
        svg.attr("transform", tran);
      }
      svg.node();

  }, []);


  useEffect(() => {
    // var svg = d3.select("#container").append("svg")
    // .attr("width", "300")
    // .attr("height","300")
    // .attr("viewBox","-150 -150 300 300")

    // svg.append("path")
    //   .attr('style', 'fill:blue')
    //   .attr('d',hexbin().hexagon(80));

    // // const hexbinD3 = hexbin();
    // console.log('hexagon()', hexbin().hexagon(80))

  }, []);

  useEffect(() => {
    const Hex = extendHex({ size: 30 })
    const Grid = defineGrid(Hex)
    const grid = Grid.rectangle({ width: 10, height: 10 })
    console.log('grid', grid)


  const generator = GridGenerator.getGenerator(config.map);
  console.log('generator', generator)
  const hexagons = generator.apply(null, config.mapProps);

  console.log('hexagons', hexagons)
  setHex(hexagons)


  }, []);

  return (
    <div id="container">
      {/* <div ref={myRef} id="container"></div> */}
      {/* <div id="path"></div> */}
      <HexGrid width={config.width} height={config.height}>
          <Layout size={size} flat={layout.flat} spacing={layout.spacing} origin={config.origin}>
            {
              // note: key must be unique between re-renders.
              // using config.mapProps+i makes a new key when the goal template chnages.
              hex.map((hex: any, i) => (
                <Hexagon key={i} q={hex.q} r={hex.r} s={hex.s}>
                  {/* <Text>{HexUtils.getID(hex)}</Text> */}
                </Hexagon>
              ))
            }
          </Layout>
        </HexGrid>
    </div>
  )
}
