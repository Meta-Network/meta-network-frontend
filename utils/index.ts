import { hexGridsByFilterState } from '../typings/metaNetwork.d'
import { HexagonsState } from '../typings/node.d'
import { Hex } from './lib'

interface CoordinateState {
  x: number,
  y: number,
}

interface generatePointsProps {
  x: number,
  y: number,
  width: number,
  height: number,
  padding: number,
  edge: number
}

/**
 * 计算正六边形
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
 * 生成坐标点
 * @param param0 
 * @returns 
 */
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

/**
 * 范围随机数
 */
export const randomRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

/**
 * 立方体坐标转轴坐标
 * https://www.redblobgames.com/grids/hexagons/#conversions
 * @param x
 * @param y
 * @returns
 */
export const cubeToAxial = (x: number, y: number, z: number) => ({
  x: x,
  y: z
})

/**
 * 轴转立方体坐标坐标
 * https://www.redblobgames.com/grids/hexagons/#conversions
 * @param x
 * @param y
 * @returns
 */
export const axialToCube = (x: number, y: number) => ({
  x: x,
  y: -x-y,
  z: y,
})

/**
 * 计算偏移位置
 * @param layout
 * @param param1
 * @returns
 */
export const calcTranslate = (layout: any, { x, y }: { x: number, y: number }) => {
  // https://www.redblobgames.com/grids/hexagons/#hex-to-pixel
  // 方向不同 算法有细微差别

  let _x = layout.width * (Math.sqrt(3) * -x + Math.sqrt(3) / 2 * -y)
  let _y = layout.height * (3 / 2 * -y)
  _x = _x * layout.spacing
  _y = _y * layout.spacing
  return {
    x: _x, y: _y
  }
}

/**
 * 计算最远距离
 * @param node
 * @param attach
 * @returns number[]
 */
export const calcMaxDistance = (node: hexGridsByFilterState[], attach: number = 6) => {
  let max = 0
  for (let i = 0; i < node.length; i++) {
    const ele = node[i];
    if (Math.abs(ele.x) > max) {
      max = Math.abs(ele.x)
    }
    if (Math.abs(ele.y) > max) {
      max = Math.abs(ele.y)
    }
    if (Math.abs(ele.z) > max) {
      max = Math.abs(ele.z)
    }
  }

  return [max + attach]
}

/**
 * 计算范围内坐标点
 * // center.subtract 不合规的坐标点会报错
 * @param center
 * @param hexGrids
 * @param distance
 * @returns HexagonsState[]
 */
export const calcCenterRange = (center: Hex, hexGrids: HexagonsState[], distance: number) => {
  let points: HexagonsState[] = []
  for (let i = 0; i < hexGrids.length; i++) {
    const ele = hexGrids[i];
    let distanceResult = center.subtract({ q: ele.q, r: ele.r, s: ele.s }).len() <= distance
    if (distanceResult) {
      points.push(ele)
    }
  }
  return points
}

/**
 * 返回两点的角度
 * @param start
 * @param end
 * @returns
 */
export const angle = (start: CoordinateState, end: CoordinateState) => {
  let diff_x = end.x - start.x
  let diff_y = end.y - start.y
  return 360*Math.atan2(diff_y, diff_x)/(2*Math.PI)
}

/**
 * https://github.com/alibaba/hooks/blob/master/packages/hooks/src/useInViewport/index.ts
 * 计算 DOM 是否在屏幕内
 * @param el
 * @returns
 */
export function isInViewPort(el: HTMLElement): boolean | undefined  {
  if (!el) {
    return undefined;
  }

  const viewPortWidth =
    window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  const viewPortHeight =
    window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  const rect = el.getBoundingClientRect();

  if (rect) {
    const { top, bottom, left, right } = rect;
    return bottom > 0 && top <= viewPortHeight && left <= viewPortWidth && right > 0;
  }

  return false;
}

// compose
// https://github.com/reduxjs/redux/blob/master/src/compose.ts
export const compose = (...fn: Function[]) => {
  if (fn.length === 0) {
    return <T>(arg: T) => arg
  }

  if (fn.length === 1) {
    return fn[0]
  }

  return fn.reduce((a, b) => (...args: any) => a(b(...args)))
}