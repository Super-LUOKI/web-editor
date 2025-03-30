import { createFileRoute } from '@tanstack/react-router'

import { HomeLayout } from "@/common/component/home-layout.tsx";
import { HomePage } from "@/feature/home/page/home-page.tsx";

export const Route = createFileRoute('/home/')({ component: RouteComponent, })


function RouteComponent() {
  return (
    <HomeLayout>
      <HomePage/>
    </HomeLayout>
  )
}