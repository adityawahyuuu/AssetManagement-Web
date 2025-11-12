import {
  getAuthToken,
  setAuthToken,
  setAuthTokenWithExpiration,
  removeAuthToken,
  isTokenExpired,
  getSessionExpiration,
  refreshSession,
  isAuthenticated,
  setUserSession,
  getUserSession,
  clearUserSession,
  logout,
} from '@/lib/auth'

// Mock fetch globally
global.fetch = jest.fn()

describe('lib/auth.ts', () => {
  beforeEach(() => {
    // Clear all mocks and localStorage before each test
    jest.clearAllMocks()
    jest.restoreAllMocks()
    localStorage.clear()
  })

  describe('getAuthToken', () => {
    it('should return token from localStorage when it exists', () => {
      localStorage.setItem('authToken', 'test-token-123')
      expect(getAuthToken()).toBe('test-token-123')
    })

    it('should return null when token does not exist', () => {
      expect(getAuthToken()).toBeNull()
    })
  })

  describe('setAuthToken', () => {
    it('should store token in localStorage', () => {
      setAuthToken('new-token-456')
      expect(localStorage.getItem('authToken')).toBe('new-token-456')
    })
  })

  describe('setAuthTokenWithExpiration', () => {
    it('should store token and expiration in localStorage', () => {
      const now = 1000000000000
      jest.spyOn(Date.prototype, 'getTime').mockReturnValue(now)

      setAuthTokenWithExpiration('token-with-exp', 10)

      expect(localStorage.getItem('authToken')).toBe('token-with-exp')
      expect(localStorage.getItem('authTokenExpiration')).toBe((now + 10 * 60 * 1000).toString())
    })

    it('should calculate expiration correctly for different durations', () => {
      const now = 1000000000000
      jest.spyOn(Date.prototype, 'getTime').mockReturnValue(now)

      // Test 5 minutes
      setAuthTokenWithExpiration('token', 5)
      expect(localStorage.getItem('authTokenExpiration')).toBe((now + 5 * 60 * 1000).toString())

      // Test 30 minutes
      localStorage.clear()
      jest.restoreAllMocks() // Clear mock
      jest.spyOn(Date.prototype, 'getTime').mockReturnValue(now)
      setAuthTokenWithExpiration('token', 30)
      expect(localStorage.getItem('authTokenExpiration')).toBe((now + 30 * 60 * 1000).toString())
    })
  })

  describe('removeAuthToken', () => {
    it('should remove token and expiration from localStorage', () => {
      localStorage.setItem('authToken', 'token-to-remove')
      localStorage.setItem('authTokenExpiration', '1234567890')

      removeAuthToken()

      expect(localStorage.getItem('authToken')).toBeNull()
      expect(localStorage.getItem('authTokenExpiration')).toBeNull()
    })
  })

  describe('isTokenExpired', () => {
    it('should return false when token is not expired', () => {
      const futureTime = new Date().getTime() + 5 * 60 * 1000 // 5 minutes in future
      localStorage.setItem('authTokenExpiration', futureTime.toString())
      expect(isTokenExpired()).toBe(false)
    })

    it('should return true when token is expired', () => {
      const pastTime = new Date().getTime() - 5 * 60 * 1000 // 5 minutes in past
      localStorage.setItem('authTokenExpiration', pastTime.toString())
      expect(isTokenExpired()).toBe(true)
    })

    it('should return true when expiration time does not exist', () => {
      expect(isTokenExpired()).toBe(true)
    })

    it('should return true exactly at expiration time boundary', () => {
      const now = new Date().getTime()
      jest.spyOn(Date.prototype, 'getTime').mockReturnValue(now)
      localStorage.setItem('authTokenExpiration', now.toString())

      // At exactly expiration time, not expired yet
      expect(isTokenExpired()).toBe(false)

      // Clear mock and advance time by 1ms
      jest.restoreAllMocks()
      jest.spyOn(Date.prototype, 'getTime').mockReturnValue(now + 1)
      expect(isTokenExpired()).toBe(true)
    })
  })

  describe('getSessionExpiration', () => {
    it('should return expiration date when it exists', () => {
      const expirationTime = 1234567890000
      localStorage.setItem('authTokenExpiration', expirationTime.toString())

      const result = getSessionExpiration()
      expect(result).toBeInstanceOf(Date)
      expect(result?.getTime()).toBe(expirationTime)
    })

    it('should return null when expiration does not exist', () => {
      expect(getSessionExpiration()).toBeNull()
    })
  })

  describe('refreshSession', () => {
    it('should refresh expiration time when token exists and is not expired', () => {
      const now = 1000000000000
      jest.spyOn(Date.prototype, 'getTime').mockReturnValue(now)

      localStorage.setItem('authToken', 'valid-token')
      localStorage.setItem('authTokenExpiration', (now + 5 * 60 * 1000).toString()) // 5 min in future

      refreshSession()

      const newExpiration = localStorage.getItem('authTokenExpiration')
      expect(newExpiration).toBe((now + 10 * 60 * 1000).toString()) // Reset to 10 min
    })

    it('should not refresh when token does not exist', () => {
      refreshSession()
      expect(localStorage.getItem('authTokenExpiration')).toBeNull()
    })

    it('should not refresh when token is expired', () => {
      const now = new Date().getTime()
      localStorage.setItem('authToken', 'expired-token')
      localStorage.setItem('authTokenExpiration', (now - 5 * 60 * 1000).toString()) // 5 min in past

      refreshSession()

      // Expiration should remain the same (old expired time)
      expect(localStorage.getItem('authTokenExpiration')).toBe((now - 5 * 60 * 1000).toString())
    })
  })

  describe('isAuthenticated', () => {
    it('should return true when token exists and is not expired', () => {
      const futureTime = new Date().getTime() + 10 * 60 * 1000
      localStorage.setItem('authToken', 'valid-token')
      localStorage.setItem('authTokenExpiration', futureTime.toString())

      expect(isAuthenticated()).toBe(true)
    })

    it('should return false when token does not exist', () => {
      expect(isAuthenticated()).toBe(false)
    })

    it('should return false and clear session when token is expired', () => {
      const pastTime = new Date().getTime() - 5 * 60 * 1000
      localStorage.setItem('authToken', 'expired-token')
      localStorage.setItem('authTokenExpiration', pastTime.toString())
      localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Test' }))

      expect(isAuthenticated()).toBe(false)

      // Should clear token, expiration, and user
      expect(localStorage.getItem('authToken')).toBeNull()
      expect(localStorage.getItem('authTokenExpiration')).toBeNull()
      expect(localStorage.getItem('user')).toBeNull()
    })
  })

  describe('setUserSession', () => {
    it('should store user object in localStorage as JSON', () => {
      const user = { id: 1, name: 'Test User', email: 'test@example.com' }
      setUserSession(user)

      expect(localStorage.getItem('user')).toBe(JSON.stringify(user))
    })

    it('should handle complex user objects', () => {
      const user = {
        id: 1,
        name: 'Test',
        roles: ['admin', 'user'],
        metadata: { createdAt: '2025-01-01' },
      }
      setUserSession(user)
      expect(localStorage.getItem('user')).toBe(JSON.stringify(user))
    })
  })

  describe('getUserSession', () => {
    it('should return parsed user object when it exists', () => {
      const user = { id: 1, name: 'Test User', email: 'test@example.com' }
      localStorage.setItem('user', JSON.stringify(user))

      expect(getUserSession()).toEqual(user)
    })

    it('should return null when user does not exist', () => {
      expect(getUserSession()).toBeNull()
    })

    it('should handle complex user objects correctly', () => {
      const user = {
        id: 1,
        name: 'Test',
        roles: ['admin', 'user'],
        metadata: { createdAt: '2025-01-01' },
      }
      localStorage.setItem('user', JSON.stringify(user))
      expect(getUserSession()).toEqual(user)
    })
  })

  describe('clearUserSession', () => {
    it('should remove user, token, and expiration from localStorage', () => {
      localStorage.setItem('user', JSON.stringify({ id: 1 }))
      localStorage.setItem('authToken', 'token')
      localStorage.setItem('authTokenExpiration', '1234567890')

      clearUserSession()

      expect(localStorage.getItem('user')).toBeNull()
      expect(localStorage.getItem('authToken')).toBeNull()
      expect(localStorage.getItem('authTokenExpiration')).toBeNull()
    })
  })

  describe('logout', () => {
    it('should call logout API and clear client-side session', async () => {
      const mockFetch = global.fetch as jest.Mock
      mockFetch.mockResolvedValueOnce({ ok: true })

      localStorage.setItem('authToken', 'token')
      localStorage.setItem('user', JSON.stringify({ id: 1 }))

      await logout()

      expect(mockFetch).toHaveBeenCalledWith('/api/user/logout', {
        method: 'POST',
      })
      expect(localStorage.getItem('authToken')).toBeNull()
      expect(localStorage.getItem('user')).toBeNull()
    })

    it('should clear client-side session even if API call fails', async () => {
      const mockFetch = global.fetch as jest.Mock
      mockFetch.mockRejectedValueOnce(new Error('Network error'))
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

      localStorage.setItem('authToken', 'token')
      localStorage.setItem('user', JSON.stringify({ id: 1 }))

      await logout()

      expect(mockFetch).toHaveBeenCalledWith('/api/user/logout', {
        method: 'POST',
      })
      expect(localStorage.getItem('authToken')).toBeNull()
      expect(localStorage.getItem('user')).toBeNull()
      expect(consoleErrorSpy).toHaveBeenCalledWith('Logout API error:', expect.any(Error))

      consoleErrorSpy.mockRestore()
    })

    it('should handle API rejection gracefully', async () => {
      const mockFetch = global.fetch as jest.Mock
      mockFetch.mockResolvedValueOnce({ ok: false, status: 500 })

      localStorage.setItem('authToken', 'token')
      localStorage.setItem('user', JSON.stringify({ id: 1 }))

      await logout()

      expect(localStorage.getItem('authToken')).toBeNull()
      expect(localStorage.getItem('user')).toBeNull()
    })
  })
})
