import { useState } from 'react'
import { useZustand } from 'use-zustand'

import { PortalTarget, PortalProvider } from '@/component/portal'
import { TimelineAction } from '@/feature/editor/block/timeline/timeline-action.tsx'
import { TimelineViewController } from '@/feature/editor/block/timeline/timeline-view-controller.ts'
import { TimeIndicator } from '@/feature/editor/block/timeline/track/time-indicator.tsx'
import { TimeRuler } from '@/feature/editor/block/timeline/track/time-ruler.tsx'
import { TimelineTrack } from '@/feature/editor/block/timeline/track/timeline-track.tsx'
import { useDraftManager } from '@/feature/editor/context/draft-manager.tsx'
import { TimelineViewControllerProvider } from '@/feature/editor/context/timeline-view-controller.tsx'

export function TimelineContent() {
  const draftManager = useDraftManager()

  const tracks = useZustand(draftManager.store, s => s.draft.timeline.tracks)

  return (
    <div className="w-full border-t-[1px] border-t-gray-100 flex-col">
      <TimelineAction />
      <div className="w-full flex bg-gray-50">
        <div></div>
        <div className="pt-[15px] flex flex-col">
          {tracks.map(track => (
            <PortalTarget key={track.id} targetId={track.id} />
          ))}
        </div>
        <div className="w-0 flex-1 overflow-x-scroll ">
          <TimeRuler>
            <TimeIndicator />
            {[...tracks]
              .sort((a, b) => a.order - b.order)
              .map(track => (
                <TimelineTrack key={track.id} trackId={track.id} />
              ))}
          </TimeRuler>
        </div>
      </div>
    </div>
  )
}

export function Timeline() {
  const draftManager = useDraftManager()
  const [vc] = useState(new TimelineViewController(draftManager))
  return (
    <TimelineViewControllerProvider value={vc}>
      <TimelineContent />
    </TimelineViewControllerProvider>
  )
}
