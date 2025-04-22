'use client'

import { usersApi } from '@/api/users'
import useSWR from 'swr'

export function useUsers() {
  return useSWR(['users'], () => usersApi.getUsers())
}

export function useUserById(id: string) {
  return useSWR(['users', id], () => usersApi.getUserById(id))
}
