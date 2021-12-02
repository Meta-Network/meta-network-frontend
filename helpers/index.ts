import {
	hexGridsForbiddenZoneRadius, hexGridsCountByFilter, hexGridsMine,
	hexGridsByFilter,
	hexGridsLoctionByUserId
} from '../services/metaNetwork'
import { invitationsMine, storageToken } from '../services/ucenter'
import { HexGridsLoctionByUserIdState, PointScopeState } from '../typings/metaNetwork'
import { InvitationsMineState } from '../typings/ucenter.d'
import { amountSplit } from '../utils/index'
import { OAuthWhiteList } from '../common/config/index'

/**
 * pages index
 */

/**
 * 获取禁用区域半径
 * @param radius
 * @returns
 */
export const fetchForbiddenZoneRadiusAPI = async (radius: number) => {
	let _radius = radius
	try {
		const res = await hexGridsForbiddenZoneRadius()
		if (res.statusCode === 200 && res.data > 0) {
			_radius = res.data
		}
	} catch (e) {
		console.error(e)
	}
	return _radius
}

/**
 * 获取邀请码
 * @returns
 */
export const fetchInviteCodeAPI = async () => {
	let result: InvitationsMineState[] = []
	try {
		const res = await invitationsMine()
		if (res.statusCode === 200) {
			result = res.data
		}
	} catch (e) {
		console.error(e)
	}
	return result
}

/**
 * 获取统计所有坐标点
 * @param defaultHexGridsRange
 * @returns
 */
export const fetchHexGridsCountByFilterAPI = async (range: PointScopeState) => {
	let count = 0
	try {
		const res = await hexGridsCountByFilter(range)
		if (res.statusCode === 200 && res.data) {
			count = res.data
		}
	} catch (e) {
		console.error(e)
	}
	return count
}

/**
 * 获取自己的坐标点
 */
export const fetchHexGridsMineAPI = async () => {
	try {
		const res = await hexGridsMine()
		if (res.statusCode === 200 && res.data) {
			return res.data
		} else {
			throw new Error('没有占领')
		}
	} catch (e) {
		console.error(e)
		return null
	} finally {
		//
	}
}

/**
 * 获取所有坐标点
 * @param defaultHexGridsRange
 * @returns
 */
export const fetchHexGridsAPI = async (defaultHexGridsRange: PointScopeState) => {
	try {
		const res = await hexGridsByFilter(defaultHexGridsRange)
		if (res.statusCode === 200) {
			return res.data
		} else {
			// console.log('获取失败')
			throw new Error('获取失败')
		}
	} catch (e) {
		console.error('e', e)
		return null
	}
}

/**
 * 获取缩放百分比
 * @returns
 */
export const getZoomPercentage = () => {
	const dom = document.querySelector<HTMLElement>('#container svg g')

	if (dom) {
		const transformScale = dom.getAttribute('transform')
		const transformScaleMatch = transformScale?.match('scale\(.*\)')
		const transformScaleValue = transformScaleMatch?.length ? Number(transformScaleMatch[0].slice(6, -1)) : 1
		// console.log('transformScaleValue', transformScaleValue)

		// 0 - 4 min 0.4 max 4
		const scale = 4 / 100
		let percentage = transformScaleValue / scale

		// console.log('percentage', percentage)
		return Number(amountSplit(String(percentage), 2))
	}

	return 0
}

/**
 * Oauth url 校验
 * @param url
 * @returns
 */
export const OauthUrlVerify = (url: string) => {
	try {
		const { origin } = new URL(url)
		return OAuthWhiteList.includes(origin)
	} catch (e) {
		console.error(e)
		return false
	}
}

/**
 * 通过 user id 查询位置 API
 * @param data
 * @returns
 */
export const fetchHexGridsLocationByUserIdAPI = async (data: HexGridsLoctionByUserIdState) => {
	try {
		const res = await hexGridsLoctionByUserId(data)
		if (res.statusCode === 200 && res.data) {
			return res.data
		} else {
			// console.log('获取失败')
			throw new Error(res.message)
		}
	} catch (e) {
		console.error('e', e)
		return null
	}
}

/**
 * 获取 Token
 */
export const fetchTokenAPI = async (): Promise< string | false > => {
	const res = await storageToken()
	if (res.statusCode === 201) {
		return res.data
	} else {
		console.error(res.message)
		return false
	}
}