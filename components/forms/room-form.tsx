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
    Name: "",
    LengthM: 0,
    WidthM: 0,
    DoorPosition: "",
    DoorWidthCm: undefined,
    WindowPosition: "",
    WindowWidthCm: undefined,
    PowerOutletPositions: [],
    PhotoUrl: "",
    Notes: "",
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
        // Handle API error response (type: "Failed")
        const errorMessage = error.message || error.data?.message || "Failed to create room"
        setErrors({ general: errorMessage })
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
            <label htmlFor="Name" className="block text-sm font-medium mb-1">
              Room Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="Name"
              name="Name"
              value={formData.Name}
              onChange={handleChange}
              placeholder="e.g., Living Room, Bedroom"
              required
            />
            {errors.Name && <p className="mt-1 text-sm text-red-600">{errors.Name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="LengthM" className="block text-sm font-medium mb-1">
                Length (m) <span className="text-red-500">*</span>
              </label>
              <Input
                id="LengthM"
                name="LengthM"
                type="number"
                step="0.1"
                value={formData.LengthM || ""}
                onChange={handleChange}
                placeholder="e.g., 4.5"
                required
              />
              {errors.LengthM && <p className="mt-1 text-sm text-red-600">{errors.LengthM}</p>}
            </div>

            <div>
              <label htmlFor="WidthM" className="block text-sm font-medium mb-1">
                Width (m) <span className="text-red-500">*</span>
              </label>
              <Input
                id="WidthM"
                name="WidthM"
                type="number"
                step="0.1"
                value={formData.WidthM || ""}
                onChange={handleChange}
                placeholder="e.g., 3.5"
                required
              />
              {errors.WidthM && <p className="mt-1 text-sm text-red-600">{errors.WidthM}</p>}
            </div>
          </div>

          <div className="p-3 bg-blue-50 rounded-md text-sm">
            <p className="font-medium">Room Area: {formData.LengthM && formData.WidthM ? (formData.LengthM * formData.WidthM).toFixed(2) : "0.00"} m²</p>
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
              <label htmlFor="DoorPosition" className="block text-sm font-medium mb-1">
                Door Position
              </label>
              <select
                id="DoorPosition"
                name="DoorPosition"
                value={formData.DoorPosition}
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
              <label htmlFor="DoorWidthCm" className="block text-sm font-medium mb-1">
                Door Width (cm)
              </label>
              <Input
                id="DoorWidthCm"
                name="DoorWidthCm"
                type="number"
                value={formData.DoorWidthCm || ""}
                onChange={handleChange}
                placeholder="e.g., 80"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="WindowPosition" className="block text-sm font-medium mb-1">
                Window Position
              </label>
              <select
                id="WindowPosition"
                name="WindowPosition"
                value={formData.WindowPosition}
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
              <label htmlFor="WindowWidthCm" className="block text-sm font-medium mb-1">
                Window Width (cm)
              </label>
              <Input
                id="WindowWidthCm"
                name="WindowWidthCm"
                type="number"
                value={formData.WindowWidthCm || ""}
                onChange={handleChange}
                placeholder="e.g., 120"
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
