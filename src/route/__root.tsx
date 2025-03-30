import {
  createRootRoute, Outlet
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { SideBarLayout } from "@/common/component/side-bar-layout.tsx";

import { NodeEnv } from "../../config/env.ts";

export const Route = createRootRoute({
  component: () => (
    <div className='size-full'>
      <SideBarLayout>
        <Outlet/>
      </SideBarLayout>
      {process.env.NODE_ENV === NodeEnv.Development && <TanStackRouterDevtools/>}
    </div>
  ),
})