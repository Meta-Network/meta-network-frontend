export interface PointScopeState {
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
  zMin: number,
  zMax: number
}

export interface hexGridsByFilterState {
  createdAt: string
  updatedAt: string
  id: number
  siteName: string
  x: number
  y: number
  z: number
  userId: number
  username: string
  subdomain: string
  metaSpaceSiteId: number
  metaSpaceSiteUrl: string
  metaSpaceSiteProofUrl: string
}