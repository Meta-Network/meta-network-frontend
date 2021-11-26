import { HexagonsState } from '../typings/node.d'
import { hexGridsByFilterState } from '../typings/metaNetwork.d'

/**
 * 
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
 * 
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