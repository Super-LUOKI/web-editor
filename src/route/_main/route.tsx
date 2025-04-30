import { createFileRoute, Outlet } from '@tanstack/react-router'

import { SideBarLayout } from '@/common/component/side-bar-layout.tsx'

export const Route = createFileRoute('/_main')({ component: RouteComponent })

function RouteComponent() {
  return (
    <SideBarLayout>
      <Outlet />
    </SideBarLayout>
  )
}
