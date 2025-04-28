
import { useEffect, useRef, useState } from "react";

import { InteractionViewController } from "@/feature/editor/block/stage/interaction-view-controller.ts";
import { useDraftManager } from "@/feature/editor/context/draft-manager.tsx";
import { useEditorManager } from "@/feature/editor/context/editor-manager.tsx";
import { usePlayerManager } from "@/feature/editor/context/player-manager.tsx";


export function StageInteraction() {

  const playerManger = usePlayerManager()
  const draftManager = useDraftManager()
  const editorManager = useEditorManager()

  const interactionRef = useRef<HTMLDivElement | null>(null)

  const [vc] = useState(new InteractionViewController(
    playerManger,
    draftManager,
    editorManager
  ))


  useEffect(()=>{
    vc.init({ interactionDomRef: interactionRef });
    return () => {
      vc.destroy()
    }
  }, [])


  return (
    <div
      ref={interactionRef}
      className='size-full absolute left-0 top-0'
    ></div>
  )
}