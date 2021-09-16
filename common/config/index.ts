// rules
export const rules = {
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