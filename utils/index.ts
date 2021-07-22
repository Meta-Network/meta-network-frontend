interface generatePointsProps {
  x: number,
  y: number,
  width: number,
  height: number,
  padding: number,
  edge: number
}

/**
 * 
 * @param width : ;
 * @param height 
 * @param edge 
 * @returns 
 */
export const computeHexagonPoints = (width: number, height: number, edge: number): number[][] => {
  let centerX = width /2 ;
  let centerY = height / 2;
  let x = edge * Math.sqrt(3) / 2
  let y = edge / 2
  let left = centerX - x
  let top = centerY - 2 * y
  let x1, x2, x3, x4, x5, x6;
  let y1, y2, y3, y4, y5, y6;

  x5 = x6 = left
  x2 = x3 = left + 2 * x
  x1 = x4 = left + x

  y1 = top
  y2 = y6 = top + y
  y3 = y5 = top + 3 * y
  y4 = top + 4 * y

  let points = []
  points[0] = [x1, y1]
  points[1] = [x2, y2]
  points[2] = [x3, y3]
  points[3] = [x4, y4]
  points[4] = [x5, y5]
  points[5] = [x6, y6]

  return points
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

export const nodeDraw = ({ pixi, container, edge }: { pixi: any, container: any, edge: number }) => {
  const containerNode = new pixi.Container();

  let w = (edge * Math.sqrt(3) / 2) * 2
  let h = edge * 2

  let node = new pixi.Graphics();
  node.lineStyle(2, 0xF5F5F5, 1);
  node.beginFill(0x2A1056);
  node.drawPolygon(computeHexagonPoints(w, h , edge).flat(2));
  node.endFill();
  node.x = w / 2;
  node.y = h / 2;
  node.pivot.set(w / 2, h / 2)

  containerNode.addChild(node);

  container.addChild(containerNode);

  return {
    containerNode: containerNode,
    width: w,
    height: h
  }
}

export const generatePoints = ({ x, y, width, height, padding, edge }: generatePointsProps) => {

  console.log('w', width)
  console.log('h', height)

  let total = x * y
  let points: number[][] = []
  for (let i = 0; i < total; i++) {
    // console.log('i', i, i % x, Math.ceil((i + 1) / x))
    // first point
    if (i === 0) {
      points[0] = [0, 0]
      continue
    }

    // first row
    if (i < x) {
      let _x, _y;
      _x = i * width + i * padding;
      _y = 0
      points[i] = [_x, _y]
    }

    // other row
    if (i >= x) {
      let _x, _y;
      let row = Math.ceil((i + 1) / x)
      let col = i % x

      // 偶数行
      if (row % 2 === 0) {
        // 默认距离 + x width and padding
        _x = ( (width / 2) + ( 44 / 2 ) ) + ( width * col ) + ( padding * col )
      } else {
        _x = col * width + col * padding;
      }
      // 默认距离 x 倍
      _y = ( height - (edge / 10) ) * ( row - 1)
      points[i] = [_x, _y]
    }
  }

  console.log('points', points)
  return points
}