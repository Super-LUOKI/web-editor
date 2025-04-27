import Moveable from "moveable";
import { useEffect, useRef } from "react";

import { useDraftManager } from "@/feature/editor/block/context/draft.tsx";
import { usePlayerManager } from "@/feature/editor/block/context/player.tsx";
import { isHitControlBox } from "@/feature/editor/block/util/interaction.ts";

export function StageInteraction() {
  const interactionRef = useRef<HTMLDivElement | null>(null)
  const hoverMoveableRef = useRef<Moveable | null>(null);
  const clickMoveableRef = useRef<Moveable | null>(null)
  const playerManger = usePlayerManager()
  const draftManager = useDraftManager()

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    let el: HTMLElement | null | undefined = null
    if (!playerManger.state.isPlaying) {
      const point = playerManger.getPlayerCoordinatesByPoint({ x: e.clientX, y: e.clientY })
      if (!point) return;
      const activeDraftElements = playerManger.getElementsByCoordinates(point)
      el = playerManger.getElementDOM(activeDraftElements[0]?.id)
    }
    if (hoverMoveableRef.current && hoverMoveableRef.current.target !== el) {
      hoverMoveableRef.current.target = el;
      hoverMoveableRef.current.updateRect();
    }
  }

  const onPointerLeave = () => {
    if (!hoverMoveableRef.current) return;
    hoverMoveableRef.current.target = null;
    hoverMoveableRef.current.updateRect()
  }

  const updateClickTarget = (elementId: string) => {
    if (!clickMoveableRef.current) return
    const moveable = clickMoveableRef.current
    const domEl = playerManger.getElementDOM(elementId)
    const draftEl = draftManager.getElementData(elementId)
    if (!domEl) return
    clickMoveableRef.current.target = domEl
    if (draftEl.type === 'text' ) {
      moveable.keepRatio = false;
      moveable.resizable = true;
      moveable.scalable = false;
      moveable.renderDirections = ['w', 'e'];
    } else {
      moveable.scalable = true;
      moveable.keepRatio = true;
      moveable.resizable = false;
      moveable.renderDirections = ['nw', 'ne', 'sw', 'se'];
    }
    moveable.updateRect();
  }


  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    if (!clickMoveableRef.current) return
    let domEl: HTMLElement | undefined | null = undefined;
    let draftItem: { id: string } | undefined = undefined;
    const point = playerManger.getPlayerCoordinatesByPoint({ x: e.clientX, y: e.clientY })

    const startDrag = () => {
      let stop = false;
      window.addEventListener('pointerup', () => {
        stop = true;
      }, { once: true })

      setTimeout(() => {
        if (stop) return;
        if (!clickMoveableRef.current?.target) return;
        clickMoveableRef.current.dragStart(e.nativeEvent)
      }, 10)
    }
    if (point) {
      draftItem = playerManger.getElementByCoordinate(point)
      if (draftItem) {
        domEl = playerManger.context?.box[draftItem.id]?.ref?.current
      }
    }

    // if already selected current element, drag directly
    if (!point && isHitControlBox(clickMoveableRef.current, e.nativeEvent) || (domEl && domEl === clickMoveableRef.current?.target)) {
      startDrag()
      return
    }

    if (clickMoveableRef.current && clickMoveableRef.current.target !== domEl) {
      if (draftItem?.id) {
        updateClickTarget(draftItem.id);
      } else {
        clickMoveableRef.current.target = null;
        clickMoveableRef.current.updateRect()
      }
      if (!domEl) return;
      if (hoverMoveableRef.current) {
        hoverMoveableRef.current.target = null;
        hoverMoveableRef.current.updateRect()
      }
      startDrag()
    }
  }

  useEffect(() => {
    const parent = interactionRef.current?.parentElement
    if (!parent) return;
    hoverMoveableRef.current = new Moveable(parent, { origin: false })
    clickMoveableRef.current = new Moveable(parent, {
      origin: false,
      renderDirections: ['nw', 'ne', 'sw', 'se'],
      rotatable: true,
      scalable: true,
      rotationPosition: 'bottom',
      draggable: true,
      keepRatio: true,
      useMutationObserver: true,
      useResizeObserver: true,
      snappable: true,
      snapDirections: { left: true, top: true, right: true, bottom: true, center: true, middle: true },
      elementSnapDirections: { left: true, top: true, right: true, bottom: true, center: true, middle: true },
      elementGuidelines: ['.__remotion-player'],
      snapRotationThreshold: 2,
      snapRotationDegrees: [0, 90, 180, 270],
      isDisplaySnapDigit: false,
    })
    return () => {
      hoverMoveableRef.current?.destroy()
      clickMoveableRef.current?.destroy()
    }
  }, [])

  return (
    <div
      ref={interactionRef}
      className='size-full absolute left-0 top-0'
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onPointerDown={onPointerDown}
    ></div>
  )
}