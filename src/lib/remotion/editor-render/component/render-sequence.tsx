import { Sequence, SequenceProps } from "remotion";

import { useFrameRange } from "../hook/use-frame-range.tsx";
import { DisplayElementSchema } from "../schema/element.ts";


type RenderSequenceProps = SequenceProps & {
    element: Pick<DisplayElementSchema, 'start' | 'length' | 'hidden'>
}


export function RenderSequence(props: RenderSequenceProps){
  const { element, ...rest } = props
  const { frameStart, frameDuration } = useFrameRange(element)

  if(element.hidden || frameDuration <= 0) return null

  return <Sequence durationInFrames={frameDuration} from={frameStart} {...rest}/>
}
