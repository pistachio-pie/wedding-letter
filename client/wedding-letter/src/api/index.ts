// api 관련 공통 설정 및 인스턴스

import axios from 'axios'

export const BASE_URL = 'http://localhost:3000'

// axios 인스턴스 생성
export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})

// 응답 인터셉터 -> ?정확히 개념 모르겟음 대충 응답 데이터를 처리해주는거 같음
api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error),
)

// 커스텀 메서드 정의
export const apiClient = {
  get: <T>(url: string): Promise<T> => api.get<T>(url) as unknown as Promise<T>,
  post: <T>(url: string, data?: any): Promise<T> => api.post<T>(url, data) as unknown as Promise<T>,
  put: <T>(url: string, data?: any): Promise<T> => api.put<T>(url, data) as unknown as Promise<T>,
  delete: <T>(url: string): Promise<T> => api.delete<T>(url) as unknown as Promise<T>,
}

// api : axios 인스턴스 자체. 기본 axios 클라이언트. 인터셉터 적용
// apiClient : api 인스턴스에 대한 래퍼. 타입 안정성 제공. 각 메서드에 대한 명시적인 타입 캐스팅을 적용하여 타입 문제 해결.
