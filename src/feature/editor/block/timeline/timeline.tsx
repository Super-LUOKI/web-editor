import { useState } from 'react'
import { useZustand } from 'use-zustand'

import { HEADER_WIDTH } from '@/feature/editor/block/timeline/constant.ts'
import { TimelineAction } from '@/feature/editor/block/timeline/timeline-action.tsx'
import { TimelineViewController } from '@/feature/editor/block/timeline/timeline-view-controller.ts'
import { TimeIndicator } from '@/feature/editor/block/timeline/track/time-indicator.tsx'
import { TimeRuler } from '@/feature/editor/block/timeline/track/time-ruler.tsx'
import { TimelineTrack } from '@/feature/editor/block/timeline/track/timeline-track.tsx'
import { useDraftManager } from '@/feature/editor/context/draft-manager.tsx'
import { TimelineViewControllerProvider } from '@/feature/editor/context/timeline-view-controller.tsx'
import { trackPriorityMap } from '@/lib/remotion/editor-render/constant.ts'

export function TimelineContent() {
  const draftManager = useDraftManager()

  const tracks = useZustand(draftManager.store, s => s.draft.timeline.tracks)

  return (
    <div className="w-full border-t-[1px] border-t-gray-100 ">
      <TimelineAction />
      <div className="w-full overflow-x-scroll bg-gray-50" style={{ paddingLeft: HEADER_WIDTH }}>
        <TimeRuler>
          <TimeIndicator />
          {[...tracks]
            .sort((a, b) => trackPriorityMap[a.type] - trackPriorityMap[b.type])
            .map(track => (
              <TimelineTrack key={track.id} trackId={track.id} />
            ))}
        </TimeRuler>
      </div>
    </div>
  )
}

export function Timeline() {
  const [vc] = useState(new TimelineViewController())
  return (
    <TimelineViewControllerProvider value={vc}>
      <TimelineContent />
    </TimelineViewControllerProvider>
  )
}
