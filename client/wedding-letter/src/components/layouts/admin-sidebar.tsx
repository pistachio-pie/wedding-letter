'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Hammer, Home, Mails, Users } from 'lucide-react'
import Link from 'next/link'

const SIDEBAR_ITEMS = [
  {
    title: '관리자 홈',
    url: '/admin',
    icon: Hammer,
  },
  {
    title: '회원 관리',
    url: '/admin/user',
    icon: Users,
  },
  {
    title: '청첩장 관리',
    url: '/admin/letter',
    icon: Mails,
  },
  {
    title: 'Wedding Letter',
    url: '/',
    icon: Home,
  },
]

export default function AdminSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SIDEBAR_ITEMS.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
