import {
  createRootRoute, Outlet
} from '@tanstack/react-router'


export const Route = createRootRoute({
  component: () => (
    <div className='size-full'>
      <Outlet/>
      {/*{process.env.NODE_ENV === NodeEnv.Development && <TanStackRouterDevtools/>}*/}
    </div>
  ),
})