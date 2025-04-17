import { ImageWidget } from "./image-widget.tsx";
import { TextWidget } from "./text-widget.tsx";
import { AllAsset, } from "../schema/asset.ts";
import { AllElement, } from "../schema/element.ts";

type DisplayWidgetProps = {
    element: AllElement
    asset?: AllAsset
}

export function DisplayWidget(props: DisplayWidgetProps) {
  const { element, asset } = props
  if (element.type === 'image' && asset?.type === 'image') {
    return <ImageWidget element={element} asset={asset}/>
  }
  if(element.type === 'text'){
    return <TextWidget element={element}/>
  }
  return null
}