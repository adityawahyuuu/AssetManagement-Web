import { z } from "zod"
import {
  registerSchema,
  loginSchema,
  roomSchema,
  assetSchema,
  dormSchema,
  assetCategorySchema,
  assetCheckoutSchema,
} from "./schemas"
import { ValidationError } from "./error-handler"

export async function validateRegisterForm(data: unknown) {
  try {
    return registerSchema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.flatten().fieldErrors
      throw new ValidationError("Validation failed", errors as any)
    }
    throw error
  }
}

export async function validateLoginForm(data: unknown) {
  try {
    return loginSchema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.flatten().fieldErrors
      throw new ValidationError("Validation failed", errors as any)
    }
    throw error
  }
}

export async function validateRoomForm(data: unknown) {
  try {
    return roomSchema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.flatten().fieldErrors
      throw new ValidationError("Validation failed", errors as any)
    }
    throw error
  }
}

export async function validateAssetForm(data: unknown) {
  try {
    return assetSchema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.flatten().fieldErrors
      throw new ValidationError("Validation failed", errors as any)
    }
    throw error
  }
}

export async function validateDormForm(data: unknown) {
  try {
    return dormSchema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.flatten().fieldErrors
      throw new ValidationError("Validation failed", errors as any)
    }
    throw error
  }
}

export async function validateAssetCategoryForm(data: unknown) {
  try {
    return assetCategorySchema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.flatten().fieldErrors
      throw new ValidationError("Validation failed", errors as any)
    }
    throw error
  }
}

export async function validateAssetCheckoutForm(data: unknown) {
  try {
    return assetCheckoutSchema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.flatten().fieldErrors
      throw new ValidationError("Validation failed", errors as any)
    }
    throw error
  }
}
