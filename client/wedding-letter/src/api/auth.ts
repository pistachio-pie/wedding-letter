// 인증 api 관련 함수

import { User } from '@/types/api'
import { api } from './index'

export const authApi = {
  // 현재 사용자 정보 조회
  getUser: async () => {
    return await api.get<User>('api/users/profile')
  },
  // 로그아웃 (아직 api 없음)
  logout: async () => {
    return await api.post('api/users/logout')
  },
}
