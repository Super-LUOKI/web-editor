import { StageInteraction } from "./stage-interaction";
import { usePlayerManager } from "@/feature/editor/context/player-manager.tsx";
import { editorMockDraft } from "@/feature/editor/util";
import { DraftPlayer } from "@/lib/remotion/editor-render/draft-player.tsx";
import { cn } from '@/lib/shadcn/util';

type StageProps = {
    className?: string
}

export function Stage(props: StageProps) {
  const { className } = props
  const playerManger = usePlayerManager();
    
  return (
    <div className={cn('p-2 flex flex-center relative', className)}>
      <DraftPlayer ref={draftPlayer => {
        if(!draftPlayer) return;
        playerManger.setPlayer(draftPlayer.player);
        playerManger.setContext(draftPlayer.context);
      }} draft={editorMockDraft}/>
      <StageInteraction/>
    </div>
  )
}