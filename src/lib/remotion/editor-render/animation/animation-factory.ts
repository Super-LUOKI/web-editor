import {
  RenderAnimation, RenderKeyFrameAnimation
} from "./render-animation.ts";
import { DisplayElement } from "../schema/element.ts";

export class AnimationFactory{
  static createAnimation(element: DisplayElement): RenderAnimation | null {
    if(!element.animation) return null;
    switch (element.animation.type){
      case "keyframe":
        return new RenderKeyFrameAnimation(element.animation)
    }
    return null
  }
}