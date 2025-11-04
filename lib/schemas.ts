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
  Name: z.string().min(1, "Room name is required"),
  LengthM: z.coerce.number().min(0.1, "Length must be at least 0.1 meters").max(100, "Length must be less than 100 meters"),
  WidthM: z.coerce.number().min(0.1, "Width must be at least 0.1 meters").max(100, "Width must be less than 100 meters"),
  DoorPosition: z.string().optional(),
  DoorWidthCm: z.coerce.number().min(0).optional().or(z.literal("")),
  WindowPosition: z.string().optional(),
  WindowWidthCm: z.coerce.number().min(0).optional().or(z.literal("")),
  PowerOutletPositions: z.array(z.string()).optional(),
  PhotoUrl: z.string().optional(),
  Notes: z.string().optional(),
})

export const assetSchema = z.object({
  RoomId: z.number().min(1, "Room is required"),
  Name: z.string().min(1, "Asset name is required"),
  Category: z.string().optional(),
  PhotoUrl: z.string().optional(),
  LengthCm: z.coerce.number().min(1, "Length must be at least 1 cm"),
  WidthCm: z.coerce.number().min(1, "Width must be at least 1 cm"),
  HeightCm: z.coerce.number().min(1, "Height must be at least 1 cm"),
  ClearanceFrontCm: z.coerce.number().min(0).default(0),
  ClearanceSidesCm: z.coerce.number().min(0).default(0),
  ClearanceBackCm: z.coerce.number().min(0).default(0),
  FunctionZone: z.string().optional(),
  MustBeNearWall: z.boolean().default(false),
  MustBeNearWindow: z.boolean().default(false),
  MustBeNearOutlet: z.boolean().default(false),
  CanRotate: z.boolean().default(true),
  CannotAdjacentTo: z.array(z.number()).optional(),
  PurchaseDate: z.string().optional(),
  PurchasePrice: z.coerce.number().min(0).optional().or(z.literal("")),
  Condition: z.string().optional(),
  Notes: z.string().optional(),
})

export type RegisterFormData = z.infer<typeof registerSchema>
export type LoginFormData = z.infer<typeof loginSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
export type RoomFormData = z.infer<typeof roomSchema>
export type AssetFormData = z.infer<typeof assetSchema>
