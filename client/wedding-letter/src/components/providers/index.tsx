// 모든 프로바이더 모음
'use client'

import { AuthProvider } from './AuthProvider'
import { SWRProvider } from './SWRProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SWRProvider>
      <AuthProvider>{children}</AuthProvider>
    </SWRProvider>
  )
}
