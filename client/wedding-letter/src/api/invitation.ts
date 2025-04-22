// 초대장 관련 api 함수

import { InvitationDetailRequest, InvitationDetail, InvitationInList } from '@/types/api/invitation'
import { Params } from '@/types/api/common'
import { apiClient } from './index'
import { ListResponse, SingleResponse } from '@/types/api/common'

export const invitationApi = {
  // ADMIN ONLY: 모든 초대장 조회 - O
  getInvitations: async (params: Params): Promise<ListResponse<InvitationInList>> => {
    return await apiClient.get('/api/invitation', { params })
  },

  // 유저 당 1개: 초대장 생성 - O
  createInvitation: async (data: InvitationDetailRequest): Promise<SingleResponse<InvitationDetail>> => {
    return await apiClient.post('/api/invitation', data)
  },

  // 특정 사용자의 초대장 조회 - O
  getInvitationsByUserId: async (userId: number, params: Params): Promise<ListResponse<InvitationInList>> => {
    return await apiClient.get(`/api/invitation/user/${userId}`, { params })
  },

  // 특정 초대장 조회(전체 정보 포함) - O
  getInvitationById: async (id: number): Promise<SingleResponse<InvitationDetail>> => {
    return await apiClient.get(`/api/invitation/${id}`)
  },

  // 초대장 수정(전체 정보 포함) - O
  updateInvitation: async (id: number, data: InvitationDetailRequest): Promise<SingleResponse<InvitationDetail>> => {
    return await apiClient.put(`/api/invitation/${id}`, data)
  },

  // 초대장 소프트 삭제 (데이터 보존) - O
  softDeleteInvitation: async (id: number): Promise<SingleResponse<null>> => {
    return await apiClient.delete(`/api/invitation/${id}`)
  },

  // ADMIN ONLY: 초대장 영구 삭제 - O
  hardDeleteInvitation: async (id: number): Promise<SingleResponse<null>> => {
    return await apiClient.delete(`/api/invitation/${id}/hard`)
  },

  // ADMIN ONLY: 초대장 복구 - O
  restoreInvitation: async (id: number): Promise<SingleResponse<InvitationDetail>> => {
    return await apiClient.put(`/api/invitation/${id}/restore`)
  },

  // ADMIN ONLY: 삭제된 초대장 목록 조회 - O
  getDeletedInvitations: async (params: Params): Promise<ListResponse<InvitationInList>> => {
    return await apiClient.get('/api/invitation/deleted', { params })
  },
}
