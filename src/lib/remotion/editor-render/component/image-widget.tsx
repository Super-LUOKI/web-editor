import { Img, useVideoConfig } from "remotion";

import { RenderSequence } from "./render-sequence.tsx";
import { VisualContainer } from "./visual-container.tsx";
import { CorrespondElementAssetPair } from "../schema/util.ts";
import { calcCropStyle } from "../utils/style.ts";

type ImageWidgetProps = CorrespondElementAssetPair<'image'>

export function ImageWidget(props: ImageWidgetProps){
  const { element, asset } = props

  const { fps } = useVideoConfig()
  const cropStyle = calcCropStyle(element, asset)

  return <RenderSequence element={element} premountFor={1 * fps}>
    <VisualContainer element={element}>
      <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
        <Img
          draggable={false}
          src={asset.src}
          style={{
            userSelect:'none',
            position: 'relative',
            ...cropStyle
          }} />
      </div>
    </VisualContainer>
  </RenderSequence>
}