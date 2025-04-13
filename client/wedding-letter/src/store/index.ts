// 모든 스토어 export, 통합 내보내기
'use client'

import useStore from './useStore'
export { default as useStore } from './useStore'
export type { StoreState } from './useStore'

// 스토어에 따른 편의성 훅 제공
export const useAuthStore = () => useStore((state) => state.auth)
export const useUserStore = () => useStore((state) => state.user)

// 로그아웃 커스텀 훅
export const useLogout = () => {
  return () => {
    const logout = useStore.getState().auth.logout
    const setUser = useStore.getState().user.setUser

    logout()
    setUser(null)
  }
}

// 자주 사용하는 상태나 액션에 대한 단축 훅
// 추후 필요 시
// export const useIsLoggedIn = () => useStore(state => state.auth.isAuthenticated);
