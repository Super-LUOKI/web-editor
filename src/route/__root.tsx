import {
  createRootRoute, Outlet
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { NodeEnv } from "../../config/env.ts";


export const Route = createRootRoute({
  component: () => (
    <div className='size-full'>
      <Outlet/>
      {process.env.NODE_ENV === NodeEnv.Development && <TanStackRouterDevtools/>}
    </div>
  ),
})