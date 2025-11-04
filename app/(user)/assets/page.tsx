"use client"

import { useEffect, useState } from "react"
import MainLayout from "@/components/layouts/main-layout"
import PageHeader from "@/components/layouts/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { apiClient } from "@/lib/api"
import type { Asset } from "@/types"
import { Trash2, Pencil } from "lucide-react"

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("")

  useEffect(() => {
    fetchAllAssets()
  }, [])

  const fetchAllAssets = async () => {
    setIsLoading(true)
    try {
      const response = await apiClient.get<{ data: Asset[] }>("/api/assets")
      setAssets(response.data || [])
    } catch {
      setAssets([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (assetId: number) => {
    if (!confirm("Are you sure you want to delete this asset?")) return

    try {
      await apiClient.delete(`/api/assets/${assetId}`)
      setAssets((prev) => prev.filter((a) => a.id !== assetId))
    } catch {
      alert("Failed to delete asset")
    }
  }

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !filterCategory || asset.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(assets.map((a) => a.category).filter(Boolean)))

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading assets...</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <PageHeader
        title="All Assets"
        description="Manage all your assets across different rooms"
      />

      <Card>
        <CardHeader>
          <CardTitle>Assets List</CardTitle>
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
                <p className="text-muted-foreground">No assets found</p>
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
                    <TableHead>Value</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell className="font-medium">{asset.name}</TableCell>
                      <TableCell>{asset.category || "-"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {asset.lengthCm} × {asset.widthCm} × {asset.heightCm}
                      </TableCell>
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
                            onClick={() => handleDelete(asset.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  )
}
