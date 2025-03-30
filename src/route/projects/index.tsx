import { createFileRoute } from '@tanstack/react-router'

import { SideBarLayout } from "@/common/component/side-bar-layout.tsx";
import { ProjectPage } from "@/feature/home/page/project-page.tsx";

export const Route = createFileRoute('/projects/')({ component: RouteComponent, })

function RouteComponent() {
  return <SideBarLayout><ProjectPage/></SideBarLayout>
}
