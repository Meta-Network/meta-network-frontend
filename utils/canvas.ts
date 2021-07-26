import { computeHexagonPoints, randomRange } from './index'
import addSvg from '../assets/svg/add.svg'
import tippy from 'tippy.js';

let PIXI: any = null
if (process.browser) {
  PIXI = require('pixi.js')
}

type NodeMode = 'default' | 'choose' | 'exist' | 'active' | 'v'

interface RenderNodeCommonProps {
  node: any
  width: number
  height: number
  edge: number
  fill: any,
  solideColor: any
  solidAlpha: number
  fillHover: any
  solideColorHover: any
  solidAlphaHover: number
}
interface RenderNodeDefaultProps {
  node: any
  width: number
  height: number
  edge: number
}

interface RenderNodeChooseProps {
  node: any
  container: any
  textures: any
  width: number
  height: number
  edge: number
}



/**
 * 渲染节点公用
 * @param param0 
 */
const renderNodeCommon = ({
  node,
  width,
  height,
  edge,
  fill,
  solideColor,
  solidAlpha,
  fillHover,
  solideColorHover,
  solidAlphaHover
}: RenderNodeCommonProps) => {
  const aniimateToggle = ({
    solidWidth,
    solidColor,
    solidAlpha,
    fill,
    alpha
  }: {
    solidWidth: number,
    solidColor: any,
    solidAlpha: number,
    fill: any,
    alpha: number
  }) => {
    node.clear();
    node.lineStyle(solidWidth, solidColor, solidAlpha);
    node.beginFill(fill);
    node.drawPolygon(computeHexagonPoints(width, height , edge).flat(2));
    node.endFill();

    node.alpha = alpha
  }
  aniimateToggle({
    solidWidth: 2,
    solidColor: solideColor,
    solidAlpha: 1,
    fill: fill,
    alpha: 0.6
  })

  function onMouseout () {
    console.log('onMouseout')
    aniimateToggle({
      solidWidth: 2,
      solidColor: solideColor,
      solidAlpha: 1,
      fill: fill,
      alpha: 0.6
    })
  }
  function onMouseover () {
    console.log('onMouseover')
    aniimateToggle({
      solidWidth: 2,
      solidColor: solideColorHover,
      solidAlpha: 1,
      fill: fillHover,
      alpha: 1
    })
  }

  node.interactive = true
  node.buttonMode = true
  node
    .on('mouseout', onMouseout)
    .on('mouseover', onMouseover)
}

/**
 * 渲染默认节点
 * @param param0
 */
const renderNodeDefault = ({
  node,
  width,
  height,
  edge
}: RenderNodeDefaultProps) => {
  const aniimateToggle = (node: any, solid: number, color: any, alpha: number) => {
    node.clear();
    node.lineStyle(solid, color, alpha);
    node.beginFill(0x2A1056);
    node.drawPolygon(computeHexagonPoints(width, height , edge).flat(2));
    node.endFill();
  }

  aniimateToggle(node, 2, 0xE5E5E5, 0)

  function onMouseout () {
    console.log('onMouseout')
    aniimateToggle(node, 2, 0xE5E5E5, 0)
  }
  function onMouseover () {
    console.log('onMouseover')
    aniimateToggle(node, 2, 0xF5F5F5, 1)
  }

  node.interactive = true
  node.buttonMode = true
  node
    .on('mouseout', onMouseout)
    .on('mouseover', onMouseover)
}

/**
 * 渲染可选择节点
 * @param param0
 */
const renderNodeChoose = ({
  node,
  container,
  textures,
  width,
  height,
  edge
}: RenderNodeChooseProps) => {

  console.log('textures.add', textures.add)
  const spirte = new PIXI.Sprite(textures.add);
  container.addChild(spirte);

  spirte.width = 16
  spirte.height = 16
  spirte.pivot.x = 16 / 2
  spirte.pivot.y = 16 / 2
  spirte.x = width / 2 - 16 / 2
  spirte.y = height / 2 - 16 / 2

  const aniimateToggle = (node: any, solid: number, color: any, alpha: number, spirteAlpha: number) => {
    node.clear();
    node.lineStyle(solid, color, alpha);
    node.beginFill(0x2A1056);
    node.drawPolygon(computeHexagonPoints(width, height , edge).flat(2));
    node.endFill();

    spirte.alpha = spirteAlpha
  }

  aniimateToggle(node, 2, 0xE5E5E5, 0, 0.5)

  function onMouseout () {
    console.log('onMouseout')
    aniimateToggle(node, 2, 0xE5E5E5, 0, 0.5)
  }
  function onMouseover () {
    console.log('onMouseover')
    aniimateToggle(node, 2, 0xFFFFFF, 1, 1)
  }

  node.interactive = true
  node.buttonMode = true
  node
    .on('mouseout', onMouseout)
    .on('mouseover', onMouseover)
}

/**
 * 选择文本
 * @param param0 
 */
const renderNodeText = ({
  node,
  container,
  title
}: {
  node: any
  container: any
  title: string
}) => {
  let styleUsername = new PIXI.TextStyle({
    fontSize: 20,
    fill: "white",
  });
  let styleIntroduction = new PIXI.TextStyle({
    fontSize: 14,
    fill: "white",
  });
  let username = new PIXI.Text(title, styleUsername);
  let introduction = new PIXI.Text("可能比较长的简介", styleIntroduction);

  container.addChild(username);
  container.addChild(introduction);

  username.x = node.width / 2
  // username.y = node.height / 2
  username.y = 60
  username.pivot.x = username.width / 2
  username.pivot.y = username.height / 2

  introduction.x = node.width / 2
  // introduction.y = node.height / 2
  introduction.y = username.height + 60 + 10
  introduction.pivot.x = introduction.width / 2
  introduction.pivot.y = introduction.height / 2
}

const handlePopover = ({
  node
}: {
  node: any
}) => {
  const handleEventClick = (event: any) => {
    console.log('handleEventClick event', event)

    let width = document.body.clientWidth || document.documentElement.clientWidth
    let height = document.body.clientHeight || document.documentElement.clientHeight

    const instance: any  = tippy((document as any).querySelector('#popover'));
    instance.setProps({
      arrow: true,
      animation: 'scale',
      placement: 'top',
      offset: [0, height / 2 + node.height / 2 + 20],
      content: '<div class="popover-avatar-wrapper"><img src="https://www.bugela.com/uploads/allimg/20200207/1248046800.jpg" /></div>',
      allowHTML: true,
    });
    instance.show();
  }

  node.on('click', handleEventClick)
}

/**
 * 节点绘制
 * @param param0
 */


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

export const nodeDraw = ({ pixi, container, edge, textures, index }: { pixi: any, container: any, edge: number, textures: object, index: number }) => {
  let num = randomRange(1, 5)
  let test: any = {
    1: 'default',
    2: 'choose',
    3: 'exist',
    4: 'active',
    5: 'v',
  }
  // default 默认 不可选
  // choose 可选择
  //
  const mode: NodeMode = test[num] as NodeMode

  const containerNode = new pixi.Container();

  let w = (edge * Math.sqrt(3) / 2) * 2
  let h = edge * 2

  let node = new pixi.Graphics();
  containerNode.addChild(node);

  handlePopover({ node })

  if (mode === 'default') {
    renderNodeDefault({
      node,
      width: w,
      height: h,
      edge: edge
    })
  } else if (mode === 'choose') {
    renderNodeChoose({
      node,
      container: containerNode,
      textures: textures,
      width: w,
      height: h,
      edge: edge
    })
  } else if (mode === 'exist') {
    renderNodeCommon({
      node,
      width: w,
      height: h,
      edge: edge,
      fill: 0x46156A,
      solideColor: 0x7A45D1,
      solidAlpha: 1,
      fillHover: 0x46156A,
      solideColorHover: 0xf5f5f5,
      solidAlphaHover: 0.8,
    })
  } else if (mode === 'active') {
    renderNodeCommon({
      node,
      width: w,
      height: h,
      edge: edge,
      fill: 0x7D4DA0,
      solideColor: 0x7A45D1,
      solidAlpha: 1,
      fillHover: 0x7D4DA0,
      solideColorHover: 0xF5F5F5,
      solidAlphaHover: 0.8,
    })
  } else if (mode === 'v') {
    renderNodeCommon({
      node,
      width: w,
      height: h,
      edge: edge,
      fill: 0xCAA2E7,
      solideColor: 0x7A45D1,
      solidAlpha: 1,
      fillHover: 0xCAA2E7,
      solideColorHover: 0xF5F5F5,
      solidAlphaHover: 0.8,
    })
  }

  if (mode !== 'default' && mode !== 'choose') {
    // renderNodeText({
    //   node: node,
    //   container: containerNode,
    //   title: `小田 XIAO ${index}`
    // })
  }

  node.x = w / 2;
  node.y = h / 2;
  node.pivot.set(w / 2, h / 2)

  container.addChild(containerNode);

  return {
    containerNode: containerNode,
    node: node,
    width: w,
    height: h
  }
}