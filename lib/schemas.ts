import { z } from "zod"

export const registerSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    username: z.string().min(10, "username must be at least 10 characters").max(50, "username must not exceed 50 characters")
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export const roomSchema = z.object({
  name: z.string().min(1, "Room name is required"),
  roomNumber: z.string().min(1, "Room number is required"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  dormId: z.string().min(1, "Dorm ID is required"),
})

export const assetSchema = z.object({
  name: z.string().min(1, "Asset name is required"),
  description: z.string().optional(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  roomId: z.string().min(1, "Room ID is required"),
  status: z.enum(["available", "in-use", "damaged", "lost"]),
  categoryId: z.string().optional(),
})

export const dormSchema = z.object({
  name: z.string().min(1, "Dorm name is required"),
  address: z.string().min(1, "Address is required"),
  manager: z.string().min(1, "Manager name is required"),
})

export const assetCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
})

export const assetCheckoutSchema = z.object({
  assetId: z.string().min(1, "Asset ID is required"),
  userId: z.string().min(1, "User ID is required"),
  checkoutDate: z.date(),
  returnDate: z.date().optional(),
  status: z.enum(["checked-out", "returned"]),
  notes: z.string().optional(),
})

export const assetCheckoutCreateSchema = z.object({
  assetId: z.string().min(1, "Asset ID is required"),
  notes: z.string().optional(),
})

export const assetCheckoutReturnSchema = z.object({
  checkoutId: z.string().min(1, "Checkout ID is required"),
  notes: z.string().optional(),
})

export type RegisterFormData = z.infer<typeof registerSchema>
export type LoginFormData = z.infer<typeof loginSchema>
export type RoomFormData = z.infer<typeof roomSchema>
export type AssetFormData = z.infer<typeof assetSchema>
export type DormFormData = z.infer<typeof dormSchema>
export type AssetCategoryFormData = z.infer<typeof assetCategorySchema>
export type AssetCheckoutFormData = z.infer<typeof assetCheckoutSchema>
export type AssetCheckoutCreateFormData = z.infer<typeof assetCheckoutCreateSchema>
export type AssetCheckoutReturnFormData = z.infer<typeof assetCheckoutReturnSchema>
