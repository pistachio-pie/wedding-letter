// 인증 api 관련 함수
// 추후 리프레시 토큰 관련 api 추가 필요

import { AdminRequest, AdminResponse } from '@/types/api/auth'
import { apiClient } from './index'

export const authApi = {
  // 관리자 계정 생성
  registAdmin: async (requestData: AdminRequest): Promise<AdminResponse> => {
    return await apiClient.post('/api/auth/admin/register', requestData)
  },

  // 관리자 계정 로그인
  loginAdmin: async (requestData: AdminRequest): Promise<AdminResponse> => {
    return await apiClient.post('/api/auth/admin/login', requestData)
  },

  // 로그아웃 (아직 api 없음)
  logout: async () => {
    return await apiClient.post('/api/auth/logout')
  },
}
