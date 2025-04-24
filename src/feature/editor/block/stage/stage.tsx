import { DraftPlayer } from "@/lib/remotion/editor-render/draft-player.tsx";
import { AnimationDraft } from "@/lib/remotion/mock/animation.ts";
import { cn } from '@/lib/shadcn/util';

type StageProps = {
    className?: string
}

export function Stage(props: StageProps) {
  const { className } = props
    
  return (
    <div className={cn('p-2 flex flex-center', className)}>
      <DraftPlayer draft={AnimationDraft}/>
    </div>
  )
}