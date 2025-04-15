// 사용자 정보 관련 슬라이스
// user: 현재 로그인한 사용자 정보

import { Profile } from '@/types/api/user'
import { StateCreator } from 'zustand'
import { StoreState } from '../useStore'

export interface UserSlice {
  user: {
    user: Profile | null
    setUser: (user: Profile | null) => void
  }
}

export const userSlice: StateCreator<StoreState, [], [], UserSlice> = (set) => ({
  user: {
    user: null,
    setUser: (user: Profile | null) =>
      set((state: StoreState) => ({
        user: { ...state.user, user },
      })),
  },
})
