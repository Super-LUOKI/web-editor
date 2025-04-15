import {
  createRootRoute, Outlet
} from '@tanstack/react-router'

import { IconParkProvider } from "@/lib/iconpark/provider.tsx";


export const Route = createRootRoute({
  component: () => (
    <div className='size-full'>
      <IconParkProvider jsUrl='https://lf1-cdn-tos.bytegoofy.com/obj/iconpark/icons_38682_2.e82ab10056bc9aa293bbd2a14cddf985.js'/>
      <Outlet/>
      {/*{process.env.NODE_ENV === NodeEnv.Development && <TanStackRouterDevtools/>}*/}
    </div>
  ),
})