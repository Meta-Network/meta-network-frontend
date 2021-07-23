import React, { useEffect } from 'react';
// import PIXI from 'pixi.js'
// import PixiJSGrid from 'pixijs-grid/dist/pixijs-grid'
import { generatePoints } from '../utils/index'
import { nodeDraw } from '../utils/canvas'
import tippy from 'tippy.js';

let PIXI: any = null
if (process.browser) {
  PIXI = require('pixi.js')

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

    let points = generatePoints({
      x: 18,
      y: 10,
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
        let _x, _y;
        _x = app.screen.width / 2 + containerMainNode.width / 2 - node.width / 2 - ele[0]
        _y = app.screen.height / 2 + containerMainNode.height / 2 - node.height / 2 - ele[1]
        containerMainNode.x = _x
        containerMainNode.y = _y
      }

      node.on('click', handleEventClick)
    }

    containerMainNode.interactive = true
    containerMainNode.buttonMode = true

    containerMainNode.x = app.screen.width / 2;
    containerMainNode.y = app.screen.height / 2;
    containerMainNode.pivot.x = containerMainNode.width / 2
    containerMainNode.pivot.y = containerMainNode.height / 2

    app.stage.addChild(containerMainNode);

    function onDragStart(event: any) {
      console.log('event', event)
      // store a reference to the data
      // the reason for this is because of multitouch
      // we want to track the movement of this particular touch
      containerMainNode.data = event.data;
      containerMainNode.alpha = 0.5;
      containerMainNode.dragging = true;
    }

    function onDragEnd() {
      containerMainNode.alpha = 1;

      containerMainNode.dragging = false;

      // set the interaction data to null
      containerMainNode.data = null;
    }

    function onDragMove() {
      if (containerMainNode.dragging) {
        var newPosition = containerMainNode.data.getLocalPosition(containerMainNode.parent);
        console.log('newPosition', newPosition)
        // console.log('containerMainNode', containerMainNode)
        containerMainNode.x = newPosition.x;
        containerMainNode.y = newPosition.y;
      }
    }

    // events for drag start
    containerMainNode
      .on('mousedown', onDragStart)
      // .on('touchstart', onDragStart)
      // events for drag end
      .on('mouseup', onDragEnd)
      .on('mouseupoutside', onDragEnd)
      // .on('touchend', onDragEnd)
      .on('touchendoutside', onDragEnd)
      // events for drag move
      .on('mousemove', onDragMove)
      // .on('touchmove', onDragMove);

      // .on('pointerdown', onDragStart)
      // .on('pointerup', onDragEnd)
      // .on('pointerupoutside', onDragEnd)
      // .on('pointermove', onDragMove)

    console.log('containerMainNode', containerMainNode.width, containerMainNode.height)


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
    </>
  )
}
