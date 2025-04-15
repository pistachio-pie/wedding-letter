// 사용자 관련 api 함수

import { ArrayResponse } from '@/types/api/common'
import { Profile } from '@/types/api/user'
import { apiClient } from './index'

export const usersApi = {
  // 현재 사용자 정보 조회(쿠키토큰 사용)
  getUser: async (): Promise<Profile> => {
    return await apiClient.get('/api/users/profile')
  },

  // 전체 사용자 조회
  getUsers: async (): Promise<ArrayResponse<Profile>> => {
    return await apiClient.get('/api/users')
  },

  // 특정 사용자 조회(id 기준)
  getUserById: async (id: string): Promise<Profile> => {
    return await apiClient.get(`/api/users/${id}`)
  },

  // 특정 사용자 조회(id 기준)
  getUsersForAdmin: async (): Promise<ArrayResponse<Profile>> => {
    return await apiClient.get(`/api/users/admin/all`)
  },
}
