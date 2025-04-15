import {
  CSSProperties, PropsWithChildren, useMemo
} from "react";
import {
  useCurrentFrame, useVideoConfig
} from "remotion";

import { AnimationFactory } from "../animation/animation-factory.ts";
import { DisplayElement } from "../schema/element.ts";

type VisualContainerProps = PropsWithChildren<{
    element: DisplayElement
}>
export function VisualContainer(props: VisualContainerProps){
  const { fps } = useVideoConfig()
  const currentFrame = useCurrentFrame()
  const { element } = props
    
  const animation = useMemo(()=>AnimationFactory.createAnimation(element), [element])

  const animAttribute = useMemo(()=>{
    return animation?.getAnimationProperty(currentFrame / fps - element.start)
  }, [animation, currentFrame, fps])
    
  const elementX = typeof animAttribute?.x !== 'undefined' ? animAttribute.x : element.x;
  const elementY = typeof animAttribute?.y !== 'undefined' ? animAttribute.y :  element.y;
  const elementRotate = typeof animAttribute?.rotate !== 'undefined' ? animAttribute.rotate : element.rotate;
  const elementScaleX = typeof animAttribute?.scaleX !== 'undefined' ? animAttribute.scaleX : element.scaleX;
  const elementScaleY = typeof animAttribute?.scaleY !== 'undefined' ? animAttribute.scaleY : element.scaleY;
  const elementOpacity = typeof animAttribute?.opacity !== 'undefined' ? animAttribute.opacity : element.opacity;

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
        `translate(${elementX}px,${elementY}px)`,
        `rotate(${elementRotate}deg)`,
        `scale(${elementScaleX},${elementScaleY})`,
      ].join(' '),
      opacity: elementOpacity,
      mixBlendMode: element.blendMode as CSSProperties['mixBlendMode'],
    }}
  >
    <div style={{
      width: '100%',
      height: '100%',
      transformOrigin: 'center',
      position: 'relative',
    }}>{props.children}</div>
  </div>
}