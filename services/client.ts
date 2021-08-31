import factoryClient from './factoryClient'

/**
 * META Network API
 */
export const API = factoryClient({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API as string
})

/**
 * ucenter API
 */
export const uCenterAPI = factoryClient({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_UCENTER_API as string
})