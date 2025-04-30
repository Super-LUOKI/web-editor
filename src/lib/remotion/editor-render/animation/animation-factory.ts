import { RenderAnimation, RenderKeyFrameAnimation } from './render-animation.ts'
import { AllElement } from '../schema/element.ts'

export class AnimationFactory {
  static createAnimation(element: Pick<AllElement, 'animation'>): RenderAnimation | null {
    if (!element.animation) return null
    switch (element.animation.type) {
      case 'keyframe':
        return new RenderKeyFrameAnimation(element.animation)
    }
    return null
  }
}
