import { Role } from './common'

// 기본 사용자 프로필
export interface Profile {
  id: number
  email: string
  name: string
  provider: string | null
  providerId: string | null
  refreshToken?: string
  role: Role
  createdAt: string
  updatedAt: string
}
