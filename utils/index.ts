import { trim } from 'lodash'
import { hexGridsByFilterState } from '../typings/metaNetwork.d'
import { HexagonsState, PointState } from '../typings/node.d'
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

interface calcTranslateValueState {
  x: number
  y: number
  width: number
  height: number
  scale: number
}

/**
 * 计算正六边形
 * @param width : ;
 * @param height
 * @param edge
 * @returns
 */
export const computeHexagonPoints = (width: number, height: number, edge: number): number[][] => {
  let centerX = width / 2
  let centerY = height / 2
  let x = edge * Math.sqrt(3) / 2
  let y = edge / 2
  let left = centerX - x
  let top = centerY - 2 * y
  let x1, x2, x3, x4, x5, x6
  let y1, y2, y3, y4, y5, y6

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
      let _x, _y
      _x = i * width + i * padding
      _y = 0
      points[i] = [_x, _y]
    }

    // other row
    if (i >= x) {
      let _x, _y
      let row = Math.ceil((i + 1) / x)
      let col = i % x

      // 偶数行
      if (row % 2 === 0) {
        // 默认距离 + x width and padding
        _x = ((width / 2) + (44 / 2)) + (width * col) + (padding * col)
      } else {
        _x = col * width + col * padding
      }
      // 默认距离 x 倍
      _y = (height - (edge / 10)) * (row - 1)
      points[i] = [_x, _y]
    }
  }

  console.log('points', points)
  return points
}

/**
 * 范围随机数
 */
export const randomRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min)

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
  y: -x - y,
  z: y,
})

/**
 * 计算偏移位置
 * @param layout
 * @param param1
 * @returns
 */
export const calcTranslate = (layout: any, { x, y }: CoordinateState) => {
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
 * 计算偏移数据
 * @param param0
 * @returns
 */
export const calcTranslateValue = ({ x, y, width, height, scale }: calcTranslateValueState) => {
  let _x = x
  let _y = y

  _x = (x * scale) - ((width / 2) * (scale - 1))
  _y = (y * scale) - ((height / 2) * (scale - 1))

  return {
    x: _x,
    y: _y
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
    const ele = node[i]
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
    const ele = hexGrids[i]
    let distanceResult = center.subtract({ q: ele.q, r: ele.r, s: ele.s }).len() <= distance
    if (distanceResult) {
      points.push(ele)
    }
  }
  return points
}

/**
 * 计算范围内坐标点
 * 公用方法为了减少一层循坏 直接传data set value
 * @param center 
 * @param hexGrids 
 * @param distance 
 * @param data 
 * @returns Map<string, HexagonsState>
 */
export const calcCenterRangeAsMap = (center: Hex, hexGrids: HexagonsState[], distance: number, data?: Map<string, HexagonsState>) => {
  let points: Map<string, HexagonsState> = new Map()
  for (let i = 0; i < hexGrids.length; i++) {
    const ele = hexGrids[i]
    let distanceResult = center.subtract({ q: ele.q, r: ele.r, s: ele.s }).len() <= distance
    if (distanceResult) {
      const { q: x, s: y, r: z } = ele

      // qsr xyz
      if (data) {
        data.set(keyFormat({ x, y, z }), ele)
      } else {
        points.set(keyFormat({ x, y, z }), ele)
      }
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
  return 360 * Math.atan2(diff_y, diff_x) / (2 * Math.PI)
}

/**
 * https://github.com/alibaba/hooks/blob/master/packages/hooks/src/useInViewport/index.ts
 * 计算 DOM 是否在屏幕内
 * @param el
 * @returns
 */
export function isInViewPort(el: HTMLElement): boolean | undefined {
  if (!el) {
    return undefined
  }

  const viewPortWidth =
    window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
  const viewPortHeight =
    window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
  const rect = el.getBoundingClientRect()

  if (rect) {
    const { top, bottom, left, right } = rect
    return bottom > 0 && top <= viewPortHeight && left <= viewPortWidth && right > 0
  }

  return false
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

/**
 * 处理节点样式
 * @param param0
 */
export const HandleHexagonStyle = ({ x, y, z }: PointState, nodeActive: boolean) => {
  // 只需要处理已有的块
  const hexagonListExist: NodeListOf<HTMLElement> = document.querySelectorAll<HTMLElement>('.hexagon-exist')
  const hexagonListActive: NodeListOf<HTMLElement> = document.querySelectorAll<HTMLElement>('.hexagon-active')
  const hexagonListV: NodeListOf<HTMLElement> = document.querySelectorAll<HTMLElement>('.hexagon-v')

  const list = [...hexagonListExist, ...hexagonListActive, ...hexagonListV]
  list.map(i => {
    if (i.classList.contains('active')) {
      i.classList.remove('active')
    }
  })

  const hexagon = document.querySelector<HTMLElement>(`.hexagon-x${x}_y${y}_z${z}`)
  // console.log('hexagon', hexagon)
  if (hexagon && nodeActive) {
    hexagon.classList.add('active')
  }
}

/**
 * 字符省略
 * @param value
 * @param length
 * @returns
 */
export const strEllipsis = (value: string, length: number = 12) => {
  let val = trim(value)
  if (!val) {
    return ''
  }
  return val.length > length ? val.slice(0, length) + '...' : val
}

/**
 * 数字截取
 * @param amount
 * @param decimal
 * @returns
 */
export const amountSplit = (amount: string, decimal: number) => {
  let point = amount.indexOf('.')
  if (~point) {
    return amount.slice(0, point + 1 + decimal)
  }
  return amount
}

/**
 * 返回统一 Key 格式
 * @param point
 * @returns
 */
export const keyFormat = (point: PointState) => `x${point.x}_y${point.y}_z${point.z}`

/**
 * 解析 Key 为对象
 * @param val 
 * @returns 
 */
export const keyFormatParse = (val: string) => {
  try {
    const point = val.split('_')

    const x = Number(point[0].slice(1))
    const y = Number(point[1].slice(1))
    const z = Number(point[2].slice(1))

    if ((x + y + z) !== 0) {
      return
    }

    return { x, y, z }
  } catch (e) {
    console.log(e)
    return
  }
}


/**
 * calc Forbidden Zone Radius
 * 计算半径为 x 不可选区域
 * @param hex 
 * @param forbiddenZoneRadius 
 * @returns 
 */
export const calcForbiddenZoneRadius = ({
  hex,
  forbiddenZoneRadius
}: {
  hex: HexagonsState[], forbiddenZoneRadius: number
}) => {
  const center = new Hex(0, 0, 0)
  return calcCenterRangeAsMap(center, hex, forbiddenZoneRadius)
}


/**
 * calc AllNode Choose Zone Radius
 * @param param0 
 * @returns 
 */
export const calcAllNodeChooseZoneRadius = ({
  hex, allNode, distance = 1
}: {
  hex: HexagonsState[], allNode: hexGridsByFilterState[], distance: number
}) => {
  let points: Map<string, HexagonsState> = new Map()

  for (let i = 0; i < allNode.length; i++) {
    const eleAllNode = allNode[i]
    // 捕获 new hex 错误
    try {
      let center = new Hex(eleAllNode.x, eleAllNode.z, eleAllNode.y)
      calcCenterRangeAsMap(center, hex, distance, points)
    } catch (e) {
      console.error('e', e)
      continue
    }
  }

  return points
}

export const calcZoneRadius = ({
  centerPoint,
  hex,
  zoneRadius
}: {
  centerPoint: HexagonsState,
  hex: HexagonsState[],
  zoneRadius: number
}) => {
  const { q, r, s } = centerPoint
  const center = new Hex(q, r, s)
  return calcCenterRangeAsMap(center, hex, zoneRadius)
}

// x y z
// q s r


/**
 * toggle layout hide node
 * @returns 
 */
export const toggleLayoutHide = (percentage: number) => {
  const layoutWrapper = document.querySelector('.layout-wrapper')
  if (!layoutWrapper) {
    return
  }

  if (percentage < 20) {
    if (!layoutWrapper.classList.contains('hide-node')) {
      layoutWrapper.classList.add('hide-node')
    }
  } else {
    if (layoutWrapper.classList.contains('hide-node')) {
      layoutWrapper.classList.remove('hide-node')
    }
  }
}
