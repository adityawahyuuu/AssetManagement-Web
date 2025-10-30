"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Package, ChevronRight } from "lucide-react"
import Link from "next/link"
import { formatDate, getStatusColor, formatAssetStatus } from "@/lib/format"

interface Asset {
  id: string
  name: string
  quantity: number
  status: string
  roomId: string
  updatedAt: Date | string
}

interface AssetListProps {
  assets: Asset[]
  isLoading?: boolean
}

export default function AssetList({ assets, isLoading }: AssetListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Recent Assets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-muted-foreground">Loading assets...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Recent Assets
          </CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link href="/assets">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {assets.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-muted-foreground">No assets found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assets.slice(0, 5).map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell className="font-medium">{asset.name}</TableCell>
                    <TableCell>{asset.quantity}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(asset.status)}>{formatAssetStatus(asset.status)}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(asset.updatedAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
