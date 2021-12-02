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


export const KEY_RENDER_MODE = 'META_NETWORK_RENDER_MODE'
export const KEY_RENDER_MODE_VALUE_FULL = 'full'
export const KEY_RENDER_MODE_VALUE_SIMPLE = 'simple'
export const KEY_IS_LOGIN = 'META_NETWORK_IS_LOGIN'