export interface PointScopeState {
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
  zMin: number,
  zMax: number,
  simpleQuery: string
}

export interface hexGridsByFilterState {
  createdAt: string
  updatedAt: string
  id: number
  siteName: string
  x: number
  y: number
  z: number
  subdomain: string
  inviterUserId: number
  metaSpaceSiteId: number
  metaSpaceSiteUrl: string
  metaSpaceSiteProofUrl: string

  userAvatar: string
  userBio: string
  userId: number
  userNickname: string
  username: string
}

export interface HexGridsLoctionByUserIdState {
  userId: number
}
