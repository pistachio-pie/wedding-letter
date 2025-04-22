'use client'

import { invitationApi } from '@/api/invitation'
import useSWR from 'swr'

export function useInvitation(id: number | null) {
  return useSWR(id ? ['invitationById', id] : null, () => (id ? invitationApi.getInvitationById(id) : null))
}
