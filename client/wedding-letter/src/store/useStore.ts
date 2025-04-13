// 메인 스토어
//실제 Zustand 스토어를 생성하고 각 슬라이스를 결합하는 핵심 파일

import { create } from 'zustand'
import { authSlice, AuthSlice } from './slices/authSlice'
import { UserSlice, userSlice } from './slices/userSlice'

export type StoreState = AuthSlice & UserSlice

const useStore = create<StoreState>((...args) => ({
  ...authSlice(...args),
  ...userSlice(...args),
}))

export default useStore
