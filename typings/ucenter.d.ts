// ---------------- Accounts ----------------

export interface AccountsEmailSignupResult {
  user: {
    id: number,
    username: string,
    nickname: string,
    bio: string,
    avatar: string,
    created_at: string,
    updated_at: string
  },
  account: {
    account_id: string,
    platform: string,
    user_id: number,
    id: number,
    created_at: string,
    updated_at: string
  }
}


export interface AccountsEmailAuth {
  account: string,
  verifyCode: string,
  hcaptchaToken: string
}

// ---------------- Users ----------------

export interface UsersMeProps {
  is2FAEnabled: boolean,
  id: number,
  username: string,
  nickname: string,
  bio: string,
  avatar: string,
  created_at: string,
  updated_at: string,
  twoFactors: []
}

export interface UsersMePatchProps {
  nickname: string
  avatar: string
  bio: string
}

// ---------------- Inviations ----------------

export interface InviitationsMineState {
  id: number
  sub: string
  signature: string
  salt: string
  issuer: string
  message: string
  cause: string
  invitee_user_id: number
  inviter_user_id: number
  matataki_user_id: number
  expired_at: string
  created_at:string
  updated_at: string
}

export interface UsersMeUsernameState {
  username: string
}

export interface InvitationsValidateProps {
  invitation: string
}

export interface InvitationsValidateState {
  available: boolean
  exists: boolean
}

export interface usersUsernameValidateProps {
  isExists: string
}