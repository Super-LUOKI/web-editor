import lodash from 'lodash'
import { useCallback, useRef } from 'react'
import { useZustand } from 'use-zustand'

import { formatSeconds } from '@/common/util/date.ts'
import { Button } from '@/component/ui/button.tsx'
import { Slider } from '@/component/ui/slider.tsx'
import { HEADER_WIDTH } from '@/feature/editor/block/timeline/constant.ts'
import { useDraftManager } from '@/feature/editor/context/draft-manager.tsx'
import { usePlayerManager } from '@/feature/editor/context/player-manager.tsx'
import { useTimelineViewController } from '@/feature/editor/context/timeline-view-controller.tsx'
import { useSize } from '@/hook/use-size.ts'
import { IconPark } from '@/lib/iconpark'
import { cn } from '@/lib/shadcn/util.ts'

type TimelineActionProps = {
  className?: string
}

export function TimelineAction(props: TimelineActionProps) {
  const { className } = props
  const playerManager = usePlayerManager()
  const draftManager = useDraftManager()
  const vc = useTimelineViewController()

  const isPlaying = useZustand(playerManager.store, s => s.isPlaying)
  const isBuffering = useZustand(playerManager.store, s => s.isBuffering)
  const currentTime = useZustand(playerManager.store, s => s.currentTime)
  const duration = useZustand(draftManager.store, s => s.duration)
  const pixelPerSecond = useZustand(vc.store, s => s.pixelPerSecond)

  const containerRef = useRef<HTMLDivElement | null>(null)
  const { width: containerWidth } = useSize(containerRef)

  const throttleUpdatePixelPerSecond = useCallback(
    lodash.throttle(vc.updatePixelPerSecond.bind(vc), 100),
    []
  )

  const renderPlayIcon = () => {
    let icon = <IconPark icon="play" size={20} />

    if (isBuffering) icon = <IconPark icon="loading" size={20} spin />
    if (isPlaying) icon = <IconPark icon="pause" size={20} />

    return icon
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'w-full h-[48px] border-b-[1px] border-b-gray-100 flex justify-between items-center px-3',
        className
      )}
    >
      <div>Left Actions</div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => {
            if (isBuffering) return
            if (isPlaying) {
              playerManager.pause()
            } else {
              playerManager.play()
            }
          }}
        >
          {renderPlayIcon()}
        </Button>
        <div className="flex items-center gap-1">
          <span>{formatSeconds(currentTime)}</span>
          <span>/</span>
          <span>{formatSeconds(duration)}</span>
        </div>
      </div>
      <div className="flex items-center w-[150px]">
        <Slider
          defaultValue={[pixelPerSecond]}
          min={(containerWidth - HEADER_WIDTH) / duration}
          max={1000}
          onValueChange={([relativePixel]) => {
            throttleUpdatePixelPerSecond(relativePixel)
          }}
        />
      </div>
    </div>
  )
}
