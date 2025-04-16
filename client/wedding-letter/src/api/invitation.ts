// 초대장 관련 api 함수

import { ArrayResponse } from '@/types/api/common'
import { InvitationObject, InvitationParams } from '@/types/api/invitation'
import { apiClient } from './index'

export const invitationApi = {
  // 모든 초대장 조회
  getInvitations: async (params: InvitationParams): Promise<ArrayResponse<InvitationObject>> => {
    return await apiClient.get('/api/invitation', { params })
  },

  // 특정 초대장 조회
  getInvitation: async (id: number): Promise<InvitationObject> => {
    return await apiClient.get(`/api/invitation/${id}`)
  },

  // 특정 사용자의 초대장 조회
  getInvitationsByUserId: async (
    userId: number,
    params: InvitationParams,
  ): Promise<ArrayResponse<InvitationObject>> => {
    return await apiClient.get(`/api/invitation/user/${userId}`, { params })
  },

  // 초대장 생성(계좌정보, 갤러리 포함)
  createInvitation: async (data: InvitationObject): Promise<InvitationObject> => {
    return await apiClient.post('/api/invitation', data)
  },

  // 초대장 수정
  updateInvitation: async (id: number, data: InvitationObject): Promise<InvitationObject> => {
    return await apiClient.put(`/api/invitation/${id}`, data)
  },

  // 초대장 삭제
  deleteInvitation: async (id: number): Promise<void> => {
    return await apiClient.delete(`/api/invitation/${id}`)
  },
}
