import type { PaginatedResponse, AssetCategory } from "@/types"
import { API_ENDPOINTS, PAGINATION, HTTP_CONFIG, ERROR_MESSAGES } from "@/lib/constants"

// Use empty string to make relative API calls to Next.js API routes
// The Next.js API routes will proxy to the backend API
const API_BASE_URL = ''

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private getAuthHeader(): HeadersInit {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null

    if (typeof window !== "undefined" && !token) {
      console.warn("[ApiClient] No auth token found in localStorage")
    }

    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json()

    if (!response.ok) {
      // Handle different error response formats
      const errorMessage = data.message || data.error || "An error occurred"
      throw new ApiError(errorMessage, response.status, data)
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
    const headers = this.getAuthHeader()
    console.log(`[ApiClient] POST ${this.baseUrl}${endpoint}`, {
      hasAuth: !!headers,
    })

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers,
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
  return apiClient.post(API_ENDPOINTS.AUTH.REGISTER, data)
}

export async function loginUser(data: any) {
  return apiClient.post(API_ENDPOINTS.AUTH.LOGIN, data)
}

export async function logoutUser() {
  return apiClient.post(API_ENDPOINTS.AUTH.LOGOUT)
}

export async function getCurrentUser() {
  return apiClient.get(API_ENDPOINTS.AUTH.ME)
}

export async function getRooms(page = PAGINATION.DEFAULT_PAGE, pageSize = PAGINATION.DEFAULT_PAGE_SIZE) {
  return apiClient.get<PaginatedResponse<any>>(API_ENDPOINTS.ROOMS.WITH_PAGINATION(page, pageSize))
}

export async function getRoom(id: string) {
  return apiClient.get(API_ENDPOINTS.ROOMS.BY_ID(id))
}

export async function createRoom(data: any) {
  return apiClient.post(API_ENDPOINTS.ROOMS.BASE, data)
}

export async function updateRoom(id: string, data: any) {
  return apiClient.put(API_ENDPOINTS.ROOMS.BY_ID(id), data)
}

export async function deleteRoom(id: string) {
  return apiClient.delete(API_ENDPOINTS.ROOMS.BY_ID(id))
}

export async function getAssets(page = PAGINATION.DEFAULT_PAGE, pageSize = PAGINATION.DEFAULT_PAGE_SIZE) {
  return apiClient.get<PaginatedResponse<any>>(API_ENDPOINTS.ASSETS.WITH_PAGINATION(page, pageSize))
}

export async function getAsset(id: string) {
  return apiClient.get(API_ENDPOINTS.ASSETS.BY_ID(id))
}

export async function getAssetsByRoom(roomId: string) {
  return apiClient.get(API_ENDPOINTS.ASSETS.BY_ROOM(roomId))
}

export async function createAsset(data: any) {
  return apiClient.post(API_ENDPOINTS.ASSETS.BASE, data)
}

export async function updateAsset(id: string, data: any) {
  return apiClient.put(API_ENDPOINTS.ASSETS.BY_ID(id), data)
}

export async function deleteAsset(id: string) {
  return apiClient.delete(API_ENDPOINTS.ASSETS.BY_ID(id))
}

export async function getAssetCategories(): Promise<AssetCategory[] | { data: AssetCategory[] }> {
  return apiClient.get<AssetCategory[] | { data: AssetCategory[] }>(API_ENDPOINTS.ASSET_CATEGORIES)
}
