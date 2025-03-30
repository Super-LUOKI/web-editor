import { createFileRoute } from '@tanstack/react-router'

import { SideBarLayout } from "@/common/component/side-bar-layout.tsx";
import { HomePage } from "@/feature/home/page/home-page.tsx";

export const Route = createFileRoute('/home/')({ component: RouteComponent, })


function RouteComponent() {
  return (
    <SideBarLayout>
      <HomePage/>
    </SideBarLayout>
  )
}