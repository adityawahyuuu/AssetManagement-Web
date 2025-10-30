import { ApiError } from "./api"

export class ValidationError extends Error {
  constructor(
    message: string,
    public errors?: Record<string, string[]>,
  ) {
    super(message)
    this.name = "ValidationError"
  }
}

export function handleApiError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 401) {
      return "Unauthorized. Please log in again."
    }
    if (error.status === 403) {
      return "You don't have permission to perform this action."
    }
    if (error.status === 404) {
      return "Resource not found."
    }
    if (error.status === 422) {
      return "Validation error. Please check your input."
    }
    if (error.status >= 500) {
      return "Server error. Please try again later."
    }
    return error.message
  }

  if (error instanceof ValidationError) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return "An unexpected error occurred"
}

export function getErrorMessage(error: unknown): string {
  return handleApiError(error)
}
