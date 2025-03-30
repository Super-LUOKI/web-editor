import { PropsWithChildren } from "react";

export function HomeLayout(props: PropsWithChildren) {
  return (
    <div className='size-full flex'>
      <div className='w-[280px] h-full shrink-0 border-0 border-r-[1px] border-solid border-black/10'></div>
      <div className='flex-1 w-0 h-full'>{props.children}</div>
    </div>
  )
}