import { useZustand } from 'use-zustand'

import { HEADER_WIDTH } from '@/feature/editor/block/timeline/constant.ts'
import { FreeTrackClip } from '@/feature/editor/block/timeline/free-track-clip.tsx'
import { useDraftManager } from '@/feature/editor/context/draft-manager.tsx'
import { getDraftTrack } from '@/feature/editor/util/draft.ts'
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
  const track = useZustand(draftManager.store, s => getDraftTrack(s.draft, trackId))

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
        {track.clips.map((clip, index) => (
          <FreeTrackClip key={index} clip={clip} />
        ))}
      </div>
    </div>
  )
}
