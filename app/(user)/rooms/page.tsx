"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import MainLayout from "@/components/layouts/main-layout"
import PageHeader from "@/components/layouts/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { apiClient } from "@/lib/api"
import type { Room } from "@/types"
import { Eye, Trash2, Plus } from "lucide-react"

export default function RoomsPage() {
  const router = useRouter()
  const [rooms, setRooms] = useState<Room[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAllRooms()
  }, [])

  const fetchAllRooms = async () => {
    setIsLoading(true)
    try {
      const response = await apiClient.get<{ data: Room[] }>("/api/rooms")
      setRooms(response.data || [])
    } catch {
      setRooms([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (roomId: number) => {
    if (!confirm("Are you sure you want to delete this room? All assets in this room will also be deleted.")) return

    try {
      await apiClient.delete(`/api/rooms/${roomId}`)
      setRooms((prev) => prev.filter((r) => r.id !== roomId))
    } catch {
      alert("Failed to delete room")
    }
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading rooms...</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <PageHeader
        title="All Rooms"
        description="Manage all your rooms"
        action={
          <Button onClick={() => router.push("/dashboard")} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Room
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Rooms List</CardTitle>
        </CardHeader>
        <CardContent>
          {rooms.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-center">
              <div>
                <p className="text-muted-foreground mb-4">No rooms yet</p>
                <Button onClick={() => router.push("/dashboard")}>Add Your First Room</Button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Room Name</TableHead>
                    <TableHead>Dimensions</TableHead>
                    <TableHead>Area (m²)</TableHead>
                    <TableHead>Door</TableHead>
                    <TableHead>Window</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rooms.map((room) => {
                    const area = (room.lengthM * room.widthM).toFixed(2)
                    return (
                      <TableRow key={room.id}>
                        <TableCell className="font-medium">{room.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {room.lengthM}m × {room.widthM}m
                        </TableCell>
                        <TableCell>{area}</TableCell>
                        <TableCell className="text-sm">
                          {room.doorPosition || "-"} {room.doorWidthCm && `(${room.doorWidthCm}cm)`}
                        </TableCell>
                        <TableCell className="text-sm">
                          {room.windowPosition || "-"} {room.windowWidthCm && `(${room.windowWidthCm}cm)`}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/rooms/${room.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(room.id)}
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
