import Moveable from "moveable";
import { useEffect, useRef } from "react";

import { usePlayerManager } from "@/feature/editor/block/context/player.tsx";

export function StageInteraction(){
  const interactionRef = useRef<HTMLDivElement | null>(null)
  const hoverMoveableRef = useRef<Moveable | null>(null)
  const playerManger = usePlayerManager()

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    let el: HTMLElement | null | undefined = null
    if(!playerManger.state.isPlaying){
      const point = playerManger.getPlayerCoordinatesByPoint({ x: e.clientX, y: e.clientY })
      if(!point) return;
      const activeDraftElements = playerManger.getElementsByCoordinates(point)
      console.log({ activeDraftElements })
      el = playerManger.getElementDOM(activeDraftElements[0]?.id)
      if(!el) return;
      console.log({ el })
    }
  }

  useEffect(()=>{
    const parent = interactionRef.current?.parentElement
    if(!parent) return;
    hoverMoveableRef.current = new Moveable(parent, { origin: false })

    return ()=>{
      hoverMoveableRef.current?.destroy()
    }
  }, [])

  return (
    <div ref={interactionRef} className='size-full absolute left-0 top-0' onPointerMove={onPointerMove}></div>
  )
}