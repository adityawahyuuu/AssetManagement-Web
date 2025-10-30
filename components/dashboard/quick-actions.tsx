import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Download, Settings } from "lucide-react"
import Link from "next/link"

export default function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Button asChild variant="outline" className="h-auto flex-col gap-2 py-4 bg-transparent">
            <Link href="/assets/new">
              <Plus className="h-5 w-5" />
              <span className="text-xs">Add Asset</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto flex-col gap-2 py-4 bg-transparent">
            <Link href="/rooms/new">
              <Plus className="h-5 w-5" />
              <span className="text-xs">Add Room</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto flex-col gap-2 py-4 bg-transparent">
            <Link href="/reports">
              <Download className="h-5 w-5" />
              <span className="text-xs">Export</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto flex-col gap-2 py-4 bg-transparent">
            <Link href="/settings">
              <Settings className="h-5 w-5" />
              <span className="text-xs">Settings</span>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
