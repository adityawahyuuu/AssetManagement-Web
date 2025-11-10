"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import MainLayout from "@/components/layouts/main-layout"
import PageHeader from "@/components/layouts/page-header"
import StatsCard from "@/components/dashboard/stats-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, DoorOpen, Plus, Maximize2 } from "lucide-react"
import Link from "next/link"
import { apiClient } from "@/lib/api"
import type { Room, Asset } from "@/types"

export default function DashboardPage() {
  const router = useRouter()
  const [rooms, setRooms] = useState<Room[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalRooms: 0,
    totalAssets: 0,
    totalValue: 0,
    totalArea: 0,
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      // Fetch user's rooms
      let userRooms: Room[] = []
      try {
        const roomsResponse = await apiClient.get<{ data: Room[] }>("/api/rooms")
        userRooms = roomsResponse.data || []
      } catch {
        userRooms = []
      }
      setRooms(userRooms)

      // Calculate stats
      const totalArea = userRooms.reduce((sum, room) => sum + (room.lengthM * room.widthM), 0)

      // Fetch all assets to calculate totals
      let allAssets: Asset[] = []
      try {
        const assetsResponse = await apiClient.get<{ data: Asset[] }>("/api/assets")
        allAssets = assetsResponse.data || []
      } catch {
        allAssets = []
      }
      const totalValue = allAssets.reduce((sum, asset) => sum + (asset.purchasePrice || 0), 0)

      setStats({
        totalRooms: userRooms.length,
        totalAssets: allAssets.length,
        totalValue,
        totalArea,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <MainLayout>
      <PageHeader
        title="Dashboard"
        description="Manage your rooms and assets"
        action={
          <Button onClick={() => router.push("/rooms/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Room
          </Button>
        }
      />

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
        <StatsCard
          title="Total Rooms"
          value={stats.totalRooms.toString()}
          description="Your managed spaces"
          icon={<DoorOpen className="h-4 w-4" />}
        />
        <StatsCard
          title="Total Assets"
          value={stats.totalAssets.toString()}
          description="Across all rooms"
          icon={<Package className="h-4 w-4" />}
        />
        <StatsCard
          title="Total Value"
          value={`$${stats.totalValue.toFixed(2)}`}
          description="Asset worth"
          icon={<Package className="h-4 w-4" />}
        />
        <StatsCard
          title="Total Area"
          value={`${stats.totalArea.toFixed(1)} m²`}
          description="Combined room space"
          icon={<Maximize2 className="h-4 w-4" />}
        />
      </div>

      {/* Rooms Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Your Rooms</h2>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading rooms...</p>
          </div>
        ) : rooms.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <DoorOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Rooms Yet</h3>
              <p className="text-muted-foreground mb-4 text-center">
                Get started by adding your first room
              </p>
              <Button onClick={() => router.push("/rooms/new")}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Room
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <Card
                key={room.id}
                className="cursor-pointer transition-all hover:shadow-lg hover:border-primary"
                onClick={() => router.push(`/rooms/${room.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <DoorOpen className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{room.name}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dimensions:</span>
                      <span className="font-medium">{room.lengthM}m × {room.widthM}m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Area:</span>
                      <span className="font-medium">{(room.lengthM * room.widthM).toFixed(2)} m²</span>
                    </div>
                    {room.doorPosition && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Door:</span>
                        <span className="font-medium capitalize">{room.doorPosition}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}
