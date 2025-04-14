
import { AbsoluteFill } from "remotion";

import { AudioElement } from "./component/audio-element.tsx";
import { DisplayElement } from "./component/display-element.tsx";
import { useElements } from "./hook/use-element.ts";
import { RenderDraftData } from "./schema/schema.ts";

type RenderProps = {
    draft: RenderDraftData,
}

export function Renderer(props: RenderProps) {
  const { draft } = props;
  const {
    audioElements, displayElements
  } = useElements(draft)


  return <AbsoluteFill>
    {displayElements.map(element => (
      <DisplayElement key={element.id} element={element} asset={draft.timeline.assets[element.assetId]}/>
    ))}
    {audioElements.map(element => (
      <AudioElement key={element.id} element={element} asset={draft.timeline.assets[element.assetId]}/>
    ))}
             
  </AbsoluteFill>
}