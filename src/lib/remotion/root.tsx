import { Composition } from "remotion";

import { Renderer } from "./editor-render";
import { mockDrafts } from "./mock";


export function RemotionRoot(){
  return (
    <>
      {
        // todo calculateMetadata: to override the default props
        mockDrafts.map((mockDraft, index) => (
          <Composition
            id={'render' + index}
            component={Renderer}
            defaultProps={{ draft: mockDraft }}
            durationInFrames={5 * 30}
            fps={30}
            width={1920}
            height={1080}
          />
        ))
      }
    </>
  )
}