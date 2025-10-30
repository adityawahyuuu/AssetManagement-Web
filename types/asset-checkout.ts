export interface AssetCheckout {
  id: string
  assetId: string
  userId: string
  checkoutDate: Date
  returnDate?: Date
  status: "checked-out" | "returned"
  notes?: string
  createdAt: Date
  updatedAt: Date
}
