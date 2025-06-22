import lodash from 'lodash'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useZustand } from 'use-zustand'

import { useDraftManager } from '@/feature/editor/context/draft-manager'
import { useEditorManager } from '@/feature/editor/context/editor-manager.tsx'
import { useTimelineViewController } from '@/feature/editor/context/timeline-view-controller'
import { drawAudioWaveform, drawImageTimeFrame } from '@/feature/editor/util/view'
import { RenderTrackClip } from '@/lib/remotion/editor-render/schema/track.ts'
import { AllElementType } from '@/lib/remotion/editor-render/schema/util'
import { cn } from '@/lib/shadcn/util.ts'


type TrackClipProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> & {
  clip: RenderTrackClip
}

type ElementThumbnailProps = {
  elementId: string
}

function ImageThumbnail(props: ElementThumbnailProps) {
  const { elementId } = props
  const draftManager = useDraftManager()
  const vc = useTimelineViewController()
  const pixelPerSecond = useZustand(vc.store, s => s.pixelPerSecond)
  const element = useMemo(() => draftManager.getElement(elementId, 'image'), [elementId])
  const asset = useMemo(() => draftManager.getAsset(element.assetId, 'image'), [element.assetId])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const debounceDraw = useCallback(
    lodash.throttle(() => {
      if (!canvasRef.current) return
      drawImageTimeFrame(asset.src, canvasRef.current)
    }, 500),
    [asset.src]
  )

  useEffect(() => {
    debounceDraw()
  }, [asset.src, pixelPerSecond])

  return <canvas className="size-full" ref={canvasRef} />
}

function TextThumbnail(props: ElementThumbnailProps) {
  const { elementId } = props
  const draftManager = useDraftManager()
  const element = useMemo(() => draftManager.getElement(elementId, 'text'), [elementId])
  return (
    <div className="size-full px-2 box-border text-nowrap truncate flex items-center bg-cyan-500 text-white text-xs">
      {element.text}
    </div>
  )
}

function AudioThumbnail(props: ElementThumbnailProps) {
  const { elementId } = props
  const draftManager = useDraftManager()
  const vc = useTimelineViewController()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const pixelPerSecond = useZustand(vc.store, s => s.pixelPerSecond)

  const element = useMemo(() => draftManager.getElement(elementId, 'audio'), [elementId])
  const asset = useMemo(() => draftManager.getAsset(element.assetId, 'audio'), [element.assetId])

  const debounceDraw = useCallback(
    lodash.throttle(() => {
      if (!canvasRef.current) return
      drawAudioWaveform(asset.src, canvasRef.current, { color: '#f4ffb8' })
    }, 500),
    [asset.src]
  )

  useEffect(() => {
    debounceDraw()
  }, [asset.src, pixelPerSecond])

  return <canvas className="size-full bg-[#a0d911]" ref={canvasRef} />
}

const elementThumbnailRenderMap: Record<
  AllElementType,
  (props: ElementThumbnailProps) => React.ReactNode
> = {
  text: TextThumbnail,
  image: ImageThumbnail,
  audio: AudioThumbnail,
}

export function TimelineTrackClip(props: TrackClipProps) {
  const { className, clip, style, ...rest } = props
  const editorManager = useEditorManager()
  const draftManager = useDraftManager()
  const selectedElementId = useZustand(editorManager.store, s => s.selectedElementId)
  const clipElement = useMemo(() => draftManager.getElement(clip.elementId), [clip.elementId])

  return (
    <div
      className={cn(
        'size-full rounded-lg flex items-center select-none overflow-hidden box-border',
        'border-[2px] border-solid border-gray-300 hover:border-cyan-700/80',
        selectedElementId === clip.elementId && 'border-cyan-700/80',
        className
      )}
      onClick={() => {
        editorManager.selectElement(clip.elementId)
      }}
      style={{
        transition: 'border-color 0.15s ease-in-out',
        ...style,
      }}
      {...rest}
    >
      {elementThumbnailRenderMap[clipElement.type]({ elementId: clipElement.id })}
    </div>
  )
}
