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