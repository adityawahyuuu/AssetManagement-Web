export interface User {
  id: string
  email: string
  fullName: string
  studentId: string
  dormName: string
  role?: "student" | "admin" | "manager"
  createdAt: Date
  updatedAt: Date
}

export interface RegisterFormData {
  email: string
  password: string
  confirmPassword: string
  fullName: string
  studentId: string
  dormName: string
}

export interface LoginFormData {
  email: string
  password: string
}
