import { CSSProperties, PropsWithChildren, useMemo } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

import { AnimationFactory } from "../animation/animation-factory.ts";
import { DisplayElement } from "../schema/element.ts";
import { getAttributeWithOverwrite } from "../utils/draft.ts";

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
    
    
  const elementX = getAttributeWithOverwrite(element, 'x', animAttribute, 0)
  const elementY = getAttributeWithOverwrite(element, 'y', animAttribute, 0)
  const elementRotate = getAttributeWithOverwrite(element, 'rotate', animAttribute, 0)
  const elementScaleX = getAttributeWithOverwrite(element, 'scaleX', animAttribute, 1)
  const elementScaleY = getAttributeWithOverwrite(element, 'scaleY', animAttribute, 1)
  const elementOpacity = getAttributeWithOverwrite(element, 'opacity', animAttribute, 1)
    

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