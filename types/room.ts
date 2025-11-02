export interface Room {
  id: number
  userId: number
  name: string
  lengthM: number
  widthM: number
  doorPosition?: string
  doorWidthCm?: number
  windowPosition?: string
  windowWidthCm?: number
  powerOutletPositions?: string[]
  photoUrl?: string
  notes?: string
  createdAt: string
  updatedAt: string
  assets?: Asset[]
}

export interface AddRoomDto {
  name: string
  lengthM: number
  widthM: number
  doorPosition?: string
  doorWidthCm?: number
  windowPosition?: string
  windowWidthCm?: number
  powerOutletPositions?: string[]
  photoUrl?: string
  notes?: string
}

export interface UpdateRoomDto {
  name?: string
  lengthM?: number
  widthM?: number
  doorPosition?: string
  doorWidthCm?: number
  windowPosition?: string
  windowWidthCm?: number
  powerOutletPositions?: string[]
  photoUrl?: string
  notes?: string
}

export interface RoomWithAssets extends Room {
  assets: Asset[]
  totalAssets?: number
  totalValue?: number
  areaM2?: number
}

// Import Asset type
import type { Asset } from "./asset"
