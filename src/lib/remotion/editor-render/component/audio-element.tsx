import { CorrespondElementAssetPair } from "../schema/util.ts";

type AudioElementProps =  CorrespondElementAssetPair<'audio'>
export function AudioElement(props: AudioElementProps){
  const {
    element, asset
  } = props
  return (
    <div>
      <h1>{element.id}</h1>
      <p>{asset.id}</p>
    </div>
  )
}