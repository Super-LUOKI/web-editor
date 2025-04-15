import { TimelineAction } from "@/feature/editor/block/timeline/timeline-action.tsx";

export function Timeline(){
  return (
    <div className='w-full border-t-[1px] border-t-gray-100'>
      <TimelineAction/>
      <div>All Timelines</div>
    </div>
  )
}