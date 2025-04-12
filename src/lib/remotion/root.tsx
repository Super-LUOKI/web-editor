import { Composition } from "remotion";

import { Renderer } from "./editor-render";
import { calculateDraftDuration } from "./editor-render/utils/draft.ts";
import { mockDrafts } from "./mock";


export function RemotionRoot() {
  return (
    <>
      {
        // todo calculateMetadata: to override the default props
        mockDrafts.map((mockDraft, index) => (
          <Composition
            key={'render' + index}
            id={'render' + index}
            component={Renderer}
            durationInFrames={5 * 30}
            fps={30}
            width={1920}
            height={1080}
            defaultProps={{ draft: mockDraft }}
            calculateMetadata={async (info) => {
              const { props } = info;
              const { draft } = props
              const {
                width, 
                height,
                fps
              } = draft.meta
              const durationInFrames = Math.floor(calculateDraftDuration(draft) * fps);
              return {
                width,
                height,
                durationInFrames,
                fps,
                props
              }
            }}
          />
        ))
      }
    </>
  )
}