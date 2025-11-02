"use client"

import { useState, useEffect } from "react"
import { assetSchema } from "@/lib/schemas"
import { apiClient } from "@/lib/api"
import type { AddAssetDto, Room } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AssetFormProps {
  roomId: number
  room?: Room
  onSuccess?: () => void
  onCancel?: () => void
}

export default function AssetForm({ roomId, room, onSuccess, onCancel }: AssetFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [roomAreaCm2, setRoomAreaCm2] = useState(0)
  const [usedAreaCm2, setUsedAreaCm2] = useState(0)

  const [formData, setFormData] = useState<AddAssetDto>({
    roomId,
    name: "",
    category: "",
    lengthCm: 0,
    widthCm: 0,
    heightCm: 0,
    clearanceFrontCm: 0,
    clearanceSidesCm: 0,
    clearanceBackCm: 0,
    mustBeNearWall: false,
    mustBeNearWindow: false,
    mustBeNearOutlet: false,
    canRotate: true,
    purchasePrice: undefined,
    condition: "",
    notes: "",
  })

  useEffect(() => {
    // Calculate room area if room data is available
    if (room) {
      const areaM2 = room.lengthM * room.widthM
      setRoomAreaCm2(areaM2 * 10000) // Convert to cm²

      // Fetch existing assets to calculate used area
      fetchUsedArea()
    }
  }, [room])

  const fetchUsedArea = async () => {
    try {
      const response = await apiClient.get<{ data: any[] }>(`/api/assets?roomId=${roomId}`)
      const assets = response.data || []

      const totalUsed = assets.reduce((sum, asset) => {
        const assetArea = (asset.lengthCm + 2 * asset.clearanceSidesCm) *
                         (asset.widthCm + asset.clearanceFrontCm + asset.clearanceBackCm)
        return sum + assetArea
      }, 0)

      setUsedAreaCm2(totalUsed)
    } catch (error) {
      console.error("Failed to fetch assets:", error)
    }
  }

  const calculateAssetArea = () => {
    const length = formData.lengthCm + 2 * (formData.clearanceSidesCm || 0)
    const width = formData.widthCm + (formData.clearanceFrontCm || 0) + (formData.clearanceBackCm || 0)
    return length * width
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    try {
      // Validate asset size against room size
      const assetArea = calculateAssetArea()
      const totalAreaAfter = usedAreaCm2 + assetArea

      if (totalAreaAfter > roomAreaCm2) {
        setErrors({
          general: `Asset is too large! Room has ${(roomAreaCm2/10000).toFixed(2)}m² total, ` +
                  `${(usedAreaCm2/10000).toFixed(2)}m² already used, ` +
                  `this asset needs ${(assetArea/10000).toFixed(2)}m²`
        })
        setIsSubmitting(false)
        return
      }

      // Validate form data
      const validatedData = assetSchema.parse(formData)

      // Submit to API
      await apiClient.post("/api/assets", validatedData)

      // Success
      if (onSuccess) {
        onSuccess()
      }
    } catch (error: any) {
      if (error.errors) {
        const fieldErrors: Record<string, string> = {}
        error.errors.forEach((err: any) => {
          if (err.path) {
            fieldErrors[err.path[0]] = err.message
          }
        })
        setErrors(fieldErrors)
      } else {
        setErrors({ general: error.message || "Failed to create asset" })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const assetArea = calculateAssetArea()
  const remainingArea = roomAreaCm2 - usedAreaCm2
  const percentageUsed = roomAreaCm2 > 0 ? ((usedAreaCm2 + assetArea) / roomAreaCm2 * 100).toFixed(1) : 0

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.general && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-800">
          {errors.general}
        </div>
      )}

      {room && (
        <div className="p-4 bg-blue-50 rounded-md space-y-2 text-sm">
          <p><strong>Room:</strong> {room.name} ({room.lengthM}m × {room.widthM}m = {(roomAreaCm2/10000).toFixed(2)}m²)</p>
          <p><strong>Used Space:</strong> {(usedAreaCm2/10000).toFixed(2)}m² ({((usedAreaCm2/roomAreaCm2)*100).toFixed(1)}%)</p>
          <p><strong>Available Space:</strong> {(remainingArea/10000).toFixed(2)}m²</p>
          {assetArea > 0 && (
            <p className={assetArea > remainingArea ? "text-red-600 font-bold" : "text-green-600"}>
              <strong>This asset will use:</strong> {(assetArea/10000).toFixed(2)}m² ({percentageUsed}% total)
            </p>
          )}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Asset Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Asset Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Sofa, Desk, Bed"
              required
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-1">
                Category
              </label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g., Furniture, Electronics"
              />
            </div>

            <div>
              <label htmlFor="condition" className="block text-sm font-medium mb-1">
                Condition
              </label>
              <select
                id="condition"
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">Select condition</option>
                <option value="new">New</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dimensions (cm)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="lengthCm" className="block text-sm font-medium mb-1">
                Length <span className="text-red-500">*</span>
              </label>
              <Input
                id="lengthCm"
                name="lengthCm"
                type="number"
                value={formData.lengthCm || ""}
                onChange={handleChange}
                placeholder="e.g., 200"
                required
              />
              {errors.lengthCm && <p className="mt-1 text-sm text-red-600">{errors.lengthCm}</p>}
            </div>

            <div>
              <label htmlFor="widthCm" className="block text-sm font-medium mb-1">
                Width <span className="text-red-500">*</span>
              </label>
              <Input
                id="widthCm"
                name="widthCm"
                type="number"
                value={formData.widthCm || ""}
                onChange={handleChange}
                placeholder="e.g., 90"
                required
              />
              {errors.widthCm && <p className="mt-1 text-sm text-red-600">{errors.widthCm}</p>}
            </div>

            <div>
              <label htmlFor="heightCm" className="block text-sm font-medium mb-1">
                Height <span className="text-red-500">*</span>
              </label>
              <Input
                id="heightCm"
                name="heightCm"
                type="number"
                value={formData.heightCm || ""}
                onChange={handleChange}
                placeholder="e.g., 80"
                required
              />
              {errors.heightCm && <p className="mt-1 text-sm text-red-600">{errors.heightCm}</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="clearanceFrontCm" className="block text-sm font-medium mb-1">
                Clearance Front
              </label>
              <Input
                id="clearanceFrontCm"
                name="clearanceFrontCm"
                type="number"
                value={formData.clearanceFrontCm || ""}
                onChange={handleChange}
                placeholder="0"
              />
            </div>

            <div>
              <label htmlFor="clearanceSidesCm" className="block text-sm font-medium mb-1">
                Clearance Sides
              </label>
              <Input
                id="clearanceSidesCm"
                name="clearanceSidesCm"
                type="number"
                value={formData.clearanceSidesCm || ""}
                onChange={handleChange}
                placeholder="0"
              />
            </div>

            <div>
              <label htmlFor="clearanceBackCm" className="block text-sm font-medium mb-1">
                Clearance Back
              </label>
              <Input
                id="clearanceBackCm"
                name="clearanceBackCm"
                type="number"
                value={formData.clearanceBackCm || ""}
                onChange={handleChange}
                placeholder="0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Placement Requirements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="mustBeNearWall"
              checked={formData.mustBeNearWall}
              onChange={handleChange}
              className="rounded"
            />
            <span className="text-sm">Must be near wall</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="mustBeNearWindow"
              checked={formData.mustBeNearWindow}
              onChange={handleChange}
              className="rounded"
            />
            <span className="text-sm">Must be near window</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="mustBeNearOutlet"
              checked={formData.mustBeNearOutlet}
              onChange={handleChange}
              className="rounded"
            />
            <span className="text-sm">Must be near power outlet</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="canRotate"
              checked={formData.canRotate}
              onChange={handleChange}
              className="rounded"
            />
            <span className="text-sm">Can rotate</span>
          </label>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="purchasePrice" className="block text-sm font-medium mb-1">
            Purchase Price
          </label>
          <Input
            id="purchasePrice"
            name="purchasePrice"
            type="number"
            value={formData.purchasePrice || ""}
            onChange={handleChange}
            placeholder="0.00"
          />
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium mb-1">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          placeholder="Any additional information..."
        />
      </div>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Asset"}
        </Button>
      </div>
    </form>
  )
}
