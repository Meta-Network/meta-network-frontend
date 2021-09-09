import axios, { AxiosAdapter } from 'axios'
import {
  cacheAdapterEnhancer,
  throttleAdapterEnhancer,
} from 'axios-extensions'

interface Props {
  baseURL: string
}

const options = {
  enabledByDefault: false,
}

/**
 * API Factory
 * @param param0
 * @returns
 */
const factoryClient = ({ baseURL }: Props) => {
  const client = axios.create({
    baseURL: baseURL,
    timeout: 1000 * 60,
    headers: { 'Cache-Control': 'no-cache' },
    adapter: throttleAdapterEnhancer(
      cacheAdapterEnhancer(axios.defaults.adapter as AxiosAdapter, options)
    ),
    withCredentials: true,
  })

  client.interceptors.request.use(
    (config) => {
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  client.interceptors.response.use(
    (response) => {
      return response.data
    },
    (error) => {
      // console.log('error', error)

      if (error.message.includes('status code 401')) {
        console.log('登录状态异常,请重新登录')
      }
      // 超时处理
      if (error.message.includes('timeout')) {
        console.log('请求超时')
      }
      if (error.message.includes('Network Error')) {
        console.log('Network Error')
      }

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        // console.log(error.response.data)
        // console.log(error.response.status)
        // console.log(error.response.headers)

        // 返回服务端定义的 message
        const message = error.response.data?.message
        if (message) {
          return Promise.reject(new Error(message))
        }
        return Promise.reject(error)
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        // console.log(error.request)
        return Promise.reject(error)
      } else {
        // Something happened in setting up the request that triggered an Error
        // console.log('Error', error.message);
        return Promise.reject(error)
      }
      // console.log(error.config)
    }
  )

  return client
}


export default factoryClient