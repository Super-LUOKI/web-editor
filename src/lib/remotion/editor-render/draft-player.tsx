import { Player as RemotionPlayer } from "@remotion/player";
import { ComponentPropsWithoutRef, ComponentRef, forwardRef } from "react";

import { Renderer, RenderPropsSchema } from "./index.tsx";
import { RenderDraftData } from "./schema/schema.ts";
import { calculateDraftDuration } from "./utils/draft.ts";

type PlayerProps = Omit<ComponentPropsWithoutRef<typeof RemotionPlayer>,
    'component'
    | 'schema'
    | 'inputProps'
    | 'durationInFrames'
    | 'fps'
    | 'compositionWidth'
    | 'compositionHeight'
    | 'numberOfSharedAudioTags'
    | 'lazyComponent'
    | 'acknowledgeRemotionLicense'
> & {
    draft: RenderDraftData
}

export const DraftPlayer = forwardRef<ComponentRef<typeof RemotionPlayer>, PlayerProps>((props, ref ) =>{
  const { draft, style, ...rest } = props

  const { width, height, fps } = draft.meta

  const durationInFrames = calculateDraftDuration(draft) * fps

  if (durationInFrames < 1) return null
    
    
  return (
    <RemotionPlayer
      ref={ref}
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
        width: '100%',
        aspectRatio: `${width} / ${height}`,
        ...style
      }}
      acknowledgeRemotionLicense
      {...rest}
    />
  )
})