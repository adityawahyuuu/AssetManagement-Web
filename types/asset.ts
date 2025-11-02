export interface Asset {
  id: number
  roomId: number
  userId: number
  name: string
  category?: string
  photoUrl?: string
  lengthCm: number
  widthCm: number
  heightCm: number
  clearanceFrontCm: number
  clearanceSidesCm: number
  clearanceBackCm: number
  functionZone?: string
  mustBeNearWall: boolean
  mustBeNearWindow: boolean
  mustBeNearOutlet: boolean
  canRotate: boolean
  cannotAdjacentTo?: number[]
  purchaseDate?: string
  purchasePrice?: number
  condition?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface AddAssetDto {
  roomId: number
  name: string
  category?: string
  photoUrl?: string
  lengthCm: number
  widthCm: number
  heightCm: number
  clearanceFrontCm?: number
  clearanceSidesCm?: number
  clearanceBackCm?: number
  functionZone?: string
  mustBeNearWall?: boolean
  mustBeNearWindow?: boolean
  mustBeNearOutlet?: boolean
  canRotate?: boolean
  cannotAdjacentTo?: number[]
  purchaseDate?: string
  purchasePrice?: number
  condition?: string
  notes?: string
}

export interface UpdateAssetDto {
  name?: string
  category?: string
  photoUrl?: string
  lengthCm?: number
  widthCm?: number
  heightCm?: number
  clearanceFrontCm?: number
  clearanceSidesCm?: number
  clearanceBackCm?: number
  functionZone?: string
  mustBeNearWall?: boolean
  mustBeNearWindow?: boolean
  mustBeNearOutlet?: boolean
  canRotate?: boolean
  cannotAdjacentTo?: number[]
  purchaseDate?: string
  purchasePrice?: number
  condition?: string
  notes?: string
}

export interface AssetWithCalculations extends Asset {
  totalFootprintCm2?: number
  volumeCm3?: number
  totalAreaNeededCm2?: number
}
