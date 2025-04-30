import { useZustand } from 'use-zustand'

import { HEADER_WIDTH } from '@/feature/editor/block/timeline/constant.ts'
import { TimelineTrackClip } from '@/feature/editor/block/timeline/timeline-track-clip.tsx'
import { useDraftManager } from '@/feature/editor/context/draft-manager.tsx'
import { useTimelineViewController } from '@/feature/editor/context/timeline-view-controller.tsx'
import { getDraftTrack, getElementData } from '@/feature/editor/util/draft.ts'
import { RenderTrack } from '@/lib/remotion/editor-render/schema/track.ts'
import { cn } from '@/lib/shadcn/util.ts'

const trackTitleMap: Record<RenderTrack['type'], string> = {
  ['caption']: 'Caption',
  ['voiceover']: 'Voiceover',
  ['audio']: 'Audio',
  ['text']: 'Text',
  ['image-video']: 'Media',
}

type TimelineTrackProps = {
  trackId: string
}

export function TimelineTrack(props: TimelineTrackProps) {
  const { trackId } = props
  const draftManager = useDraftManager()
  const vc = useTimelineViewController()
  const track = useZustand(draftManager.store, s => getDraftTrack(s.draft, trackId))
  const pixelPerSecond = useZustand(vc.store, s => s.pixelPerSecond)

  if (!track) {
    console.error('Track not found:', trackId)
    return
  }
  return (
    <div className={cn('w-full h-[38px] border-b-[1px] border-dashed border-gray-200 relative')}>
      <div
        className={cn(
          'absolute left-0 top-0 -translate-x-full bg-gray-200 h-full rounded-md flex justify-center items-center',
          'text-sm text-gray-800'
        )}
        style={{ width: HEADER_WIDTH - 8, marginLeft: -8 }}
      >
        {trackTitleMap[track.type]}
      </div>
      <div className="w-full h-full relative flex items-center">
        {track.clips.map(clip => {
          const el = getElementData(draftManager.draft, clip.elementId)
          if (!el) return null
          const { start, length } = el
          return (
            <TimelineTrackClip
              className={cn('absolute')}
              clip={clip}
              style={{
                left: `${start * pixelPerSecond}px`,
                top: 2,
                width: `${length * pixelPerSecond}px`,
                height: 'calc(100% - 4px)',
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
