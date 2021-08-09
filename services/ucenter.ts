import { uCenterAPI } from "./client";
import { axiosResult } from '../typings/request'
import {
  AccountsEmailSignupResult, AccountsEmailAuth, UsersMeProps
} from '../typings/ucenter'

// ---------------- Accounts ----------------
/**
 * 验证邮箱是否存在
 * @param data
 * @returns
 */
export const verifyEmail = (data: any): Promise<axiosResult<string>> => uCenterAPI.post('/api/verify', data)

/**
 * 验证邮箱是否存在
 * @param data
 * @returns
 */
export const accountsEmailVerify = (data: { email: string }): Promise<axiosResult<{ isExists: boolean }>> =>
  uCenterAPI.post('accounts/email/is-exists', data)

/**
 * 发送邮箱验证码
 * @param data
 * @returns
 */
export const accountsEmailVerificationCode = (data: { key: string }): Promise<axiosResult<{ key: string }>> =>
  uCenterAPI.post('/accounts/email/verification-code', data)

/**
 * 注册
 * @param signature 邀请码
 * @param data
 * @returns
 */
export const accountsEmailSignup = (
  signature: string,
  data: AccountsEmailAuth): Promise<axiosResult<AccountsEmailSignupResult>> =>
  uCenterAPI.post(`/accounts/email/signup/${signature}`, data)

/**
 * 邀请码
 * @returns
 */
export const invitation = (): Promise<axiosResult<string>> =>
  uCenterAPI.post('/invitation', {
    "sub": "someone@example.com",
    "message": "welcome to meta network",
    "inviter_user_id": 0,
    "matataki_user_id": 0,
    "expired_at": "2021-07-30T11:22:51.991Z"
  })

/**
 * 邮箱登录
 * @param data
 * @returns
 */
export const accountsEmailLogin = (data: AccountsEmailAuth): Promise<axiosResult<{ key: string }>> =>
  uCenterAPI.post('/accounts/email/login', data)

/**
 * Refresh token
 * @returns
 */
export const accountsTokenPatch = (): Promise<axiosResult<void>> => uCenterAPI.patch('/accounts/tokens')

/**
 * 退出登录
 * @returns
 */
export const accountsTokenDelete = (): Promise<axiosResult<void>> => uCenterAPI.delete('/accounts/tokens')

// ---------------- Users ----------------

/**
 * 当前用户信息
 * @returns
 */
export const usersMe = (): Promise<axiosResult<UsersMeProps>> => uCenterAPI.get('/users/me', {
  cache: true
})