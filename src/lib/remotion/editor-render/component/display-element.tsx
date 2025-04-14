import { ImageElement } from "./image-element.tsx";
import { AllAsset, } from "../schema/asset.ts";
import { AllElement, } from "../schema/element.ts";

type DisplayElementProps = {
    element: AllElement
    asset?: AllAsset
}

export function DisplayElement(props: DisplayElementProps) {
  const {
    element, asset
  } = props
  if (element.type === 'image' && asset?.type === 'image') {
    return <ImageElement element={element} asset={asset}/>
  }
  return null
}