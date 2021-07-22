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

  containerNode.isSprite = true
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