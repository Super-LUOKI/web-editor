import { Link } from "@tanstack/react-router";
import clsx from "clsx";
import { PropsWithChildren } from "react";

import { Button } from "@/component/ui/button";

export function SideBarLayout(props: PropsWithChildren) {
  return (
    <div className='size-full flex'>
      <div className={clsx(
        'w-[280px] h-full shrink-0 border-0 border-r-[1px] border-solid border-black/10 bg-[#fafafa]',
        'flex flex-col gap-2 p-4'
      )}>
        <Link
          to='/home'
        >
          <Button>Create</Button>
        </Link>
        <Link
          to='/projects'
        >
          <Button>Project</Button>
        </Link>
      </div>
      <div className='flex-1 w-0 h-full'>{props.children}</div>
    </div>
  )
}