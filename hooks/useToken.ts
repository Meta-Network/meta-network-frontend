import React, { useEffect, useCallback } from 'react'
import { accountsTokenPatch } from '../services/ucenter'

export const useToken = () => {
	/**
   * 更新 Token
   */
	const accountsTokenPatchFn = useCallback(async() => {
		try {
			await accountsTokenPatch()
		} catch (e) {
			console.error(e)
		}
	}, [])


	useEffect(() => {
		accountsTokenPatchFn()

		// 5m refersh
		let timer = setInterval(accountsTokenPatchFn, 300000) // 5 * 6 * 1000
		return () => clearInterval(timer)
	}, [])

	return {}
}