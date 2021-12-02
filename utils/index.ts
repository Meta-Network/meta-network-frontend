import { trim, xor, zip } from 'lodash'
import { hexGridsByFilterState } from '../typings/metaNetwork.d'
import { AxialState, HexagonsState, PointState } from '../typings/node.d'
import { Hex } from './lib'
import { Hex as HexData } from 'react-hexgrid'
import memoizeOne from 'memoize-one'
import { isEqual } from 'lodash'

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
 * 立方体坐标转轴坐标
 * https://www.redblobgames.com/grids/hexagons/#conversions
 * @param x
 * @param y
 * @returns
 */
export const cubeToAxial = (x: number, y: number, z: number): AxialState => ({
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
export const axialToCube = (x: number, y: number): PointState => ({
	x: x,
	y: -x - y,
	z: y,
})

// x y z
// q s r

/**
 * transform format
 */
export const transformFormat = (point: PointState | HexagonsState ): PointState | HexagonsState => {
	const keys = Object.keys(point)

	if (keys.includes('x')) {
		const { x, y, z } = point as PointState
		return { q: x, s: y, r: z }
	} else if (keys.includes('q')) {
		const { q, s, r } = point as HexagonsState
		return { x: q, y: s, z: r }
	}
	throw new Error('format error')
}

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
		const { x, y, z } = node[i]
		if (Math.abs(x) > max) {
			max = Math.abs(x)
		}
		if (Math.abs(y) > max) {
			max = Math.abs(y)
		}
		if (Math.abs(z) > max) {
			max = Math.abs(z)
		}
	}

	return [max + attach]
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
export const keyFormat = (point: PointState): string => `x${point.x}_y${point.y}_z${point.z}`

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
		console.error(e)
		return
	}
}


/**
 * calc Forbidden Zone Radius
 * 计算半径为 x 不可选区域
 * @param forbiddenZoneRadius 
 * @returns 
 */
export const calcForbiddenZoneRadius = ({ forbiddenZoneRadius }: { forbiddenZoneRadius: number }) => {
	const center = new HexData(0, 0, 0)

	let points: Map<string, HexagonsState> = new Map()

	const hexagons = Hexagon(center, forbiddenZoneRadius)
	hexagons.forEach(i => {
		const { q, r, s } = i
		const key: string = compose(keyFormat, transformFormat)({q, r, s})
		points.set(key, i)
	})

	return points
}


/**
 * calc AllNode Choose Zone Radius
 * @param
 * @returns 
 */
export const calcAllNodeChooseZoneRadius = ({ 
	allNodeMap, 
	forbidden,
	distance = 1}: { 
    allNodeMap: Map<string, hexGridsByFilterState>,
    forbidden: Map<string, HexagonsState>,
    distance?: number }) => {
	let points: Map<string, HexagonsState> = new Map()

	for (const [, value] of allNodeMap.entries()) {
		const { x, y, z } = value
		const { q, r, s } = transformFormat({ x, y, z }) as HexagonsState
		const center: HexagonsState = new HexData(q, r, s)
		const hexagons = Hexagon(center, distance)

		hexagons.forEach(i => {
			const { q, r, s } = i
			const keyChoose: string = compose(keyFormat, transformFormat)({q, r, s})

			// 如果节点已经有数据不 set
			if (!allNodeMap.get(keyChoose) && !forbidden.get(keyChoose)) {
				points.set(keyChoose, i)
			}
		})
	}


	return points
}


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

/**
 * get hexagon box
 * @returns 
 */
export const getHexagonBox = (): {
  width: number,
  height: number,
} => {
	const hexagonDom = document.querySelector<SVGAElement>('.hexagon-group')
	let hexagonWidth = 114.31
	let hexagonHeight = 125.31
	if (hexagonDom) {
		return hexagonDom.getBoundingClientRect()
	}
	return {
		width: hexagonWidth,
		height: hexagonHeight,
	}
}


/**
 * generate hexagon
 */
export const Hexagon = (center: HexagonsState, range: number) => {
	const result: HexagonsState[] = []

	const cube_add = (hex: HexagonsState, vec: HexagonsState) => new HexData(hex.q + vec.q, hex.r + vec.r, hex.s + vec.s)

	for (let q = -range; q <= range; q++) {
		const rMax = Math.max(-range, -q-range)
		const rMin = Math.min(range, -q+range)
		for (let r = rMax; r <= rMin; r++) {
			result.push(cube_add(center, new HexData(q, r, -q-r)))      
		}
	}
	return result
}

export const HexagonMemo = memoizeOne(Hexagon, isEqual)