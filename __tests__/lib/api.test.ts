import {
  apiClient,
  ApiError,
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
  getAssets,
  getAsset,
  getAssetsByRoom,
  createAsset,
  updateAsset,
  deleteAsset,
  getAssetCategories,
} from '@/lib/api'
import { API_ENDPOINTS, PAGINATION } from '@/lib/constants'

// Mock fetch
global.fetch = jest.fn()

describe('lib/api.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  describe('ApiError', () => {
    it('should create error with message, status, and data', () => {
      const error = new ApiError('Test error', 404, { detail: 'Not found' })

      expect(error.message).toBe('Test error')
      expect(error.status).toBe(404)
      expect(error.data).toEqual({ detail: 'Not found' })
      expect(error.name).toBe('ApiError')
    })

    it('should be instance of Error', () => {
      const error = new ApiError('Test', 500)

      expect(error).toBeInstanceOf(Error)
      expect(error).toBeInstanceOf(ApiError)
    })
  })

  describe('ApiClient', () => {
    const mockFetch = global.fetch as jest.Mock

    describe('get', () => {
      it('should make GET request with auth header when token exists', async () => {
        localStorage.setItem('authToken', 'test-token')
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: 'test' }),
        })

        await apiClient.get('/test')

        expect(mockFetch).toHaveBeenCalledWith('/test', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer test-token',
          },
        })
      })

      it('should make GET request without auth header when no token', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: 'test' }),
        })

        const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()

        await apiClient.get('/test')

        expect(mockFetch).toHaveBeenCalledWith('/test', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        expect(consoleWarnSpy).toHaveBeenCalledWith('[ApiClient] No auth token found in localStorage')

        consoleWarnSpy.mockRestore()
      })

      it('should return parsed JSON response', async () => {
        localStorage.setItem('authToken', 'token')
        const responseData = { id: 1, name: 'Test' }
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => responseData,
        })

        const result = await apiClient.get('/test')

        expect(result).toEqual(responseData)
      })

      it('should throw ApiError on HTTP error', async () => {
        localStorage.setItem('authToken', 'token')
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 404,
          json: async () => ({ message: 'Not found' }),
        })

        try {
          await apiClient.get('/test')
          fail('Should have thrown an error')
        } catch (error) {
          expect(error).toBeInstanceOf(ApiError)
          expect(error.message).toBe('Not found')
          expect(error.status).toBe(404)
        }
      })
    })

    describe('post', () => {
      it('should make POST request with body', async () => {
        localStorage.setItem('authToken', 'token')
        const body = { name: 'Test' }
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: 1, ...body }),
        })

        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation()

        await apiClient.post('/test', body)

        expect(mockFetch).toHaveBeenCalledWith('/test', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer token',
          },
          body: JSON.stringify(body),
        })

        consoleLogSpy.mockRestore()
      })

      it('should make POST request without body', async () => {
        localStorage.setItem('authToken', 'token')
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        })

        jest.spyOn(console, 'log').mockImplementation()

        await apiClient.post('/test')

        expect(mockFetch).toHaveBeenCalledWith('/test', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer token',
          },
          body: undefined,
        })
      })
    })

    describe('put', () => {
      it('should make PUT request with body', async () => {
        localStorage.setItem('authToken', 'token')
        const body = { name: 'Updated' }
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: 1, ...body }),
        })

        await apiClient.put('/test/1', body)

        expect(mockFetch).toHaveBeenCalledWith('/test/1', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer token',
          },
          body: JSON.stringify(body),
        })
      })
    })

    describe('delete', () => {
      it('should make DELETE request', async () => {
        localStorage.setItem('authToken', 'token')
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        })

        await apiClient.delete('/test/1')

        expect(mockFetch).toHaveBeenCalledWith('/test/1', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer token',
          },
        })
      })
    })

    describe('patch', () => {
      it('should make PATCH request with body', async () => {
        localStorage.setItem('authToken', 'token')
        const body = { status: 'active' }
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: 1, ...body }),
        })

        await apiClient.patch('/test/1', body)

        expect(mockFetch).toHaveBeenCalledWith('/test/1', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer token',
          },
          body: JSON.stringify(body),
        })
      })
    })

    describe('error handling', () => {
      it('should handle error response with message field', async () => {
        localStorage.setItem('authToken', 'token')
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 400,
          json: async () => ({ message: 'Bad request' }),
        })

        await expect(apiClient.get('/test')).rejects.toMatchObject({
          message: 'Bad request',
          status: 400,
        })
      })

      it('should handle error response with error field', async () => {
        localStorage.setItem('authToken', 'token')
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: async () => ({ error: 'Internal server error' }),
        })

        await expect(apiClient.get('/test')).rejects.toMatchObject({
          message: 'Internal server error',
          status: 500,
        })
      })

      it('should use generic message when no error details', async () => {
        localStorage.setItem('authToken', 'token')
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: async () => ({}),
        })

        await expect(apiClient.get('/test')).rejects.toMatchObject({
          message: 'An error occurred',
          status: 500,
        })
      })
    })
  })

  describe('User API functions', () => {
    const mockFetch = global.fetch as jest.Mock

    beforeEach(() => {
      jest.spyOn(console, 'log').mockImplementation()
    })

    describe('registerUser', () => {
      it('should call POST /api/user/register', async () => {
        const userData = { username: 'test', email: 'test@example.com', password: 'pass' }
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        })

        await registerUser(userData)

        expect(mockFetch).toHaveBeenCalledWith(
          API_ENDPOINTS.AUTH.REGISTER,
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify(userData),
          })
        )
      })
    })

    describe('loginUser', () => {
      it('should call POST /api/user/login', async () => {
        const credentials = { email: 'test@example.com', password: 'pass' }
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ token: 'jwt-token' }),
        })

        await loginUser(credentials)

        expect(mockFetch).toHaveBeenCalledWith(
          API_ENDPOINTS.AUTH.LOGIN,
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify(credentials),
          })
        )
      })
    })

    describe('logoutUser', () => {
      it('should call POST /api/user/logout', async () => {
        localStorage.setItem('authToken', 'token')
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        })

        await logoutUser()

        expect(mockFetch).toHaveBeenCalledWith(
          API_ENDPOINTS.AUTH.LOGOUT,
          expect.objectContaining({
            method: 'POST',
          })
        )
      })
    })

    describe('getCurrentUser', () => {
      it('should call GET /api/user/auth/me', async () => {
        localStorage.setItem('authToken', 'token')
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: 1, email: 'test@example.com' }),
        })

        await getCurrentUser()

        expect(mockFetch).toHaveBeenCalledWith(
          API_ENDPOINTS.AUTH.ME,
          expect.objectContaining({
            method: 'GET',
          })
        )
      })
    })
  })

  describe('Rooms API functions', () => {
    const mockFetch = global.fetch as jest.Mock

    beforeEach(() => {
      localStorage.setItem('authToken', 'token')
    })

    describe('getRooms', () => {
      it('should call GET with default pagination', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: [], total: 0 }),
        })

        await getRooms()

        expect(mockFetch).toHaveBeenCalledWith(
          API_ENDPOINTS.ROOMS.WITH_PAGINATION(PAGINATION.DEFAULT_PAGE, PAGINATION.DEFAULT_PAGE_SIZE),
          expect.any(Object)
        )
      })

      it('should call GET with custom pagination', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: [], total: 0 }),
        })

        await getRooms(2, 20)

        expect(mockFetch).toHaveBeenCalledWith(
          API_ENDPOINTS.ROOMS.WITH_PAGINATION(2, 20),
          expect.any(Object)
        )
      })
    })

    describe('getRoom', () => {
      it('should call GET /api/rooms/:id', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: '123', name: 'Room 1' }),
        })

        await getRoom('123')

        expect(mockFetch).toHaveBeenCalledWith(
          API_ENDPOINTS.ROOMS.BY_ID('123'),
          expect.any(Object)
        )
      })
    })

    describe('createRoom', () => {
      it('should call POST /api/rooms', async () => {
        const roomData = { name: 'New Room', building: 'A' }
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: '123', ...roomData }),
        })

        await createRoom(roomData)

        expect(mockFetch).toHaveBeenCalledWith(
          API_ENDPOINTS.ROOMS.BASE,
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify(roomData),
          })
        )
      })
    })

    describe('updateRoom', () => {
      it('should call PUT /api/rooms/:id', async () => {
        const roomData = { name: 'Updated Room' }
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: '123', ...roomData }),
        })

        await updateRoom('123', roomData)

        expect(mockFetch).toHaveBeenCalledWith(
          API_ENDPOINTS.ROOMS.BY_ID('123'),
          expect.objectContaining({
            method: 'PUT',
            body: JSON.stringify(roomData),
          })
        )
      })
    })

    describe('deleteRoom', () => {
      it('should call DELETE /api/rooms/:id', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        })

        await deleteRoom('123')

        expect(mockFetch).toHaveBeenCalledWith(
          API_ENDPOINTS.ROOMS.BY_ID('123'),
          expect.objectContaining({
            method: 'DELETE',
          })
        )
      })
    })
  })

  describe('Assets API functions', () => {
    const mockFetch = global.fetch as jest.Mock

    beforeEach(() => {
      localStorage.setItem('authToken', 'token')
    })

    describe('getAssets', () => {
      it('should call GET with default pagination', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: [], total: 0 }),
        })

        await getAssets()

        expect(mockFetch).toHaveBeenCalledWith(
          API_ENDPOINTS.ASSETS.WITH_PAGINATION(PAGINATION.DEFAULT_PAGE, PAGINATION.DEFAULT_PAGE_SIZE),
          expect.any(Object)
        )
      })

      it('should call GET with custom pagination', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: [], total: 0 }),
        })

        await getAssets(3, 15)

        expect(mockFetch).toHaveBeenCalledWith(
          API_ENDPOINTS.ASSETS.WITH_PAGINATION(3, 15),
          expect.any(Object)
        )
      })
    })

    describe('getAsset', () => {
      it('should call GET /api/assets/:id', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: '456', name: 'Asset 1' }),
        })

        await getAsset('456')

        expect(mockFetch).toHaveBeenCalledWith(
          API_ENDPOINTS.ASSETS.BY_ID('456'),
          expect.any(Object)
        )
      })
    })

    describe('getAssetsByRoom', () => {
      it('should call GET /api/assets/room/:roomId', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: [] }),
        })

        await getAssetsByRoom('room-123')

        expect(mockFetch).toHaveBeenCalledWith(
          API_ENDPOINTS.ASSETS.BY_ROOM('room-123'),
          expect.any(Object)
        )
      })
    })

    describe('createAsset', () => {
      it('should call POST /api/assets', async () => {
        const assetData = { name: 'New Asset', category: 'Furniture' }
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: '456', ...assetData }),
        })

        await createAsset(assetData)

        expect(mockFetch).toHaveBeenCalledWith(
          API_ENDPOINTS.ASSETS.BASE,
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify(assetData),
          })
        )
      })
    })

    describe('updateAsset', () => {
      it('should call PUT /api/assets/:id', async () => {
        const assetData = { name: 'Updated Asset' }
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: '456', ...assetData }),
        })

        await updateAsset('456', assetData)

        expect(mockFetch).toHaveBeenCalledWith(
          API_ENDPOINTS.ASSETS.BY_ID('456'),
          expect.objectContaining({
            method: 'PUT',
            body: JSON.stringify(assetData),
          })
        )
      })
    })

    describe('deleteAsset', () => {
      it('should call DELETE /api/assets/:id', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        })

        await deleteAsset('456')

        expect(mockFetch).toHaveBeenCalledWith(
          API_ENDPOINTS.ASSETS.BY_ID('456'),
          expect.objectContaining({
            method: 'DELETE',
          })
        )
      })
    })

    describe('getAssetCategories', () => {
      it('should call GET /api/asset-categories', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => [{ id: 1, name: 'Furniture' }],
        })

        await getAssetCategories()

        expect(mockFetch).toHaveBeenCalledWith(
          API_ENDPOINTS.ASSET_CATEGORIES,
          expect.any(Object)
        )
      })
    })
  })
})
