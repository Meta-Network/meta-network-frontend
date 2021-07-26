import React, { useEffect, useState, useRef } from 'react';
// import rd3 from 'react-d3-library'
// import * as d3 from 'd3';

let d3: any = null
if (process.browser) {
  d3 = require('d3')
}

export default function Home() {
  const myRef = useRef(null)

  useEffect(() => {
    const width = 600
    const height = 600
    const data = () => {
      const randomX = d3.randomNormal( width / 2, 80);
      const randomY = d3.randomNormal(height / 2, 80);
      return Array.from({length: 2000}, () => [randomX(), randomY()]);
    }

      const svg = d3.select('#container')
          .append("svg")
          .attr("viewBox", [0, 0, 600, 600]);
    
      const g = svg.append("g");
    
      g.selectAll("circle")
        .data(data)
        .join("circle")
          .attr("cx", ([x]) => x)
          .attr("cy", ([, y]) => y)
          .attr("r", 1.5);
    
      svg.call(d3.zoom()
          .extent([[0, 0], [width, height]])
          .scaleExtent([1, 8])
          .on("zoom", zoomed));
    
      function zoomed({transform}: any) {
        // 边界判定
        console.log('transform', transform)
        let tran = transform
        if (transform.x >= 260) {
          tran = Object.assign(transform, { x: 260 })
        }
        if (transform.y >= 220) {
          tran = Object.assign(transform, { y: 220 })
        }
        if (transform.x <= -420) {
          tran = Object.assign(transform, { x: -420 })
        }
        if (transform.y <= -400) {
          tran = Object.assign(transform, { y: -400 })
        }
        g.attr("transform", tran);
      }
    
      svg.node();

  }, []);

  return (
    <div ref={myRef} id="container"></div>
  )
}
