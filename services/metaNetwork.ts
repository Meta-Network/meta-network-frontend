import { API } from "./client";
import { axiosResult } from '../typings/request'
import { PointScopeState, hexGridsByFilterState } from "../typings/metaNetwork.d";
import { PointState } from '../typings/node.d'

// ---------------- META NETWORK ----------------
/**
 * 查询已被占领的地块
 * @param data
 * @returns
 */
export const hexGridsByFilter = (data: PointScopeState): Promise<axiosResult<hexGridsByFilterState[]>> =>
  API.post('/hex-grids/by-filter', data)

/**
 * 校验坐标点是否可用
 * @param data
 * @returns
 */
export const hexGridsCoordinateValidation = (data: PointState): Promise<axiosResult<boolean>> =>
  API.put('/hex-grids/coordinate/validation', data)

/**
 * 占领坐标
 * @param data
 * @returns
 */
export const hexGrids = (data: PointState): Promise<axiosResult<hexGridsByFilterState>> =>
  API.post('/hex-grids', data)

/**
 * 当前用户占领的地块
 * @returns
 */
export const hexGridsMine = (): Promise<axiosResult<hexGridsByFilterState>> =>
  API.get('/hex-grids/mine')

/**
 * 不可用区域半径
 * @returns
 */
export const hexGridsForbiddenZoneRadius = (): Promise<axiosResult<number>> =>
  API.get('/hex-grids/forbidden-zone/radius')
