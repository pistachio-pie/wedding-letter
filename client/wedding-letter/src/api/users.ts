// 사용자 관련 api 함수

import { ListResponse, SingleResponse } from '@/types/api/common'
import { Profile } from '@/types/api/user'
import { apiClient } from './index'

export const usersApi = {
  // 현재 사용자 정보 조회(쿠키토큰 사용)
  getUser: async (): Promise<SingleResponse<Profile>> => {
    return await apiClient.get('/api/users/profile')
  },

  // ADMIN ONLY: 전체 사용자 조회
  getUsers: async (): Promise<ListResponse<Profile>> => {
    return await apiClient.get('/api/users')
  },

  // ADMIN ONLY: 특정 사용자 조회(id 기준)
  getUserById: async (id: string): Promise<SingleResponse<Profile>> => {
    return await apiClient.get(`/api/users/${id}`)
  },
}
