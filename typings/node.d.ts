export interface NodeState {
  x: number,
  y: number,
  z: number,
  user: {
    avatar: string,
    username: string,
    nickname: string,
    introduction: string,
    role: 'exist' | 'active' | 'v',
    url: string
  },
  bookmark: boolean
}

export interface PointState {
  x: number,
  y: number,
  z: number,
}