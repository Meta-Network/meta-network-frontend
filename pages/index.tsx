import React, { useEffect } from 'react';
// import PIXI from 'pixi.js'
// import PixiJSGrid from 'pixijs-grid/dist/pixijs-grid'
import { generatePoints } from '../utils/index'
import { nodeDraw } from '../utils/canvas'
import tippy from 'tippy.js';

let PIXI: any = null
let Scrollbox: any = null
if (process.browser) {
  PIXI = require('pixi.js')
  Scrollbox = require('pixi-scrollbox').Scrollbox

  console.log('PIXI', PIXI)
    ; (window as any).PIXI = PIXI
}


export default function Home() {
  const init = async () => {
    let width = document.body.clientWidth || document.documentElement.clientWidth
    let height = document.body.clientHeight || document.documentElement.clientHeight

    const app = new PIXI.Application({
      width: width,
      height: height,
      antialias: true,
      transparent: false,
      resolution: 1,
      backgroundColor: 0x1A1147
    });

    const textureAdd = await PIXI.Texture.fromURL('https://ipfs.fleek.co/ipfs/bafybeibtamfcrrrjzb4fcz7bqwx45c7kcppd2y33zhvjhb3ljm2neqfl6i')
    const textures = {
      'add': textureAdd
    }

    // 节点容器
    const containerMainNode = new PIXI.Container();

    // create the scrollbox
    const scrollbox = new Scrollbox({
      boxWidth: Math.floor(width * 0.9),
      boxHeight: Math.floor(height * 0.9),
      // scrollWidth: 1000,
      // scrollHeight: 1000,
      scrollbarBackgroundAlpha: '0',
      scrollbarForegroundAlpha: '0',
      // scrollbarOffsetHorizontal: 200,
      // scrollbarOffsetVertical: 200,
    })
    scrollbox.x = (width - Math.floor(width * 0.9)) / 2;
    scrollbox.y = (height - Math.floor(height * 0.9)) / 2;
    // scrollbox.pivot.x = Math.floor(width * 0.9) / 2
    // scrollbox.pivot.y = Math.floor(height * 0.9) / 2

    let points = generatePoints({
      x: 9,
      y: 6,
      width: (80 * Math.sqrt(3) / 2) * 2,
      height: 80 * 2,
      padding: 44,
      edge: 80
    })

    for (let i = 0; i < points.length; i++) {
      const ele = points[i];
      let { containerNode, node } = nodeDraw({ pixi: PIXI, container: containerMainNode, edge: 80, textures: textures, index: i })
      containerNode.x = ele[0]
      containerNode.y = ele[1]

      const handleEventClick = () => {
        // let _x, _y;
        // _x = app.screen.width / 2 + containerMainNode.width / 2 - node.width / 2 - ele[0]
        // _y = app.screen.height / 2 + containerMainNode.height / 2 - node.height / 2 - ele[1]
        // containerMainNode.x = _x
        // containerMainNode.y = _y

        scrollbox.content.x = -100
        scrollbox.content.y = -100
      }

      // node.on('click', handleEventClick)
    }

    // containerMainNode.interactive = true
    // containerMainNode.buttonMode = true

    // containerMainNode.x = app.screen.width / 2;
    // containerMainNode.y = app.screen.height / 2;
    // containerMainNode.pivot.x = containerMainNode.width / 2
    // containerMainNode.pivot.y = containerMainNode.height / 2

    // app.stage.addChild(containerMainNode);

    // add a sprite to the scrollbox's content
    scrollbox.content.addChild(containerMainNode)

    console.log('scrollbox.content', scrollbox.content)

    // force an update of the scrollbox's calculations after updating the children
    scrollbox.update()


    // add the viewport to the stage
    app.stage.addChild(scrollbox)


    ;(document as any).querySelector('#main').appendChild(app.view);
  }

  useEffect(() => {
    if (process.browser) {
      window.onload = () => {
        init()
      }
    }
  })

  return (
    <>
      <div id="main"></div>
      <button id="popover"></button>
      <div id="stats"></div>
    </>
  )
}
