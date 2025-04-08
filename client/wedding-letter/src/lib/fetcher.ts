import { api } from '@/api'

export const fetcher = (url: string) => api.get(url)

// ?fetcher 역할에 대해 잘 모르겟음
