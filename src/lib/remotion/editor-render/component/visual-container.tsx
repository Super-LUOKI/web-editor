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
  >
    <div style={{
      width: '100%',
      height: '100%',
      transformOrigin: 'center',
      position: 'relative',
      // transform: [
      //   `translate(${animationData.x}px,${animationData.y}px)`,
      //   `translate(${animationData.translateX}%,${animationData.translateY}%)`,
      //   `rotate(${animationData.rotate}deg)`,
      //   `scale(${animationData.scaleX},${animationData.scaleY})`,
      // ].join(' '),
      // opacity: animationData.opacity,
      // clipPath: animationData.clipPath || shapeToClipPath(animationData) || shapeToClipPath(element),
      // background: animationData.background || element.background,
      // filter: filterExtend(`${element.filter || ''} ${animationData.filter || ''}`),
    }}>{props.children}</div>
  </div>
}