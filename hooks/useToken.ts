import React, { useEffect, useCallback } from 'react';
import { accountsTokenPatch } from '../services/ucenter'

export const useToken = () => {
  /**
   * 更新 Token
   */
  const accountsTokenPatchFn = useCallback(async() => {
    try {
      await accountsTokenPatch()
    } catch (e) {
      console.log(e)
    }
  }, [])


  useEffect(() => {
    accountsTokenPatchFn()
  }, [])

  return {}
}