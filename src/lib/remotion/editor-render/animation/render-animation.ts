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

  private getBothSideKeyFrameAnim(time: number, keyframes: KeyFrameAnimation['keyframes']){
    const sortedKeyframes = [...keyframes].sort((a, b) => a.start - b.start);
    const preKeyframeIndex = sortedKeyframes.findIndex((keyframe, index) => (keyframe.start <= time) && (!sortedKeyframes[index + 1] || time < sortedKeyframes[index + 1].start));
    const preKeyframe = preKeyframeIndex !== -1 ? sortedKeyframes[preKeyframeIndex] : undefined;
    const nextKeyframe = preKeyframeIndex + 1 < sortedKeyframes.length ? sortedKeyframes[preKeyframeIndex + 1] : undefined;
    return {
      preKeyframe, nextKeyframe
    }
  }

  getAnimationProperty(time: number){
    const { keyframes } = this.keyframeData;
    const {
      preKeyframe, nextKeyframe
    } = this.getBothSideKeyFrameAnim(time, keyframes);

    let currentProps:BasicAnimationAttribute= {};
    if(!preKeyframe && keyframes.length > 0){
      currentProps = keyframes[0].transform.attributes
    }else if(preKeyframe && !nextKeyframe){
      currentProps = preKeyframe.transform.attributes
    }else if(preKeyframe && nextKeyframe){
      const animFrom = preKeyframe.start;  
      const animTo = nextKeyframe.start;
      const defaultTiming = preKeyframe.transform.timing || nextKeyframe.transform.timing;
      const specificTimingMap = preKeyframe.transform.specificTiming
      const fromProps = preKeyframe.transform.attributes;
      const toProps = nextKeyframe.transform.attributes;

      Object.entries(fromProps).forEach(([animAttr])=>{
        if(typeof toProps[animAttr] === 'undefined') return;
        const easingFn = getAnimationEasing(specificTimingMap?.[animAttr] ||  defaultTiming)
        currentProps[animAttr] = interpolate((time - animFrom), [0, animTo - animFrom],[fromProps[animAttr], toProps[animAttr]],{ easing: easingFn } );
      })
    }

    return currentProps;
  }
}