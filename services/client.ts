import factoryClient from './factoryClient'

/**
 * META Network API
 */
export const API = factoryClient({
  baseURL: process.env.REACT_APP_BACKEND_UCENTER_API!
})

/**
 * ucenter API
 */
export const uCenterAPI = factoryClient({
  baseURL: process.env.REACT_APP_BACKEND_UCENTER_API!
})
