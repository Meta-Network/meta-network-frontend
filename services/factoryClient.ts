import axios, { AxiosAdapter } from 'axios';
import {
  cacheAdapterEnhancer,
  throttleAdapterEnhancer,
} from 'axios-extensions';

interface Props {
  baseURL: string
}

const options = {
  enabledByDefault: false,
};

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
  });

  client.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  client.interceptors.response.use(
    (response) => {
      return response.data;
    },
    (error) => {
      console.log(error.message);

      if (error.message.includes("status code 401")) {
        console.log("登录状态异常,请重新登录");
      }
      // 超时处理
      if (error.message.includes("timeout")) {
        console.log("请求超时");
      }
      if (error.message.includes("Network Error")) {
        console.log("Network Error");
      }
      return Promise.reject(error);
    }
  );

  return client
}


export default factoryClient