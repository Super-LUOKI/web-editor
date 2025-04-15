
import { AbsoluteFill } from "remotion";

import { AudioWidget } from "./component/audio-widget.tsx";
import { DisplayWidget } from "./component/display-widget.tsx";
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
      <DisplayWidget key={element.id} element={element} asset={draft.timeline.assets[element.assetId]}/>
    ))}
    {audioElements.map(element => (
      <AudioWidget key={element.id} element={element} asset={draft.timeline.assets[element.assetId]}/>
    ))}
             
  </AbsoluteFill>
}