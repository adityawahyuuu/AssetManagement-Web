"use client"

import { useState, useEffect, useCallback } from "react"
import { assetSchema } from "@/lib/schemas"
import { apiClient, getAssetCategories } from "@/lib/api"
import type { AddAssetDto, Room, AssetCategory } from "@/types"
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
  const [categories, setCategories] = useState<AssetCategory[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  const [formData, setFormData] = useState<AddAssetDto>({
    RoomId: roomId,
    Name: "",
    Category: "",
    LengthCm: 0,
    WidthCm: 0,
    HeightCm: 0,
    ClearanceFrontCm: 0,
    ClearanceSidesCm: 0,
    ClearanceBackCm: 0,
    MustBeNearWall: false,
    MustBeNearWindow: false,
    MustBeNearOutlet: false,
    CanRotate: true,
    PurchasePrice: undefined,
    Condition: "",
    Notes: "",
  })

  const fetchCategories = useCallback(async () => {
    try {
      setLoadingCategories(true)
      const response = await getAssetCategories()
      const categoriesData = Array.isArray(response) ? response : response.data || []
      setCategories(categoriesData)
    } catch (error) {
      console.error("Failed to fetch categories:", error)
      setCategories([])
    } finally {
      setLoadingCategories(false)
    }
  }, [])

  const fetchUsedArea = useCallback(async () => {
    try {
      const response = await apiClient.get<{ data: any[] }>(`/api/assets/room/${roomId}`)
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
  }, [roomId])

  useEffect(() => {
    // Fetch asset categories
    fetchCategories()

    // Calculate room area if room data is available
    if (room) {
      const areaM2 = room.lengthM * room.widthM
      setRoomAreaCm2(areaM2 * 10000) // Convert to cm²

      // Fetch existing assets to calculate used area
      fetchUsedArea()
    }
  }, [room, fetchCategories, fetchUsedArea])

  const calculateAssetArea = () => {
    const length = formData.LengthCm + 2 * (formData.ClearanceSidesCm || 0)
    const width = formData.WidthCm + (formData.ClearanceFrontCm || 0) + (formData.ClearanceBackCm || 0)
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
        // Zod validation errors
        const fieldErrors: Record<string, string> = {}
        error.errors.forEach((err: any) => {
          if (err.path) {
            fieldErrors[err.path[0]] = err.message
          }
        })
        setErrors(fieldErrors)
      } else {
        // Handle API error response (type: "Failed")
        const errorMessage = error.message || error.data?.message || "Failed to create asset"
        setErrors({ general: errorMessage })
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
            <label htmlFor="Name" className="block text-sm font-medium mb-1">
              Asset Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="Name"
              name="Name"
              value={formData.Name}
              onChange={handleChange}
              placeholder="e.g., Sofa, Desk, Bed"
              required
            />
            {errors.Name && <p className="mt-1 text-sm text-red-600">{errors.Name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="Category" className="block text-sm font-medium mb-1">
                Category
              </label>
              <select
                id="Category"
                name="Category"
                value={formData.Category}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                disabled={loadingCategories}
              >
                <option value="">{loadingCategories ? "Loading categories..." : "Select category"}</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="Condition" className="block text-sm font-medium mb-1">
                Condition
              </label>
              <select
                id="Condition"
                name="Condition"
                value={formData.Condition}
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
              <label htmlFor="LengthCm" className="block text-sm font-medium mb-1">
                Length <span className="text-red-500">*</span>
              </label>
              <Input
                id="LengthCm"
                name="LengthCm"
                type="number"
                value={formData.LengthCm || ""}
                onChange={handleChange}
                placeholder="e.g., 200"
                required
              />
              {errors.LengthCm && <p className="mt-1 text-sm text-red-600">{errors.LengthCm}</p>}
            </div>

            <div>
              <label htmlFor="WidthCm" className="block text-sm font-medium mb-1">
                Width <span className="text-red-500">*</span>
              </label>
              <Input
                id="WidthCm"
                name="WidthCm"
                type="number"
                value={formData.WidthCm || ""}
                onChange={handleChange}
                placeholder="e.g., 90"
                required
              />
              {errors.WidthCm && <p className="mt-1 text-sm text-red-600">{errors.WidthCm}</p>}
            </div>

            <div>
              <label htmlFor="HeightCm" className="block text-sm font-medium mb-1">
                Height <span className="text-red-500">*</span>
              </label>
              <Input
                id="HeightCm"
                name="HeightCm"
                type="number"
                value={formData.HeightCm || ""}
                onChange={handleChange}
                placeholder="e.g., 80"
                required
              />
              {errors.HeightCm && <p className="mt-1 text-sm text-red-600">{errors.HeightCm}</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="ClearanceFrontCm" className="block text-sm font-medium mb-1">
                Clearance Front
              </label>
              <Input
                id="ClearanceFrontCm"
                name="ClearanceFrontCm"
                type="number"
                value={formData.ClearanceFrontCm || ""}
                onChange={handleChange}
                placeholder="0"
              />
            </div>

            <div>
              <label htmlFor="ClearanceSidesCm" className="block text-sm font-medium mb-1">
                Clearance Sides
              </label>
              <Input
                id="ClearanceSidesCm"
                name="ClearanceSidesCm"
                type="number"
                value={formData.ClearanceSidesCm || ""}
                onChange={handleChange}
                placeholder="0"
              />
            </div>

            <div>
              <label htmlFor="ClearanceBackCm" className="block text-sm font-medium mb-1">
                Clearance Back
              </label>
              <Input
                id="ClearanceBackCm"
                name="ClearanceBackCm"
                type="number"
                value={formData.ClearanceBackCm || ""}
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
              name="MustBeNearWall"
              checked={formData.MustBeNearWall}
              onChange={handleChange}
              className="rounded"
            />
            <span className="text-sm">Must be near wall</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="MustBeNearWindow"
              checked={formData.MustBeNearWindow}
              onChange={handleChange}
              className="rounded"
            />
            <span className="text-sm">Must be near window</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="MustBeNearOutlet"
              checked={formData.MustBeNearOutlet}
              onChange={handleChange}
              className="rounded"
            />
            <span className="text-sm">Must be near power outlet</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="CanRotate"
              checked={formData.CanRotate}
              onChange={handleChange}
              className="rounded"
            />
            <span className="text-sm">Can rotate</span>
          </label>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="PurchasePrice" className="block text-sm font-medium mb-1">
            Purchase Price
          </label>
          <Input
            id="PurchasePrice"
            name="PurchasePrice"
            type="number"
            value={formData.PurchasePrice || ""}
            onChange={handleChange}
            placeholder="0.00"
          />
        </div>
      </div>

      <div>
        <label htmlFor="Notes" className="block text-sm font-medium mb-1">
          Notes
        </label>
        <textarea
          id="Notes"
          name="Notes"
          value={formData.Notes}
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
