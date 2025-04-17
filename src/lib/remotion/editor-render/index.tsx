
import { AbsoluteFill } from "remotion";
import { z } from "zod";

import { AudioWidget } from "./component/audio-widget.tsx";
import { DisplayWidget } from "./component/display-widget.tsx";
import { useElements } from "./hook/use-element.ts";
import { RenderDraftDataSchema, } from "./schema/schema.ts";
import { getAsset } from "./utils/draft.ts";

export const RenderPropsSchema = z.object({ draft:RenderDraftDataSchema })

export function Renderer(props: z.infer<typeof RenderPropsSchema>) {
  const { draft } = props;
  const { audioElements, displayElements } = useElements(draft)


  return (
    <AbsoluteFill style={{ background: draft.background || 'transparent' }}>
      {displayElements.map(element => (
        <DisplayWidget key={element.id} element={element} asset={getAsset(draft, element)}/>
      ))}
      {audioElements.map(element => {
        const asset = getAsset(draft, element);
        if (!asset) return null;
        return (
          <AudioWidget key={element.id} element={element} asset={asset}/>
        )

      })}
             
    </AbsoluteFill>
  )
}