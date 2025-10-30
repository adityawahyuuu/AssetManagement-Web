export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatAssetStatus(status: string): string {
  const statusMap: Record<string, string> = {
    available: "Available",
    "in-use": "In Use",
    damaged: "Damaged",
    lost: "Lost",
  }
  return statusMap[status] || status
}

export function formatAssetCondition(condition: string): string {
  const conditionMap: Record<string, string> = {
    excellent: "Excellent",
    good: "Good",
    fair: "Fair",
    poor: "Poor",
  }
  return conditionMap[condition] || condition
}

export function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    available: "bg-green-100 text-green-800",
    "in-use": "bg-blue-100 text-blue-800",
    damaged: "bg-yellow-100 text-yellow-800",
    lost: "bg-red-100 text-red-800",
    "checked-out": "bg-blue-100 text-blue-800",
    returned: "bg-green-100 text-green-800",
  }
  return colorMap[status] || "bg-gray-100 text-gray-800"
}
