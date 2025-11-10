/**
 * Application Constants
 *
 * This file contains all constant values used throughout the application.
 * All sensitive values should be loaded from environment variables.
 */

// ==================== API Configuration ====================

/**
 * Backend API base URL
 * This should be configured via NEXT_PUBLIC_API_URL environment variable
 */
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || '',
  TIMEOUT: 30000, // 30 seconds
  IS_HTTPS: process.env.NEXT_PUBLIC_API_URL?.startsWith('https://') ?? false,
  IS_LOCALHOST: process.env.NEXT_PUBLIC_API_URL?.includes('localhost') ?? false,
} as const

// Validate API URL configuration
if (typeof window === 'undefined') { // Server-side validation only
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  // Check if API_BASE_URL is set in production
  if (process.env.NODE_ENV === 'production' && !apiUrl) {
    console.error('❌ CRITICAL: NEXT_PUBLIC_API_URL must be set in production environment')
  }

  // Warn about HTTP in production
  if (process.env.NODE_ENV === 'production' && apiUrl && !apiUrl.startsWith('https://')) {
    console.error('❌ SECURITY WARNING: Production API URL must use HTTPS, not HTTP!')
    console.error(`   Current URL: ${apiUrl}`)
    console.error('   This exposes user credentials and data to interception.')
  }

  // Warn about localhost in production
  if (process.env.NODE_ENV === 'production' && apiUrl?.includes('localhost')) {
    console.error('❌ CONFIGURATION ERROR: Production cannot use localhost URL!')
    console.error(`   Current URL: ${apiUrl}`)
  }

  // Info for development
  if (process.env.NODE_ENV === 'development' && apiUrl) {
    const protocol = apiUrl.startsWith('https://') ? 'HTTPS' : 'HTTP'
    console.log(`✅ API Configuration: ${protocol} - ${apiUrl}`)

    if (!apiUrl.startsWith('https://') && !apiUrl.includes('localhost')) {
      console.warn('⚠️  WARNING: Using HTTP with non-localhost URL. Consider using HTTPS.')
    }
  }
}

// ==================== API Endpoints ====================

/**
 * Backend API endpoints (for Next.js API routes to proxy)
 */
export const BACKEND_ENDPOINTS = {
  // User & Authentication
  USER: {
    REGISTER: '/api/user/register',
    LOGIN: '/api/user/login',
    LOGOUT: '/api/user/logout',
    ME: '/api/user/auth/me',
    VERIFY: '/api/user/verify',
    FORGOT_PASSWORD: '/api/user/forgot-password',
    RESET_PASSWORD: '/api/user/reset-password',
    RESEND_OTP: '/api/user/resend-otp',
  },

  // Rooms
  ROOMS: {
    BASE: '/api/rooms',
    BY_ID: (id: string) => `/api/rooms/${id}`,
  },

  // Assets
  ASSETS: {
    BASE: '/api/assets',
    BY_ID: (id: string) => `/api/assets/${id}`,
    BY_ROOM: (roomId: string) => `/api/assets/room/${roomId}`,
  },

  // Asset Categories
  ASSET_CATEGORIES: '/api/asset-categories',
} as const

/**
 * Frontend API endpoints (calls to Next.js API routes)
 */
export const API_ENDPOINTS = {
  // User & Authentication
  AUTH: {
    REGISTER: '/api/user/register',
    LOGIN: '/api/user/login',
    LOGOUT: '/api/user/logout',
    ME: '/api/user/auth/me',
    VERIFY: '/api/user/verify',
    FORGOT_PASSWORD: '/api/user/forgot-password',
    RESET_PASSWORD: '/api/user/reset-password',
    RESEND_OTP: '/api/user/resend-otp',
  },

  // Rooms
  ROOMS: {
    BASE: '/api/rooms',
    BY_ID: (id: string) => `/api/rooms/${id}`,
    WITH_PAGINATION: (page: number, pageSize: number) =>
      `/api/rooms?page=${page}&pageSize=${pageSize}`,
  },

  // Assets
  ASSETS: {
    BASE: '/api/assets',
    BY_ID: (id: string) => `/api/assets/${id}`,
    BY_ROOM: (roomId: string) => `/api/assets/room/${roomId}`,
    WITH_PAGINATION: (page: number, pageSize: number) =>
      `/api/assets?page=${page}&pageSize=${pageSize}`,
  },

  // Asset Categories
  ASSET_CATEGORIES: '/api/asset-categories',
} as const

// ==================== Authentication Configuration ====================

/**
 * Authentication and session configuration
 */
export const AUTH_CONFIG = {
  // Token expiration (in minutes)
  TOKEN_EXPIRATION_MINUTES: Number(process.env.NEXT_PUBLIC_TOKEN_EXPIRATION_MINUTES) || 10,

  // Cookie configuration
  COOKIE: {
    NAME: 'authToken',
    MAX_AGE_SECONDS: (Number(process.env.NEXT_PUBLIC_TOKEN_EXPIRATION_MINUTES) || 10) * 60,
    PATH: '/',
    SAME_SITE: 'lax' as const,
  },

  // LocalStorage keys
  STORAGE_KEYS: {
    TOKEN: 'authToken',
    TOKEN_EXPIRATION: 'authTokenExpiration',
    USER: 'user',
  },
} as const

// ==================== Pagination Configuration ====================

/**
 * Default pagination settings
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: Number(process.env.NEXT_PUBLIC_DEFAULT_PAGE_SIZE) || 10,
  MAX_PAGE_SIZE: 100,
} as const

// ==================== Application Routes ====================

/**
 * Application route paths
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY: '/verify',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  ROOMS: '/rooms',
  ROOM_DETAIL: (id: string) => `/rooms/${id}`,
  ASSETS: '/assets',
  ASSET_DETAIL: (id: string) => `/assets/${id}`,
  PROFILE: '/profile',
  SETTINGS: '/settings',
  REPORTS: '/reports',
} as const

/**
 * Protected routes that require authentication
 */
export const PROTECTED_ROUTES = [
  '/dashboard',
  '/rooms',
  '/assets',
  '/profile',
  '/settings',
  '/reports',
] as const

/**
 * Public routes that redirect authenticated users
 */
export const PUBLIC_ONLY_ROUTES = [
  '/login',
  '/register',
  '/verify',
  '/forgot-password',
  '/reset-password',
] as const

// ==================== Validation Constants ====================

/**
 * Validation rules for forms
 */
export const VALIDATION = {
  USERNAME: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 50,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 100,
  },
  EMAIL: {
    MAX_LENGTH: 255,
  },
  ROOM: {
    NAME: {
      MIN_LENGTH: 1,
      MAX_LENGTH: 100,
    },
    DIMENSIONS: {
      MIN: 0.1, // meters
      MAX: 100, // meters
    },
  },
  ASSET: {
    NAME: {
      MIN_LENGTH: 1,
      MAX_LENGTH: 100,
    },
    DIMENSIONS: {
      MIN: 1, // centimeters
      MAX: 10000, // centimeters (100 meters)
    },
  },
} as const

// ==================== HTTP Configuration ====================

/**
 * HTTP headers and configuration
 */
export const HTTP_CONFIG = {
  HEADERS: {
    CONTENT_TYPE: 'Content-Type',
    AUTHORIZATION: 'Authorization',
    BEARER_PREFIX: 'Bearer ',
  },
  CONTENT_TYPES: {
    JSON: 'application/json',
    FORM_DATA: 'application/x-www-form-urlencoded',
    MULTIPART: 'multipart/form-data',
  },
} as const

// ==================== Error Messages ====================

/**
 * Standardized error messages
 */
export const ERROR_MESSAGES = {
  AUTH: {
    NO_TOKEN: 'Unauthorized - No token provided',
    INVALID_TOKEN: 'Unauthorized - Invalid token',
    TOKEN_EXPIRED: 'Session expired. Please login again',
    LOGIN_FAILED: 'Login failed',
    REGISTRATION_FAILED: 'Registration failed',
    UNAUTHORIZED: 'Unauthorized access',
  },
  API: {
    CONFIG_ERROR: 'Server configuration error: API URL not defined',
    NETWORK_ERROR: 'Network error occurred',
    INTERNAL_ERROR: 'Internal server error',
    NOT_FOUND: 'Resource not found',
  },
  VALIDATION: {
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Invalid email address',
    INVALID_FORMAT: 'Invalid format',
  },
} as const

// ==================== Environment Variables Validation ====================

/**
 * Validates required environment variables
 * Call this function at application startup
 */
export function validateEnvironment(): { isValid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = []
  const warnings: string[] = []

  // Required environment variables
  if (!process.env.NEXT_PUBLIC_API_URL && process.env.NODE_ENV === 'production') {
    errors.push('NEXT_PUBLIC_API_URL is required in production')
  }

  // Validate URL format if provided
  if (process.env.NEXT_PUBLIC_API_URL) {
    try {
      const url = new URL(process.env.NEXT_PUBLIC_API_URL)

      // CRITICAL: Production must use HTTPS
      if (process.env.NODE_ENV === 'production' && url.protocol !== 'https:') {
        errors.push('NEXT_PUBLIC_API_URL must use HTTPS in production (not HTTP)')
      }

      // Warn about localhost in production
      if (process.env.NODE_ENV === 'production' && url.hostname === 'localhost') {
        errors.push('NEXT_PUBLIC_API_URL cannot use localhost in production')
      }

      // Warn about HTTP in development (non-localhost)
      if (process.env.NODE_ENV === 'development' && url.protocol === 'http:' && url.hostname !== 'localhost') {
        warnings.push('Consider using HTTPS for non-localhost development URLs')
      }
    } catch {
      errors.push('NEXT_PUBLIC_API_URL must be a valid URL')
    }
  }

  // Validate numeric values
  if (process.env.NEXT_PUBLIC_TOKEN_EXPIRATION_MINUTES) {
    const value = Number(process.env.NEXT_PUBLIC_TOKEN_EXPIRATION_MINUTES)
    if (isNaN(value) || value <= 0) {
      errors.push('NEXT_PUBLIC_TOKEN_EXPIRATION_MINUTES must be a positive number')
    }
    if (value < 5) {
      warnings.push('NEXT_PUBLIC_TOKEN_EXPIRATION_MINUTES is very short (< 5 minutes)')
    }
    if (value > 60) {
      warnings.push('NEXT_PUBLIC_TOKEN_EXPIRATION_MINUTES is very long (> 60 minutes) - consider security implications')
    }
  }

  if (process.env.NEXT_PUBLIC_DEFAULT_PAGE_SIZE) {
    const value = Number(process.env.NEXT_PUBLIC_DEFAULT_PAGE_SIZE)
    if (isNaN(value) || value <= 0 || value > PAGINATION.MAX_PAGE_SIZE) {
      errors.push(`NEXT_PUBLIC_DEFAULT_PAGE_SIZE must be between 1 and ${PAGINATION.MAX_PAGE_SIZE}`)
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}
