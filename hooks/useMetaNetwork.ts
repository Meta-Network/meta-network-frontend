import React, { useCallback } from 'react'
import {
  hexGridsByFilter, hexGridsCoordinateValidation, hexGrids,
  hexGridsMine
} from '../services/metaNetwork'

const useMetaNetwork = () => {

  /**
   * 获取自己的坐标点
   */
  const fetchHexGridsMineHook = useCallback(
    async () => {
      try {
        const res = await hexGridsMine()
        if (res.statusCode === 200 && res.data) {
          return res.data
        } else {
          throw new Error('没有占领')
        }
      } catch (e) {
        console.log(e)
        return null
      } finally {
      }
    }, [])

  return {
    fetchHexGridsMineHook
  }
}

export default useMetaNetwork