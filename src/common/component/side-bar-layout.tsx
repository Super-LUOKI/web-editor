import { Link } from "@tanstack/react-router";
import clsx from "clsx";
import { PropsWithChildren } from "react";

export function SideBarLayout(props: PropsWithChildren) {
  return (
    <div className='size-full flex'>
      <div className={clsx(
        'w-[280px] h-full shrink-0 border-0 border-r-[1px] border-solid border-black/10',
        'flex flex-col gap-2 p-4'
      )}>
        <Link
          className='flex justify-center items-center p-4 rounded-lg bg-purple-600 text-white hover:bg-purple-400 duration-150 cursor-pointer'
          to='/home'
        >Create</Link>
        <Link
          className='flex justify-center items-center p-4 rounded-lg bg-purple-600 text-white hover:bg-purple-400 duration-150 cursor-pointer'
          to='/projects'
        >Projects</Link>
      </div>
      <div className='flex-1 w-0 h-full'>{props.children}</div>
    </div>
  )
}