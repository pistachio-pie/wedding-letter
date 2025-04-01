import useSWR from 'swr'

import { fetcher } from '@/lib/fetcher.js'

interface User {
  id: string
  name: string
  email: string
}

function useUser(id: string) {
  const { data, error, isLoading } = useSWR<User>(`/api/user/${id}`, fetcher)

  return {
    user: data,
    isLoading,
    isError: error,
  }
}

//const { user, isLoading, isError } = useUser(userId) 사용할때
