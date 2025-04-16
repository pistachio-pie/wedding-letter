'use client'

import { invitationApi } from '@/api/invitation'
import { useStore } from '@/store'
import { ArrayResponse } from '@/types/api/common'
import { InvitationObject } from '@/types/api/invitation'
import { useState } from 'react'
import useSWR from 'swr'

export function useInvitation(id: number | null) {}
