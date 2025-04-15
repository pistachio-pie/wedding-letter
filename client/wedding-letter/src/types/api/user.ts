import { Role } from './common'

// Profile 객체 타입
// GET: api/users/profile 응답 타입
// GET: api/users/{id} 응답 타입
export interface Profile {
  id: number
  email: string
  name: string
  password?: string
  provider: string | null
  providerId: string | null
  refreshToken?: string
  isAdmin: boolean
  role: Role
  createdAt: string
  updatedAt: string
}
