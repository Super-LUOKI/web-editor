import { Link, useRouterState } from "@tanstack/react-router";
import clsx from "clsx";
import { PropsWithChildren } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/component/ui/avatar.tsx";
import { cn } from "@/lib/shadcn/util.ts";

type SidebarItem = {
    title: string;
    to: string;
}
const sidebarList: SidebarItem[] = [
  {
    title: 'Home',
    to: '/home'
  },
  {
    title: 'Projects',
    to: '/project'
  }
]


export function SideBarLayout(props: PropsWithChildren) {
  const routerState = useRouterState()
  return (
    <div className='size-full flex'>
      <div className={clsx(
        'w-[280px] h-full shrink-0 border-0 border-r-[1px] border-solid border-border bg-[#fafafa]',
        'flex flex-col gap-4 p-4'
      )}>
        <div className='flex items-center gap-2 cursor-pointer hover:bg-slate-200 p-2 rounded-lg duration-150'>
          <Avatar className='size-10'>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn"/>
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <div className='text-sm'>LuoKing</div>
            <div className='text-xs text-black/60'>luoking@example.com</div>
          </div>
        </div>

        <div className='flex flex-col gap-2'>
          {sidebarList.map(item => (
            <Link
              key={item.to}
              to={item.to}>
              <div
                className={cn('flex items-center h-[46px] p-3 rounded-lg text-sm',
                  'duration-150 hover:bg-slate-200',
                  routerState.location.pathname.startsWith(item.to) && 'bg-slate-200'
                )}
              >{item.title}
              </div>
            </Link>
          ))}
        </div>

      </div>
      <div className='flex-1 w-0 h-full overflow-y-auto'>{props.children}</div>
    </div>
  )
}