"use client"

import { useEffect, useState } from "react"
import MainLayout from "@/components/layouts/main-layout"
import PageHeader from "@/components/layouts/page-header"
import StatsCard from "@/components/dashboard/stats-card"
import AssetList from "@/components/dashboard/asset-list"
import RoomCard from "@/components/dashboard/room-card"
import QuickActions from "@/components/dashboard/quick-actions"
import ActivityFeed from "@/components/dashboard/activity-feed"
import { Button } from "@/components/ui/button"
import { Package, DoorOpen, Activity, TrendingUp } from "lucide-react"
import Link from "next/link"

// Mock data - replace with actual API calls
const mockStats = [
  {
    title: "Total Assets",
    value: "1,234",
    description: "Across all rooms",
    icon: <Package className="h-4 w-4" />,
    trend: { value: 12, isPositive: true },
  },
  {
    title: "Active Rooms",
    value: "48",
    description: "In your dorm",
    icon: <DoorOpen className="h-4 w-4" />,
    trend: { value: 5, isPositive: true },
  },
  {
    title: "Checked Out",
    value: "156",
    description: "Currently in use",
    icon: <Activity className="h-4 w-4" />,
    trend: { value: 8, isPositive: false },
  },
  {
    title: "Damaged Items",
    value: "23",
    description: "Needs attention",
    icon: <TrendingUp className="h-4 w-4" />,
    trend: { value: 3, isPositive: false },
  },
]

const mockAssets = [
  {
    id: "1",
    name: "Desk Lamp",
    quantity: 45,
    status: "available",
    roomId: "room-1",
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Office Chair",
    quantity: 32,
    status: "in-use",
    roomId: "room-2",
    updatedAt: new Date(Date.now() - 86400000),
  },
  {
    id: "3",
    name: "Bookshelf",
    quantity: 12,
    status: "available",
    roomId: "room-3",
    updatedAt: new Date(Date.now() - 172800000),
  },
  {
    id: "4",
    name: "Whiteboard",
    quantity: 8,
    status: "damaged",
    roomId: "room-4",
    updatedAt: new Date(Date.now() - 259200000),
  },
  {
    id: "5",
    name: "Desk",
    quantity: 28,
    status: "available",
    roomId: "room-5",
    updatedAt: new Date(Date.now() - 345600000),
  },
]

const mockRooms = [
  {
    id: "room-1",
    name: "Study Room A",
    roomNumber: "101",
    capacity: 4,
    assetCount: 12,
  },
  {
    id: "room-2",
    name: "Study Room B",
    roomNumber: "102",
    capacity: 6,
    assetCount: 18,
  },
  {
    id: "room-3",
    name: "Common Area",
    roomNumber: "103",
    capacity: 20,
    assetCount: 45,
  },
]

const mockActivities = [
  {
    id: "1",
    type: "checkout" as const,
    title: "Desk Lamp",
    description: "Checked out by John Doe",
    timestamp: new Date(),
  },
  {
    id: "2",
    type: "return" as const,
    title: "Office Chair",
    description: "Returned by Jane Smith",
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: "3",
    type: "create" as const,
    title: "New Asset",
    description: "Bookshelf added to inventory",
    timestamp: new Date(Date.now() - 7200000),
  },
  {
    id: "4",
    type: "update" as const,
    title: "Whiteboard",
    description: "Status changed to damaged",
    timestamp: new Date(Date.now() - 10800000),
  },
]

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <MainLayout>
      <PageHeader title="Dashboard" description="Welcome back! Here's an overview of your dorm assets." />

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {mockStats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <QuickActions />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Assets and Activity */}
        <div className="lg:col-span-2 space-y-8">
          <AssetList assets={mockAssets} isLoading={isLoading} />
          <ActivityFeed activities={mockActivities} isLoading={isLoading} />
        </div>

        {/* Right Column - Rooms */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Rooms</h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/rooms">View All</Link>
            </Button>
          </div>
          <div className="space-y-3">
            {mockRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
