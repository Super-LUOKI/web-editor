import { cn } from "@/lib/shadcn/util.ts";

type TimelineActionProps = {
    className?: string
}

export function TimelineAction(props: TimelineActionProps) {
  const { className } = props
  return (
    <div
      className={cn('w-full h-[48px] border-b-[1px] border-b-gray-100 flex justify-between items-center px-3', className)}>
      <div>Left Actions</div>
      <div>Play Actions</div>
      <div>Slide Actions</div>
    </div>
  )
}