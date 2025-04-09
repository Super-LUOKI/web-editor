import { Composition } from "remotion";

import { Render } from "./editor-render";
import { mockDrafts } from "./mock";


export function RemotionRoot(){
  return (
    <>
      {
        mockDrafts.map((mockDraft, index) => (
          <Composition
            id={'render' + index}
            component={Render}
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