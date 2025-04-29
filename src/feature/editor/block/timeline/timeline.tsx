import { useState } from "react";

import { TimeRuler } from "@/feature/editor/block/timeline/time-ruler.tsx";
import { TimelineAction } from "@/feature/editor/block/timeline/timeline-action.tsx";
import { TimelineViewController } from "@/feature/editor/block/timeline/timeline-view-controller.ts";
import { TimelineViewControllerProvider } from "@/feature/editor/context/timeline-view-controller.tsx";

export function TimelineContent() {
  return (
    <div className='w-full border-t-[1px] border-t-gray-100 '>
      <TimelineAction/>
      <div className='w-full overflow-x-scroll'>
        <TimeRuler/>
        <div>All Timelines</div>
      </div>
    </div>
  )
}

export function Timeline() {
  const [vc] = useState(new TimelineViewController())
  return (
    <TimelineViewControllerProvider value={vc}>
      <TimelineContent/>
    </TimelineViewControllerProvider>
  )
}