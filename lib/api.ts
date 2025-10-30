import type { PaginatedResponse } from "@/types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private getAuthHeader(): HeadersInit {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(data.error || "An error occurred", response.status, data)
    }

    return data
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "GET",
      headers: this.getAuthHeader(),
    })
    return this.handleResponse<T>(response)
  }

  async post<T>(endpoint: string, body?: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: this.getAuthHeader(),
      body: body ? JSON.stringify(body) : undefined,
    })
    return this.handleResponse<T>(response)
  }

  async put<T>(endpoint: string, body?: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "PUT",
      headers: this.getAuthHeader(),
      body: body ? JSON.stringify(body) : undefined,
    })
    return this.handleResponse<T>(response)
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "DELETE",
      headers: this.getAuthHeader(),
    })
    return this.handleResponse<T>(response)
  }

  async patch<T>(endpoint: string, body?: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "PATCH",
      headers: this.getAuthHeader(),
      body: body ? JSON.stringify(body) : undefined,
    })
    return this.handleResponse<T>(response)
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export const apiClient = new ApiClient()

export async function registerUser(data: any) {
  return apiClient.post("/api/auth/register", data)
}

export async function loginUser(data: any) {
  return apiClient.post("/api/auth/login", data)
}

export async function logoutUser() {
  return apiClient.post("/api/auth/logout")
}

export async function getCurrentUser() {
  return apiClient.get("/api/auth/me")
}

export async function getRooms(page = 1, pageSize = 10) {
  return apiClient.get<PaginatedResponse<any>>(`/api/rooms?page=${page}&pageSize=${pageSize}`)
}

export async function getRoom(id: string) {
  return apiClient.get(`/api/rooms/${id}`)
}

export async function createRoom(data: any) {
  return apiClient.post("/api/rooms", data)
}

export async function updateRoom(id: string, data: any) {
  return apiClient.put(`/api/rooms/${id}`, data)
}

export async function deleteRoom(id: string) {
  return apiClient.delete(`/api/rooms/${id}`)
}

export async function getAssets(page = 1, pageSize = 10) {
  return apiClient.get<PaginatedResponse<any>>(`/api/assets?page=${page}&pageSize=${pageSize}`)
}

export async function getAsset(id: string) {
  return apiClient.get(`/api/assets/${id}`)
}

export async function getAssetsByRoom(roomId: string) {
  return apiClient.get(`/api/assets?roomId=${roomId}`)
}

export async function createAsset(data: any) {
  return apiClient.post("/api/assets", data)
}

export async function updateAsset(id: string, data: any) {
  return apiClient.put(`/api/assets/${id}`, data)
}

export async function deleteAsset(id: string) {
  return apiClient.delete(`/api/assets/${id}`)
}

export async function checkoutAsset(data: any) {
  return apiClient.post("/api/checkouts", data)
}

export async function returnAsset(checkoutId: string, data?: any) {
  return apiClient.post(`/api/checkouts/${checkoutId}/return`, data)
}

export async function getCheckouts(page = 1, pageSize = 10) {
  return apiClient.get<PaginatedResponse<any>>(`/api/checkouts?page=${page}&pageSize=${pageSize}`)
}

export async function getUserCheckouts(userId: string) {
  return apiClient.get(`/api/checkouts?userId=${userId}`)
}

export async function getDorms() {
  return apiClient.get("/api/dorms")
}

export async function getDorm(id: string) {
  return apiClient.get(`/api/dorms/${id}`)
}

export async function createDorm(data: any) {
  return apiClient.post("/api/dorms", data)
}

export async function updateDorm(id: string, data: any) {
  return apiClient.put(`/api/dorms/${id}`, data)
}

export async function getCategories() {
  return apiClient.get("/api/categories")
}

export async function createCategory(data: any) {
  return apiClient.post("/api/categories", data)
}

export async function updateCategory(id: string, data: any) {
  return apiClient.put(`/api/categories/${id}`, data)
}

export async function deleteCategory(id: string) {
  return apiClient.delete(`/api/categories/${id}`)
}
