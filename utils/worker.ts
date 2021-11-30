
import { hexGridsByFilterState } from '../typings/metaNetwork.d'
import { HexagonsState, PointState, rectangleState } from '../typings/node.d'

/**
 * Hexagon worker
 * @param center 
 * @param range 
 * @returns 
 */
export const HexagonWorker = (center: HexagonsState, range: number) => {
  const result: HexagonsState[] = []
  const cube_add = (hex: HexagonsState, vec: HexagonsState) => ({
    q: hex.q + vec.q,
    r: hex.r + vec.r,
    s: hex.s + vec.s,
  })

  for (let q = -range; q <= range; q++) {
    const rMax = Math.max(-range, -q-range)
    const rMin = Math.min(range, -q+range)
    for (let r = rMax; r <= rMin; r++) {
      result.push(cube_add(center, { q:q, r: r, s: -q-r }))    
    }
  }

  return result
}

/**
 * Hexagon Rectangle Worker
 * @param center 
 * @param w 
 * @param h 
 * @returns 
 */
export const HexagonRectangleWorker = (center: HexagonsState, w: number, h: number) => {

  const oddr_to_cube = (hex: rectangleState) => {
    let q = hex.col - (hex.row - (hex.row & 1)) / 2
    let r = hex.row
    return { q, r, s: -q - r }
  }

  const axial_to_oddr = (hex: HexagonsState) => {
    var col = hex.q + (hex.r - (hex.r & 1)) / 2
    var row = hex.r
    return { col, row }
  }
  
  const { col, row } = axial_to_oddr(center)
  const q1 = col - w
  const q2 = col + w
  const r1 = row - h
  const r2 = row + h

  let hexas: HexagonsState[] = []
  for (let col = q1; col <= q2; col++) {
    for (let row = r1; row <= r2; row++) {
      hexas.push(oddr_to_cube({ col, row }))
    }
  }

  return hexas
}


/**
 * calc Farthest Distance Worker
 * @param allNode 
 * @returns 
 */
export const calcFarthestDistanceWorker = (allNode: Map<string, hexGridsByFilterState>): number => {
  let max = 0

  for (const value of allNode.values()) {
    const { x, y, z } = value
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

  return max
}

/**
 * AllNode Transfer To Map Worker
 * @param all 
 * @returns 
 */
export const AllNodeTransferToMapWorker = (all: hexGridsByFilterState[]): Map<string, hexGridsByFilterState> => {
  const keyFormat = (point: PointState): string => `x${point.x}_y${point.y}_z${point.z}`

  let dataMap: Map<string, hexGridsByFilterState> = new Map()
  all.forEach(i => {
    const { x, y, z } = i
    dataMap.set(keyFormat({ x, y, z }), i)
  })
  return dataMap
}