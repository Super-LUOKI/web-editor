import { ComponentPropsWithoutRef, useState } from 'react'

import { useZustand } from '@/common/hook/use-zustand'
import { TimelineTrackClip } from '@/feature/editor/block/timeline/timeline-track-clip.tsx'
import { ResizeWrapper } from '@/feature/editor/component/resize-wrapper.tsx'
import { useDraftManager } from '@/feature/editor/context/draft-manager.tsx'
import { useTimelineViewController } from '@/feature/editor/context/timeline-view-controller.tsx'
import { getElementData } from '@/feature/editor/util/draft.ts'

type FreeTrackClipProps = Omit<ComponentPropsWithoutRef<typeof TimelineTrackClip>, 'style'>

const RESIZE_HANDLER_WIDTH = 4

export function FreeTrackClip(props: FreeTrackClipProps) {
  const { clip, ...rest } = props
  const draftManager = useDraftManager()
  const vc = useTimelineViewController()
  const pixelPerSecond = useZustand(vc.store, s => s.pixelPerSecond)
  const draftEl = useZustand(draftManager.store, s => getElementData(s.draft, clip.elementId))

  const [innerRange, setInnerRange] = useState<{ start: number; width: number } | undefined>(
    undefined
  )

  const getPixelRange = (leftOffset: number, rightOffset: number) => {
    const newestDraftEl = draftManager.getElement(clip.elementId)
    if (!newestDraftEl) return
    const pixelPerFrame = pixelPerSecond / draftManager.fps
    const newLeftOffset = Math.round(leftOffset / pixelPerFrame) * pixelPerFrame
    const newRightOffset = Math.round(rightOffset / pixelPerFrame) * pixelPerFrame
    const start = newestDraftEl.start * pixelPerSecond + newLeftOffset
    const width = newestDraftEl.length * pixelPerSecond - newLeftOffset + newRightOffset

    if (start < 0 || width <= RESIZE_HANDLER_WIDTH) return
    return {
      start,
      width,
    }
  }

  if (!draftEl) return null

  return (
    <ResizeWrapper
      className="absolute"
      style={{
        height: 'calc(100% - 4px)',
        left: `${innerRange?.start || draftEl.start * pixelPerSecond}px`,
        top: 2,
      }}
      leftHandler={<div className=" h-full" style={{ width: RESIZE_HANDLER_WIDTH }}></div>}
      rightHandler={<div className=" h-full" style={{ width: RESIZE_HANDLER_WIDTH }}></div>}
      onResizing={(left, right) => {
        const pixelRange = getPixelRange(left, right)
        if (!pixelRange) return
        setInnerRange(getPixelRange(left, right))
      }}
      onResizeComplete={(left, right) => {
        const pixelRange = getPixelRange(left, right)
        if (!pixelRange) return
        const start = pixelRange.start / pixelPerSecond
        const length = pixelRange.width / pixelPerSecond
        draftManager.updateElement(draftEl.id, { start, length })
        setInnerRange(undefined)
      }}
    >
      <div
        style={{
          overflow: 'hidden',
          boxSizing: 'border-box',
          width: `${innerRange?.width || draftEl.length * pixelPerSecond}px`,
          height: '100%',
        }}
      >
        <TimelineTrackClip className="size-full" clip={clip} {...rest} />
      </div>
    </ResizeWrapper>
  )
}
