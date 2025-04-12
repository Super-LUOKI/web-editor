import {
  CSSProperties, PropsWithChildren
} from "react";

import { DisplayElement } from "../schema/element.ts";

type VisualContainerProps = PropsWithChildren<{
    element: DisplayElement
}>
export function VisualContainer(props: VisualContainerProps){
  const { element } = props
  return <div
    style={{
      width: element.width || 'max-content',
      height: element.height || 'max-content',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transformOrigin: 'center',
      transform: [
        `translate(-50%,-50%)`,
        `translate(${element.x}px,${element.y}px)`,
        `rotate(${element.rotate}deg)`,
        `scale(${element.scaleX},${element.scaleY})`,
      ].join(' '),
      opacity: element.opacity,
      mixBlendMode: element.blendMode as CSSProperties['mixBlendMode'],
    }}
  >{props.children}</div>
}