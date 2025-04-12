import AdminSidebar from '@/components/layouts/admin-sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className='w-full p-4'>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}
