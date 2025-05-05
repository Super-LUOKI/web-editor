import { useZustand } from '@/common/hook/use-zustand.ts'
import { useTimelineViewController } from '@/feature/editor/context/timeline-view-controller.tsx'
import { AllElement } from '@/lib/remotion/editor-render/schema/element.ts'
import { cn } from '@/lib/shadcn/util.ts'

type TrackClipPlaceholderProps = React.HTMLAttributes<HTMLDivElement> &
  Pick<AllElement, 'start' | 'length'> & {
    allow?: boolean
  }

export function TrackClipPlaceholder(props: TrackClipPlaceholderProps) {
  const { className, allow = true, start, length, style, ...rest } = props
  const vc = useTimelineViewController()
  const pixelPerSecond = useZustand(vc.store, s => s.pixelPerSecond)
  return (
    <div
      className={cn(
        'rounded-lg flex items-center px-2 select-none overflow-hidden box-border',
        'border-[2px] border-dotted ',
        allow ? 'bg-cyan-400 border-cyan-700' : 'bg-red-400 border-r-red-600',
        className
      )}
      style={{
        position: 'absolute',
        width: `${length * pixelPerSecond}px`,
        height: 'calc(100% - 4px)',
        left: `${start * pixelPerSecond}px`,
        ...style,
      }}
      {...rest}
    ></div>
  )
}
