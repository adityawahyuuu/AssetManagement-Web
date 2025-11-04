"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import MainLayout from "@/components/layouts/main-layout"
import PageHeader from "@/components/layouts/page-header"
import AssetForm from "@/components/forms/asset-form"
import { apiClient } from "@/lib/api"
import type { Room, Asset } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash2, DoorOpen, Maximize2 } from "lucide-react"

export default function RoomDetailPage() {
  const params = useParams()
  const router = useRouter()
  const roomId = parseInt(params.id as string)

  const [room, setRoom] = useState<Room | null>(null)
  const [assets, setAssets] = useState<Asset[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAssetForm, setShowAssetForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("")

  useEffect(() => {
    fetchRoomData()
  }, [roomId])

  const fetchRoomData = async () => {
    setIsLoading(true)
    try {
      // Fetch room details
      const roomResponse = await apiClient.get<{ data: Room }>(`/api/rooms/${roomId}`)
      setRoom(roomResponse.data)

      // Fetch assets for this room
      const assetsResponse = await apiClient.get<{ data: Asset[] }>(`/api/assets/room/${roomId}`)
      setAssets(assetsResponse.data || [])
    } catch (error) {
      console.error("Failed to fetch room data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAssetAdded = () => {
    setShowAssetForm(false)
    fetchRoomData() // Refresh the list
  }

  const handleDeleteAsset = async (assetId: number) => {
    if (!confirm("Are you sure you want to delete this asset?")) return

    try {
      await apiClient.delete(`/api/assets/${assetId}`)
      fetchRoomData() // Refresh the list
    } catch (error) {
      console.error("Failed to delete asset:", error)
      alert("Failed to delete asset")
    }
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading room...</p>
        </div>
      </MainLayout>
    )
  }

  if (!room) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Room not found</p>
        </div>
      </MainLayout>
    )
  }

  // Calculate totals
  const totalAssets = assets.length
  const totalValue = assets.reduce((sum, asset) => sum + (asset.purchasePrice || 0), 0)
  const roomAreaM2 = room.lengthM * room.widthM
  const usedAreaM2 = assets.reduce((sum, asset) => {
    const areaM2 = ((asset.lengthCm + 2 * asset.clearanceSidesCm) *
                    (asset.widthCm + asset.clearanceFrontCm + asset.clearanceBackCm)) / 10000
    return sum + areaM2
  }, 0)

  // Filter assets
  const filteredAssets = assets.filter((asset) => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !filterCategory || asset.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(assets.map((a) => a.category).filter(Boolean)))

  return (
    <MainLayout>
      <PageHeader
        title={room.name}
        description={`Manage assets in ${room.name}`}
        action={
          <Button onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        }
      />

      {/* Room Information Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DoorOpen className="h-5 w-5" />
            Room Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Dimensions</p>
              <p className="text-lg font-semibold">{room.lengthM}m × {room.widthM}m</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Area</p>
              <p className="text-lg font-semibold">{roomAreaM2.toFixed(2)} m²</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Door</p>
              <p className="text-lg font-semibold">
                {room.doorPosition || "N/A"} {room.doorWidthCm && `(${room.doorWidthCm}cm)`}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Window</p>
              <p className="text-lg font-semibold">
                {room.windowPosition || "N/A"} {room.windowWidthCm && `(${room.windowWidthCm}cm)`}
              </p>
            </div>
          </div>
          {room.notes && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">Notes</p>
              <p className="text-sm mt-1">{room.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Room Summary Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Maximize2 className="h-5 w-5" />
            Room Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Assets</p>
              <p className="text-2xl font-bold">{totalAssets}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-2xl font-bold">${totalValue.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Used Space</p>
              <p className="text-2xl font-bold">{usedAreaM2.toFixed(2)} m²</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Space Utilization</p>
              <p className="text-2xl font-bold">{((usedAreaM2 / roomAreaM2) * 100).toFixed(1)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Asset Form */}
      {showAssetForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Asset</CardTitle>
          </CardHeader>
          <CardContent>
            <AssetForm
              roomId={roomId}
              room={room}
              onSuccess={handleAssetAdded}
              onCancel={() => setShowAssetForm(false)}
            />
          </CardContent>
        </Card>
      )}

      {/* Assets List Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Assets in this Room</CardTitle>
            <Button onClick={() => setShowAssetForm(!showAssetForm)}>
              <Plus className="h-4 w-4 mr-2" />
              {showAssetForm ? "Cancel" : "Add Asset"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filter and Search */}
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Assets Table */}
          {filteredAssets.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-center">
              <div>
                <p className="text-muted-foreground mb-2">No assets in this room yet</p>
                <Button onClick={() => setShowAssetForm(true)} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Asset
                </Button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Dimensions (cm)</TableHead>
                    <TableHead>Area (m²)</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssets.map((asset) => {
                    const assetAreaM2 = ((asset.lengthCm + 2 * asset.clearanceSidesCm) *
                                        (asset.widthCm + asset.clearanceFrontCm + asset.clearanceBackCm)) / 10000
                    return (
                      <TableRow key={asset.id}>
                        <TableCell className="font-medium">{asset.name}</TableCell>
                        <TableCell>{asset.category || "-"}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {asset.lengthCm} × {asset.widthCm} × {asset.heightCm}
                        </TableCell>
                        <TableCell>{assetAreaM2.toFixed(2)}</TableCell>
                        <TableCell>${(asset.purchasePrice || 0).toFixed(2)}</TableCell>
                        <TableCell>{asset.condition || "-"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => alert("Edit functionality to be implemented")}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteAsset(asset.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  )
}

// Import Input component
import { Input } from "@/components/ui/input"
