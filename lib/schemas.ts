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

export const resetPasswordSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    otpCode: z.string().length(6, "OTP code must be 6 digits"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ["passwordConfirm"],
  })

export const roomSchema = z.object({
  name: z.string().min(1, "Room name is required"),
  lengthM: z.coerce.number().min(0.1, "Length must be at least 0.1 meters").max(100, "Length must be less than 100 meters"),
  widthM: z.coerce.number().min(0.1, "Width must be at least 0.1 meters").max(100, "Width must be less than 100 meters"),
  doorPosition: z.string().optional(),
  doorWidthCm: z.coerce.number().min(0).optional().or(z.literal("")),
  windowPosition: z.string().optional(),
  windowWidthCm: z.coerce.number().min(0).optional().or(z.literal("")),
  powerOutletPositions: z.array(z.string()).optional(),
  photoUrl: z.string().optional(),
  notes: z.string().optional(),
})

export const assetSchema = z.object({
  roomId: z.number().min(1, "Room is required"),
  name: z.string().min(1, "Asset name is required"),
  category: z.string().optional(),
  photoUrl: z.string().optional(),
  lengthCm: z.coerce.number().min(1, "Length must be at least 1 cm"),
  widthCm: z.coerce.number().min(1, "Width must be at least 1 cm"),
  heightCm: z.coerce.number().min(1, "Height must be at least 1 cm"),
  clearanceFrontCm: z.coerce.number().min(0).default(0),
  clearanceSidesCm: z.coerce.number().min(0).default(0),
  clearanceBackCm: z.coerce.number().min(0).default(0),
  functionZone: z.string().optional(),
  mustBeNearWall: z.boolean().default(false),
  mustBeNearWindow: z.boolean().default(false),
  mustBeNearOutlet: z.boolean().default(false),
  canRotate: z.boolean().default(true),
  cannotAdjacentTo: z.array(z.number()).optional(),
  purchaseDate: z.string().optional(),
  purchasePrice: z.coerce.number().min(0).optional().or(z.literal("")),
  condition: z.string().optional(),
  notes: z.string().optional(),
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
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
export type RoomFormData = z.infer<typeof roomSchema>
export type AssetFormData = z.infer<typeof assetSchema>
export type DormFormData = z.infer<typeof dormSchema>
export type AssetCategoryFormData = z.infer<typeof assetCategorySchema>
export type AssetCheckoutFormData = z.infer<typeof assetCheckoutSchema>
export type AssetCheckoutCreateFormData = z.infer<typeof assetCheckoutCreateSchema>
export type AssetCheckoutReturnFormData = z.infer<typeof assetCheckoutReturnSchema>
