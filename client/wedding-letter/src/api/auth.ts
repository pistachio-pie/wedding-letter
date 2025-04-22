// 인증 api 관련 함수
// 추후 리프레시 토큰 관련 api 추가 필요

import { AdminRequest, AdminResponse } from '@/types/api/auth'
import { apiClient } from './index'
import { SingleResponse } from '@/types/api/common'

export const authApi = {
  // 관리자 계정 생성
  registAdmin: async (requestData: AdminRequest): Promise<SingleResponse<AdminResponse>> => {
    return await apiClient.post('/api/auth/admin/register', requestData)
  },

  // 관리자 계정 로그인
  loginAdmin: async (requestData: AdminRequest): Promise<SingleResponse<AdminResponse>> => {
    return await apiClient.post('/api/auth/admin/login', requestData)
  },

  // 관리자 로그아웃
  logout: async (): Promise<SingleResponse<null>> => {
    return await apiClient.post('/api/auth/logout')
  },

  // 카카오 로그아웃
  logoutKakao: async (): Promise<SingleResponse<null>> => {
    return await apiClient.post('/api/auth/kakao/logout')
  },
}
