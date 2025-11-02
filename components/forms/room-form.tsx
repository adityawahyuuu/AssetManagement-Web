"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { roomSchema } from "@/lib/schemas"
import { apiClient } from "@/lib/api"
import type { AddRoomDto } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface RoomFormProps {
  onSuccess?: (roomId: number) => void
  onCancel?: () => void
}

export default function RoomForm({ onSuccess, onCancel }: RoomFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState<AddRoomDto>({
    name: "",
    lengthM: 0,
    widthM: 0,
    doorPosition: "",
    doorWidthCm: undefined,
    windowPosition: "",
    windowWidthCm: undefined,
    powerOutletPositions: [],
    photoUrl: "",
    notes: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    try {
      // Validate form data
      const validatedData = roomSchema.parse(formData)

      // Submit to API
      const response = await apiClient.post<{ data: { id: number } }>("/api/rooms", validatedData)

      // Success - redirect to new room page
      const roomId = response.data.id
      if (onSuccess) {
        onSuccess(roomId)
      } else {
        router.push(`/rooms/${roomId}`)
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
        setErrors({ general: error.message || "Failed to create room" })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.general && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-800">
          {errors.general}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Room Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Living Room, Bedroom"
              required
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="lengthM" className="block text-sm font-medium mb-1">
                Length (m) <span className="text-red-500">*</span>
              </label>
              <Input
                id="lengthM"
                name="lengthM"
                type="number"
                step="0.1"
                value={formData.lengthM || ""}
                onChange={handleChange}
                placeholder="e.g., 4.5"
                required
              />
              {errors.lengthM && <p className="mt-1 text-sm text-red-600">{errors.lengthM}</p>}
            </div>

            <div>
              <label htmlFor="widthM" className="block text-sm font-medium mb-1">
                Width (m) <span className="text-red-500">*</span>
              </label>
              <Input
                id="widthM"
                name="widthM"
                type="number"
                step="0.1"
                value={formData.widthM || ""}
                onChange={handleChange}
                placeholder="e.g., 3.5"
                required
              />
              {errors.widthM && <p className="mt-1 text-sm text-red-600">{errors.widthM}</p>}
            </div>
          </div>

          <div className="p-3 bg-blue-50 rounded-md text-sm">
            <p className="font-medium">Room Area: {formData.lengthM && formData.widthM ? (formData.lengthM * formData.widthM).toFixed(2) : "0.00"} m²</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Room Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="doorPosition" className="block text-sm font-medium mb-1">
                Door Position
              </label>
              <select
                id="doorPosition"
                name="doorPosition"
                value={formData.doorPosition}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">Select position</option>
                <option value="north">North</option>
                <option value="south">South</option>
                <option value="east">East</option>
                <option value="west">West</option>
              </select>
            </div>

            <div>
              <label htmlFor="doorWidthCm" className="block text-sm font-medium mb-1">
                Door Width (cm)
              </label>
              <Input
                id="doorWidthCm"
                name="doorWidthCm"
                type="number"
                value={formData.doorWidthCm || ""}
                onChange={handleChange}
                placeholder="e.g., 80"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="windowPosition" className="block text-sm font-medium mb-1">
                Window Position
              </label>
              <select
                id="windowPosition"
                name="windowPosition"
                value={formData.windowPosition}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">Select position</option>
                <option value="north">North</option>
                <option value="south">South</option>
                <option value="east">East</option>
                <option value="west">West</option>
              </select>
            </div>

            <div>
              <label htmlFor="windowWidthCm" className="block text-sm font-medium mb-1">
                Window Width (cm)
              </label>
              <Input
                id="windowWidthCm"
                name="windowWidthCm"
                type="number"
                value={formData.windowWidthCm || ""}
                onChange={handleChange}
                placeholder="e.g., 120"
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
              placeholder="Any additional information about the room..."
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Room"}
        </Button>
      </div>
    </form>
  )
}
