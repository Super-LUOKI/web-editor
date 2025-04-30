import { Fragment, PropsWithChildren } from 'react'
import { useZustand } from 'use-zustand'

import { useDraftManager } from '@/feature/editor/context/draft-manager.tsx'
import { usePlayerManager } from '@/feature/editor/context/player-manager.tsx'
import { useTimelineViewController } from '@/feature/editor/context/timeline-view-controller.tsx'
import { cn } from '@/lib/shadcn/util.ts'

type RulerSection = { duration: number; count: number }
const rulerSections: RulerSection[] = [
  { duration: 0.1, count: 3 },
  { duration: 0.5, count: 5 },
  { duration: 1, count: 5 },
  { duration: 2, count: 4 },
  { duration: 5, count: 5 },
  { duration: 10, count: 5 },
  { duration: 30, count: 6 },
  { duration: 60, count: 6 },
  { duration: 120, count: 4 },
]

function getMatchedRulerSection(pixelPerSecond: number): RulerSection {
  const minDisplayedPixelWidth = 96
  const section = rulerSections.find(item => {
    return item.duration * pixelPerSecond > minDisplayedPixelWidth
  })
  return section ? section : (rulerSections.at(-1) as RulerSection)
}

export function TimeRuler(props: PropsWithChildren<{ className?: string }>) {
  const { className, children } = props
  const draftManager = useDraftManager()
  const playerManager = usePlayerManager()
  const vc = useTimelineViewController()

  const pixelPerSecond = useZustand(vc.store, s => s.pixelPerSecond)
  const duration = useZustand(draftManager.store, s => s.duration)
  const maxDuration = useZustand(vc.store, s => s.maxDuration)

  const maxDisplayDuration = Math.min(maxDuration, duration + 1)

  const section = getMatchedRulerSection(pixelPerSecond)

  return (
    <div
      ref={vc.setTimelineContentDomContainer.bind(vc)}
      className={cn('relative', className)}
      style={{ width: `${maxDisplayDuration * pixelPerSecond}px` }}
    >
      <div
        className="relative bg-gray-100 text-xs text-gray-800 flex items-center select-none h-[15px]"
        onPointerDown={e => {
          const offsetX = e.clientX - e.currentTarget.getBoundingClientRect().left
          playerManager.seekTo(offsetX / pixelPerSecond)
        }}
      >
        {Array(Math.ceil(maxDisplayDuration / section.duration))
          .fill(null)
          .map((_, mainIndex) => {
            const time = mainIndex * section.duration
            return (
              <Fragment key={mainIndex}>
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    transform: `translateX(-50%) translateX(${pixelPerSecond * time}px)`,
                  }}
                >
                  {time.toFixed(1)}s
                </div>
                {Array(section.count - 1)
                  .fill(null)
                  .map((_, dotIndex) => (
                    <div
                      key={dotIndex}
                      className="size-[2px] rounded-full bg-gray-800"
                      style={{
                        position: 'absolute',
                        left: 0,
                        transform: `translateX(-50%) translateX(${pixelPerSecond * (time + (section.duration / section.count) * (dotIndex + 1))}px)`,
                      }}
                    ></div>
                  ))}
              </Fragment>
            )
          })}
      </div>
      {children}
    </div>
  )
}
