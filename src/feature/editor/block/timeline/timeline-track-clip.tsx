import { useZustand } from 'use-zustand'

import { useEditorManager } from '@/feature/editor/context/editor-manager.tsx'
import { RenderTrackClip } from '@/lib/remotion/editor-render/schema/track.ts'
import { cn } from '@/lib/shadcn/util.ts'

type TrackClipProps = React.HTMLAttributes<HTMLDivElement> & {
  clip: RenderTrackClip
}

export function TimelineTrackClip(props: TrackClipProps) {
  const { className, clip, ...rest } = props
  const editorManager = useEditorManager()
  const selectedElementId = useZustand(editorManager.store, s => s.selectedElementId)
  return (
    <div
      className={cn(
        'rounded-lg h-full duration-100 flex items-center px-2',
        'border-[2px] border-solid border-gray-300 hover:border-cyan-700/80',
        selectedElementId === clip.elementId && 'border-cyan-700/80',
        className
      )}
      {...rest}
    >
      {clip.elementId}
    </div>
  )
}
