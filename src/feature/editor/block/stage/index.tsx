import { useZustand } from "use-zustand";

import { StageInteraction } from "./stage-interaction";
import { useDraftManager } from "@/feature/editor/context/draft-manager.tsx";
import { usePlayerManager } from "@/feature/editor/context/player-manager.tsx";
import { DraftPlayer } from "@/lib/remotion/editor-render/draft-player.tsx";
import { cn } from '@/lib/shadcn/util';

type StageProps = {
    className?: string
}

export function Stage(props: StageProps) {
  const { className } = props
  const playerManger = usePlayerManager();
  const draftManager = useDraftManager()
  const draft = useZustand(draftManager.store, s => s.draft)
    
  return (
    <div className={cn('p-2 flex flex-center relative overflow-hidden', className)}>
      <DraftPlayer 
        ref={draftPlayer => {
          if(!draftPlayer) return;
          playerManger.setPlayer(draftPlayer.player);
          playerManger.setContext(draftPlayer.context);
        }} 
        draft={draft}/>
      <StageInteraction/>
    </div>
  )
}