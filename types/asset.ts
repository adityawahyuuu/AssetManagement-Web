export interface Asset {
  id: string
  name: string
  description?: string
  quantity: number
  roomId: string
  categoryId?: string
  status: "available" | "in-use" | "damaged" | "lost"
  condition?: "excellent" | "good" | "fair" | "poor"
  serialNumber?: string
  purchaseDate?: Date
  createdAt: Date
  updatedAt: Date
}
