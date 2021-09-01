export interface NodeState {
  x: number
  y: number
  z: number
  user: {
    avatar: string
    username: string
    nickname: string
    introduction: string
    role: 'exist' | 'active' | 'v'
    url: string
  }
  bookmark: boolean
}

export interface PointState {
  x: number
  y: number
  z: number
}

export interface AxialState {
  x: number
  y: number
}
export interface HexagonsState {
  q: number
  r: number
  s: number
}

export interface SearchHistory {
  value: string
  lastTime: number
}

export interface LayoutState {
  width: number
  height: number
  flat: boolean
  spacing: number
}