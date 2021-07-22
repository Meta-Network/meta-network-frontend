import React, { useEffect } from 'react';
// import PIXI from 'pixi.js'
// import PixiJSGrid from 'pixijs-grid/dist/pixijs-grid'
import { nodeDraw, generatePoints } from '../utils/index'

let PIXI: any = null
if (process.browser) {
  PIXI = require('pixi.js')

  console.log('PIXI', PIXI)
    ; (window as any).PIXI = PIXI
}


export default function Home() {
  const init = () => {

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

    // 内容容器
    const containerMain = new PIXI.Container();
    containerMain.x = (width - (width * 0.9)) / 2
    containerMain.y = (height - (height * 0.9)) / 2
    // containerMain.x = app.renderer.width / 2
    // containerMain.y = app.renderer.height / 2
    // containerMain.pivot.set(containerMain.width / 2, containerMain.height / 2)


    // nodeDraw({ pixi: PIXI, container: containerMain, edge: 80 })

    // const { containerNode: nodeDraw2, width: nodeDraw2Width } = nodeDraw({ pixi: PIXI, container: containerMain, edge: 80 })
    // nodeDraw2.x = nodeDraw2Width + 44

    // const { containerNode: nodeDraw3, width: nodeDraw3Width } = nodeDraw({ pixi: PIXI, container: containerMain, edge: 80 })
    // nodeDraw3.x = nodeDraw3Width + nodeDraw3Width + 44 + 44


    // const { containerNode: nodeDraw4, width: nodeDraw4Width, height: nodeDraw4Height } = nodeDraw({ pixi: PIXI, container: containerMain, edge: 80 })
    // nodeDraw4.x = (nodeDraw4Width / 2) + 44 / 2
    // nodeDraw4.y = nodeDraw4Height - ( 80 / 10 )

    // const { containerNode: nodeDraw5, width: nodeDraw5Width, height: nodeDraw5Height } = nodeDraw({ pixi: PIXI, container: containerMain, edge: 80 })
    // nodeDraw5.x = nodeDraw5Width + nodeDraw5Width + 44 - (nodeDraw5Width / 2)  + 44 / 2
    // nodeDraw5.y = nodeDraw5Height - ( 80 / 10 )

    // const { containerNode: nodeDraw6, width: nodeDraw6Width, height: nodeDraw6Height } = nodeDraw({ pixi: PIXI, container: containerMain, edge: 80 })
    // nodeDraw6.x = nodeDraw6Width + nodeDraw6Width + nodeDraw6Width + 44 + 44 - (nodeDraw5Width / 2) + 44 / 2
    // nodeDraw6.y = nodeDraw6Height - ( 80 / 10 )


    // const { containerNode: nodeDraw7, width: nodeDraw7Width, height: nodeDraw7Height } = nodeDraw({ pixi: PIXI, container: containerMain, edge: 80 })
    // nodeDraw7.y = nodeDraw7Height + nodeDraw7Height - ( 80 / 10 ) - ( 80 / 10 )

    // const { containerNode: nodeDraw8, width: nodeDraw8Width, height: nodeDraw8Height } = nodeDraw({ pixi: PIXI, container: containerMain, edge: 80 })
    // nodeDraw8.x = nodeDraw8Width + 44
    // nodeDraw8.y = nodeDraw8Height + nodeDraw8Height - ( 80 / 10 ) - ( 80 / 10 )

    // const { containerNode: nodeDraw9, width: nodeDraw9Width, height: nodeDraw9Height } = nodeDraw({ pixi: PIXI, container: containerMain, edge: 80 })
    // nodeDraw9.x = nodeDraw9Width + nodeDraw9Width + 44 + 44
    // nodeDraw9.y = nodeDraw9Height + nodeDraw9Height - ( 80 / 10 ) - ( 80 / 10 )

    // 节点容器
    const containerMainNode = new PIXI.Container();
    containerMainNode.interactive = true
    containerMainNode.buttonMode = true


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
        console.log('containerMainNode', containerMainNode)
        containerMainNode.x = newPosition.x;
        containerMainNode.y = newPosition.y;
      }
    }

    // events for drag start
    containerMainNode.on('mousedown', onDragStart)
      .on('touchstart', onDragStart)
      // events for drag end
      .on('mouseup', onDragEnd)
      .on('mouseupoutside', onDragEnd)
      .on('touchend', onDragEnd)
      .on('touchendoutside', onDragEnd)
      // events for drag move
      .on('mousemove', onDragMove)
      .on('touchmove', onDragMove);

    let points = generatePoints({
      x: 10,
      y: 10,
      width: (80 * Math.sqrt(3) / 2) * 2,
      height: 80 * 2,
      padding: 44,
      edge: 80
    })

    for (let i = 0; i < points.length; i++) {
      const ele = points[i];
      let { containerNode } = nodeDraw({ pixi: PIXI, container: containerMainNode, edge: 80 })
      containerNode.x = ele[0]
      containerNode.y = ele[1]
    }
    containerMain.addChild(containerMainNode);


    app.stage.addChild(containerMain);

    let superFastSprites = new PIXI.ParticleContainer();
    superFastSprites.width = width * 0.9
    superFastSprites.height = height * 0.9
    superFastSprites.x = (width - (width * 0.9)) / 2
    superFastSprites.y = (height - (height * 0.9)) / 2

    let sprite = PIXI.Sprite.from("https://storageapi.fleek.co/xiaotiandada-team-bucket/assets/images/cat.png");
    superFastSprites.addChild(sprite);

    (document as any).querySelector('#main').appendChild(app.view);
  }

  useEffect(() => {
    if (process.browser) {
      window.onload = () => {
        init()
      }
    }
  })

  return (
    <div id="main"></div>
  )
}
