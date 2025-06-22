import { createRootRoute, Outlet } from '@tanstack/react-router'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { PortalProvider } from '@/component/portal'
import { IconParkProvider } from '@/lib/iconpark/provider.tsx'

export const Route = createRootRoute({
  component: () => (
    <div className="size-full">
      <PortalProvider>
        <IconParkProvider jsUrl="https://lf1-cdn-tos.bytegoofy.com/obj/iconpark/icons_38682_3.dc72f7c01a1559afc0f3135939434c61.js" />
        <DndProvider backend={HTML5Backend}>
          <Outlet />
        </DndProvider>
      </PortalProvider>
      {/*{process.env.NODE_ENV === NodeEnv.Development && <TanStackRouterDevtools/>}*/}
    </div>
  ),
})
