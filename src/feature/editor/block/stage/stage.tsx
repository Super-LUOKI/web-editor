import { Player } from '@remotion/player';

import {
  Renderer, RenderPropsSchema
} from "@/lib/remotion/editor-render";
import { calculateDraftDuration } from "@/lib/remotion/editor-render/utils/draft.ts";
import { AnimationDraft } from "@/lib/remotion/mock/animation.ts";
import { cn } from '@/lib/shadcn/util';

type StageProps = {
  className?: string
}
export function Stage(props: StageProps){
  const { className } = props
  const draft = AnimationDraft
  const {
    width, height, fps
  } = draft.meta

  const durationInFrames = calculateDraftDuration(draft) * fps
  
  if(durationInFrames < 1) return null
  
  return <div className={cn('p-2',className)}>
    <Player
      component={Renderer}
      schema={RenderPropsSchema}
      inputProps={{ draft }}
      durationInFrames={durationInFrames}
      compositionWidth={width}
      compositionHeight={height}
      fps={fps}
      style={{
        maxHeight: '100%',
        maxWidth: '100%',
        height: '100%',
        width: '100%',
      }}
      acknowledgeRemotionLicense
    />
  </div>
}