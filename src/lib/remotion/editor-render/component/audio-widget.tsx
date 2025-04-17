import { useMemo } from "react";
import { useVideoConfig, Audio as RemotionAudio, useCurrentFrame } from "remotion";

import { RenderSequence } from "./render-sequence.tsx";
import { AnimationFactory } from "../animation/animation-factory.ts";
import { CorrespondElementAssetPair } from "../schema/util.ts";
import { getTrimProps } from "../utils/draft.ts";

type AudioWidgetProps = CorrespondElementAssetPair<'audio'>

export function AudioWidget(props: AudioWidgetProps) {
  const { element, asset } = props
    
  const { fps } = useVideoConfig();
  const currentFrame = useCurrentFrame();
  const animation = useMemo(()=>AnimationFactory.createAnimation(element), [element])

  const animAttribute = useMemo(()=>{
    return animation?.getAnimationProperty(currentFrame / fps - element.start)
  }, [animation, currentFrame, fps])

    
  return (
    <RenderSequence element={element} premountFor={1 & fps}>
      <RemotionAudio
        loop
        src={asset.src}
        volume={Math.max(0, animAttribute?.volume ?? element.volume ?? 1)}
        playbackRate={element.playbackRate || 1.0}
        {...getTrimProps(element, fps)}
      />
    </RenderSequence>
  )
}