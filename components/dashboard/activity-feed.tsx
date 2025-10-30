import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity } from "lucide-react"
import { formatDateTime } from "@/lib/format"

interface ActivityItem {
  id: string
  type: "checkout" | "return" | "create" | "update" | "delete"
  title: string
  description: string
  timestamp: Date | string
}

interface ActivityFeedProps {
  activities: ActivityItem[]
  isLoading?: boolean
}

const activityTypeColors: Record<string, string> = {
  checkout: "bg-blue-100 text-blue-800",
  return: "bg-green-100 text-green-800",
  create: "bg-purple-100 text-purple-800",
  update: "bg-yellow-100 text-yellow-800",
  delete: "bg-red-100 text-red-800",
}

const activityTypeLabels: Record<string, string> = {
  checkout: "Checked Out",
  return: "Returned",
  create: "Created",
  update: "Updated",
  delete: "Deleted",
}

export default function ActivityFeed({ activities, isLoading }: ActivityFeedProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-muted-foreground">Loading activity...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-muted-foreground">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex gap-4 border-b pb-4 last:border-0">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge className={activityTypeColors[activity.type]}>{activityTypeLabels[activity.type]}</Badge>
                    <span className="font-medium text-sm">{activity.title}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{activity.description}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(activity.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
