import { interpolate } from "remotion";

import { getAnimationEasing } from "./util.ts";
import {
  BasicAnimationAttribute, KeyFrameAnimation
} from "../schema/animation.ts";


export abstract class RenderAnimation{
    abstract getAnimationProperty(time: number):BasicAnimationAttribute;
}

export class RenderKeyFrameAnimation extends RenderAnimation{
  constructor(private readonly keyframeData: KeyFrameAnimation){
    super();
  }

  getAnimationProperty(time: number){
    const { keyframes } = this.keyframeData;
    const currentKeyframe = keyframes.find((keyframe) => (keyframe.from >= time && keyframe.from < time + keyframe.duration));
    if(!currentKeyframe) return {};
    const {
      transform, from:fromTime, duration 
    } = currentKeyframe;
    const {
      from: fromProps, to: toProps, timing, specificTiming
    } = transform;

    const currentProps:BasicAnimationAttribute= {};
    Object.entries(fromProps).forEach(([animAttr])=>{
      if(!toProps[animAttr]) return;
      const easingFn = getAnimationEasing(specificTiming?.[animAttr] ||  timing)
      currentProps[animAttr] = interpolate((time - fromTime), [0, duration],[fromProps[animAttr], toProps[animAttr]],{ easing: easingFn } );
    })
    return currentProps;
  }
}