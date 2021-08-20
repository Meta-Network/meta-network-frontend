import {
  hexGridsForbiddenZoneRadius, hexGridsCountByFilter
} from '../services/metaNetwork'
import { invitationsMine } from '../services/ucenter'
import { PointScopeState } from '../typings/metaNetwork'
import { InviitationsMineState } from '../typings/ucenter.d'

/**
 * pages index
 */

/**
 * 获取禁用区域半径
 * @param radius
 * @returns
 */
export const fetchForbiddenZoneRadius = async (radius: number) => {
  let _radius = radius
  try {
    const res = await hexGridsForbiddenZoneRadius()
    if (res.statusCode === 200 && res.data > 0) {
      _radius = res.data
    }
  } catch (e) {
    console.log(e)
  }
  return _radius
}

/**
 * 获取邀请码
 * @returns
 */
export const fetchInviteCode = async () => {
  let result: InviitationsMineState[] = []
  try {
    const res = await invitationsMine()
    if (res.statusCode === 200) {
      result = res.data
    }
  } catch (e) {
    console.log(e)
  }
  return result
}

/**
 * 获取统计所有坐标点
 * @param defaultHexGridsRange
 * @returns
 */
export const fetchHexGridsCountByFilter = async (range: PointScopeState) => {
  let count = 0
  try {
    const res = await hexGridsCountByFilter(range)
    if (res.statusCode === 200 && res.data) {
      count = res.data
    }
  } catch (e) {
    console.log(e)
  }
  return count
}