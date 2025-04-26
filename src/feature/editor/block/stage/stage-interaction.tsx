import Moveable from "moveable";
import { useEffect, useRef } from "react";

export function StageInteraction(){
  const interactionRef = useRef<HTMLDivElement | null>(null)
  const hoverMoveableRef = useRef<Moveable | null>(null)


  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    console.log(e)
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