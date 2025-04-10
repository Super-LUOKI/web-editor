
import { AbsoluteFill } from "remotion";

import { useElements } from "./hook/use-element.ts";
import { EditorDraftData } from "./schema/schema.ts";

type RenderProps = {
    draft: EditorDraftData,
}

export function Renderer(props: RenderProps) {
  const { draft } = props;
  const {
    audioElements, displayElements
  } = useElements(draft)

  return <AbsoluteFill>
    {displayElements.map(element => (
      <div key={element.id}>1</div>
    ))}
    {audioElements.map(element => (
      <div key={element.id}>2</div>
    ))}
             
  </AbsoluteFill>
}