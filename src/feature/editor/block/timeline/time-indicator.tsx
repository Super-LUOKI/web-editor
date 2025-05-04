import lodash from 'lodash'
import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { useZustand } from 'use-zustand'

import { FullscreenMask } from '@/feature/editor/component/fullscreen-mask.tsx'
import { useDraftManager } from '@/feature/editor/context/draft-manager.tsx'
import { usePlayerManager } from '@/feature/editor/context/player-manager.tsx'
import { useTimelineViewController } from '@/feature/editor/context/timeline-view-controller.tsx'
import { getNearestFrame } from '@/feature/editor/util/draft.ts'
import { cn } from '@/lib/shadcn/util.ts'

export function TimeIndicator() {
  const playerManager = usePlayerManager()
  const draftManager = useDraftManager()
  const vc = useTimelineViewController()

  const currentTime = useZustand(playerManager.store, s => s.currentTime)
  const pixelPerSecond = useZustand(vc.store, s => s.pixelPerSecond)

  const indicatorRef = useRef<HTMLDivElement | null>(null)
  const [isIndicatorFollowTime, setIsIndicatorFollowTime] = useState(true)

  useEffect(() => {
    if (!indicatorRef.current) return
    const indicatorEl = indicatorRef.current

    const throttleSeekFrame = lodash.throttle(playerManager.seekToFrame.bind(playerManager), 100, {
      leading: true,
      trailing: true,
    })
    const moveIndicator = (left: number) => {
      const pixelPerFrame = pixelPerSecond / draftManager.fps
      const { frame } = getNearestFrame(
        Math.min(left / pixelPerSecond, playerManager.duration),
        draftManager.fps
      )
      indicatorEl.style.left = `${Math.round(pixelPerFrame * frame)}px`
      throttleSeekFrame(frame)
    }

    let isMoving = false

    const handlePointerDown = (e: PointerEvent) => {
      const rect = vc.timelineContentDomRect
      if (!rect) return
      flushSync(() => {
        setIsIndicatorFollowTime(false)
      })
      moveIndicator(e.clientX - rect.left)
      isMoving = true
    }

    const handlePointerUp = () => {
      isMoving = false
      setIsIndicatorFollowTime(true)
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = vc.timelineContentDomRect
      if (!isMoving || !rect) return
      flushSync(() => {
        setIsIndicatorFollowTime(false)
      })
      const { left, width } = rect
      const newLeftOffset = Math.min(width, Math.max(0, e.clientX - left))
      moveIndicator(newLeftOffset)
    }

    indicatorEl.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('pointermove', handleMouseMove)
    document.addEventListener('pointerup', handlePointerUp)
    return () => {
      indicatorEl.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('pointermove', handleMouseMove)
      document.removeEventListener('pointerup', handlePointerUp)
    }
  }, [pixelPerSecond])

  return (
    <>
      <FullscreenMask show={!isIndicatorFollowTime} />
      <div
        ref={elem => {
          if (!elem) return
          indicatorRef.current = elem
          vc.setTimelineIndicatorDom(elem)
        }}
        className={cn('absolute left-0 top-0 -translate-x-1/2 w-3 h-full z-1000 cursor-ew-resize')}
        style={isIndicatorFollowTime ? { left: currentTime * pixelPerSecond } : {}}
      >
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[2px] h-full bg-orange-500"></div>
        <div className="absolute left-1/2 top-0 -translate-x-1/2 size-3 bg-orange-500"></div>
        <div className="absolute left-1/2 top-3 -translate-x-1/2 size-0 border-[6px] border-solid border-transparent border-t-orange-500"></div>
      </div>
    </>
  )
}
