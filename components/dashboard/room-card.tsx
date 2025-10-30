import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DoorOpen } from "lucide-react"
import Link from "next/link"

interface Room {
  id: string
  name: string
  roomNumber: string
  capacity: number
  assetCount?: number
}

interface RoomCardProps {
  room: Room
}

export default function RoomCard({ room }: RoomCardProps) {
  return (
    <Link href={`/rooms/${room.id}`}>
      <Card className="cursor-pointer transition-all hover:shadow-lg hover:border-primary">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <DoorOpen className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">{room.name}</CardTitle>
            </div>
            <Badge variant="outline">Room {room.roomNumber}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Capacity:</span>
              <span className="font-medium">{room.capacity} people</span>
            </div>
            {room.assetCount !== undefined && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Assets:</span>
                <span className="font-medium">{room.assetCount} items</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
