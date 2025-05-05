import { useZustand } from 'use-zustand'

import { useEditorManager } from '@/feature/editor/context/editor-manager.tsx'
import { RenderTrackClip } from '@/lib/remotion/editor-render/schema/track.ts'
import { cn } from '@/lib/shadcn/util.ts'

type TrackClipProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> & {
  clip: RenderTrackClip
}

export function TimelineTrackClip(props: TrackClipProps) {
  const { className, clip, style, ...rest } = props
  const editorManager = useEditorManager()
  const selectedElementId = useZustand(editorManager.store, s => s.selectedElementId)
  return (
    <div
      className={cn(
        'rounded-lg flex items-center px-2 select-none overflow-hidden box-border',
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
      {clip.elementId}
    </div>
  )
}
