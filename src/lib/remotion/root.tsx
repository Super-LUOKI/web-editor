import { Composition } from "remotion";

import { Render } from "./editor-render";


export function RemotionRoot(){
  return (
    <>
      <Composition
        id='render'
        component={Render}
        durationInFrames={5 * 30}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  )
}