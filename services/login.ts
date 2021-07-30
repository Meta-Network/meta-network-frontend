import { uCenterAPI } from "./client";
import { axiosResult } from '../typings/request'

/**
 * 验证邮箱是否存在
 * @param data
 * @returns
 */
export const verifyEmail = (data: any): Promise<axiosResult<string>> => uCenterAPI.post('/api/verify', data)
