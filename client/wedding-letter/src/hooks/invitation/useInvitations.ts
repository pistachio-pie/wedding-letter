import { invitationApi } from '@/api/invitation'
import { Params } from '@/types/api/common'
import useSWR from 'swr'

export function useInvitations(params: Params) {
  return useSWR(['invitations', params], () => invitationApi.getInvitations(params))
}

export function useInvitationsByUserId(userId: number | null, params: Params) {
  return useSWR(
    ['invitationsByUserId', userId, params],
    userId ? () => invitationApi.getInvitationsByUserId(userId, params) : null,
  )
}

export function useDeletedInvitations(params: Params) {
  return useSWR(['deletedInvitations', params], () => invitationApi.getDeletedInvitations(params))
}
