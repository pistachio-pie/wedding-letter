// 인증(토큰) 관리자 관련 슬라이스
// 프론트에서 토큰 저장 필요없음 -> 알아서 쿠키에 저장됨
// access-token, refresh_token 두개 저장

// isAuthenticated: 로그인(토큰 있음) 여부
// isAdmin: 관리자 계정 여부

import { StateCreator } from 'zustand'
import { StoreState } from '../useStore'
import { removeTokens } from '@/lib/auth'

export interface AuthSlice {
  auth: {
    isAuthenticated: boolean
    isAdmin: boolean
    setAuthenticated: (value: boolean) => void
    setAdmin: (value: boolean) => void
    logout: () => void
  }
}

export const authSlice: StateCreator<StoreState, [], [], AuthSlice> = (set) => ({
  auth: {
    isAuthenticated: false,
    isAdmin: false,
    setAuthenticated: (value: boolean) =>
      set((state: StoreState) => ({
        auth: { ...state.auth, isAuthenticated: value },
      })),
    setAdmin: (value: boolean) =>
      set((state: StoreState) => ({
        auth: { ...state.auth, isAdmin: value },
      })),
    logout: () => {
      set((state: StoreState) => ({
        auth: { ...state.auth, isAuthenticated: false, isAdmin: false },
      })),
        removeTokens()
    },
  },
})
