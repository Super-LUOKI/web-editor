import { useState } from 'react'
import { useDrop } from 'react-dnd'
import { useZustand } from 'use-zustand'

import { HEADER_WIDTH } from '@/feature/editor/block/timeline/constant.ts'
import { FreeTrackClip } from '@/feature/editor/block/timeline/track/free-track-clip.tsx'
import { TrackClipPlaceholder } from '@/feature/editor/block/timeline/track/track-clip-placeholder.tsx'
import { useDraftManager } from '@/feature/editor/context/draft-manager.tsx'
import { useTimelineViewController } from '@/feature/editor/context/timeline-view-controller.tsx'
import { ClipDragItem, EditorDragType } from '@/feature/editor/util/constant.ts'
import { getDraftTrack } from '@/feature/editor/util/draft.ts'
import { AllElement } from '@/lib/remotion/editor-render/schema/element.ts'
import { RenderTrack } from '@/lib/remotion/editor-render/schema/track.ts'
import { cn } from '@/lib/shadcn/util.ts'

const trackTitleMap: Record<RenderTrack['type'], string> = {
  ['caption']: 'Caption',
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

  const [movingElement, setMovingElement] = useState<Pick<AllElement, 'id' | 'start' | 'length'>>({
    id: '',
    start: 0,
    length: 0,
  })

  const getMovingRange = (id?: string, offset?: number) => {
    if (typeof id === 'undefined' || typeof offset === 'undefined') return

    const draftEl = draftManager.getElement(id)
    if (!draftEl) return
    const start = draftManager.getNearestFrameTime(draftEl.start + offset / pixelPerSecond)
    const length = draftEl.length

    return { start, length }
  }

  const [{ isOver }, drop] = useDrop(() => ({
    accept: EditorDragType.Clip,
    drop: (item: ClipDragItem, monitor) => {
      if (!monitor.canDrop()) return
      const range = getMovingRange(item.elementId, monitor.getDifferenceFromInitialOffset()?.x)
      if (!range) return
      draftManager.updateElement(item.elementId, range)
      setMovingElement({ id: '', start: 0, length: 0 })
    },
    hover: (item: ClipDragItem, monitor) => {
      if (!monitor.isOver() || !monitor.canDrop()) return
      const range = getMovingRange(item.elementId, monitor.getDifferenceFromInitialOffset()?.x)
      if (!range) return
      setMovingElement({ ...range, id: item.elementId })
    },
    collect: monitor => ({ isOver: monitor.isOver() }),
  }))

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
      <div
        ref={elem => {
          if (elem) drop(elem)
        }}
        className="w-full h-full relative flex items-center"
      >
        {track.clips.map((clip, index) => (
          <FreeTrackClip
            key={index}
            clip={clip}
            className={cn(movingElement.id === clip.elementId && 'hidden')}
          />
        ))}
        {isOver && movingElement.id && (
          <TrackClipPlaceholder
            allow={true}
            start={movingElement.start}
            length={movingElement.length}
          />
        )}
      </div>
    </div>
  )
}
