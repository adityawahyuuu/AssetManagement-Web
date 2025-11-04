"use client"

import { useEffect, useState } from "react"
import MainLayout from "@/components/layouts/main-layout"
import PageHeader from "@/components/layouts/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { apiClient } from "@/lib/api"
import type { Room, Asset } from "@/types"
import { BarChart3, TrendingUp } from "lucide-react"

export default function ReportsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalRooms: 0,
    totalAssets: 0,
    totalValue: 0,
    totalArea: 0,
    averageAssetValue: 0,
    assetsByCategory: {} as Record<string, number>,
  })

  useEffect(() => {
    fetchReportData()
  }, [])

  const fetchReportData = async () => {
    setIsLoading(true)
    try {
      let rooms: Room[] = []
      let assets: Asset[] = []

      try {
        const roomsResponse = await apiClient.get<{ data: Room[] }>("/api/rooms")
        rooms = roomsResponse.data || []
      } catch {
        rooms = []
      }

      try {
        const assetsResponse = await apiClient.get<{ data: Asset[] }>("/api/assets")
        assets = assetsResponse.data || []
      } catch {
        assets = []
      }

      const totalArea = rooms.reduce((sum, room) => sum + (room.lengthM * room.widthM), 0)
      const totalValue = assets.reduce((sum, asset) => sum + (asset.purchasePrice || 0), 0)

      const assetsByCategory: Record<string, number> = {}
      assets.forEach((asset) => {
        const category = asset.category || "Uncategorized"
        assetsByCategory[category] = (assetsByCategory[category] || 0) + 1
      })

      setStats({
        totalRooms: rooms.length,
        totalAssets: assets.length,
        totalValue,
        totalArea,
        averageAssetValue: assets.length > 0 ? totalValue / assets.length : 0,
        assetsByCategory,
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading reports...</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <PageHeader
        title="Reports"
        description="View your asset management reports and analytics"
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Rooms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalRooms}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalAssets}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${stats.totalValue.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Area</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalArea.toFixed(2)}m²</p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Average Asset Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${stats.averageAssetValue.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Per asset across all rooms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Assets by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.assetsByCategory).length === 0 ? (
                <p className="text-sm text-muted-foreground">No assets yet</p>
              ) : (
                Object.entries(stats.assetsByCategory).map(([category, count]) => (
                  <div key={category} className="flex justify-between items-center">
                    <span className="text-sm">{category}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Details Card */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Asset Details Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Average Room Size</p>
              <p className="text-2xl font-bold">
                {stats.totalRooms > 0 ? (stats.totalArea / stats.totalRooms).toFixed(2) : 0}m²
              </p>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Assets per Room</p>
              <p className="text-2xl font-bold">
                {stats.totalRooms > 0 ? (stats.totalAssets / stats.totalRooms).toFixed(1) : 0}
              </p>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Total Inventory Value</p>
              <p className="text-2xl font-bold">${stats.totalValue.toFixed(0)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  )
}
