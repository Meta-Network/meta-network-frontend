import { uCenterAPI } from './client'
import { axiosResult } from '../typings/request'
import {
  AccountsEmailSignupResult, AccountsEmailAuth, UsersMeProps,
  InviitationsMineState, UsersMePatchProps, UsersMeUsernameState,
  InvitationsValidateProps, InvitationsValidateState, usersUsernameValidateProps
} from '../typings/ucenter'

// ---------------- Accounts ----------------
/**
 * 验证邮箱是否存在
 * @param data
 * @returns
 */
export const accountsEmailVerify = (data: { account: string }): Promise<axiosResult<{ isExists: boolean }>> =>
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
 * 当前用户邀请码
 * @returns
 */
export const invitationsMine = (): Promise<axiosResult<InviitationsMineState[]>> =>
  uCenterAPI.get('/invitations/mine')

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
export const usersMe = (): Promise<axiosResult<UsersMeProps>> => uCenterAPI.get('/users/me')

/**
 * 更新当前用户信息
 * @returns
 */
export const usersMePatch = (data: UsersMePatchProps): Promise<axiosResult<UsersMeProps>> => uCenterAPI.patch('/users/me', data)

/**
 * 获取一个可用于访问存储的签名
 * @param data
 * @returns
 */
export const storageToken = (): Promise<axiosResult<string>> => uCenterAPI.post('/storage/token')

/**
 * 更新用户的用户名
 * @param data
 * @returns
 */
export const usersMeUsername = (data: UsersMeUsernameState): Promise<axiosResult<string>> => uCenterAPI.put('/users/me/username', data)

/**
 * 验证邀请码的可用性
 * @param data
 * @returns
 */
export const invitationsValidate = (data: InvitationsValidateProps): Promise<axiosResult<InvitationsValidateState>> => uCenterAPI.post('/invitations/validate', data)

/**
 * 验证用户名是否存在
 * @param data 
 * @returns 
 */
export const usersUsernameValidate = (data: UsersMeUsernameState): Promise<axiosResult<usersUsernameValidateProps>> => uCenterAPI.post('/users/username/validate', data)



