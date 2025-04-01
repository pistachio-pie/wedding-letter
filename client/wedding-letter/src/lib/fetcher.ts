import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

export const fetcher = async <T>(url: string) => {
  try {
    const response = await axiosInstance.get<T>(url)
    return response.data
  } catch (error) {
    throw error
  }
}
