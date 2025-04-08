// 인증/로그인 관련 스토어
// 프론트에서 토큰 저장 필요없음 -> 알아서 쿠키에 저장됨
// access-token, refresh_token 두개 저장

import { User } from '@/types/api'
import { create } from 'zustand'

interface AuthState {
  isAuthenticated: boolean
  user: User | null

  // actions
  setAuthenticated: (value: boolean) => void
  setUser: (user: User | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,

  setAuthenticated: (value: boolean) => set({ isAuthenticated: value }),
  setUser: (user) => set({ user }),
  logout: () => set({ isAuthenticated: false, user: null }),
  // 필요시 서버에 로그아웃 요청
}))
