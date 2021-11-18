// rules
export const rules = {
  usernameReg: '^[a-z0-9-]{3,15}$',
  username: {
    min: 3,
    max: 15
  },
  nickname: {
    min: 1,
    max: 32
  },
  bio: {
    min: 1,
    max: 200
  }
}

// 上传图片大小
export const uploadImageSize = 5

// Oauth 白名单
export const OAuthWhiteList = [
  'https://meta-cms.mttk.net',
  'https://meta-cms.vercel.mttk.net',
]

export const FeedbackLink = 'https://matrix.to/#/!RWJlSDkUlUNMHlXESQ:matrix.org?via=matrix.org'

export const HCaptchaConfig = {
  sitekey: '40ada9cc-0bf6-4553-8159-5594e1a1994c'
}

export const KEY_RENDER_MODE = 'META_NETWORK_RENDER_MODE'
export const KEY_RENDER_MODE_DEFAULT_VALUE = 'simple'