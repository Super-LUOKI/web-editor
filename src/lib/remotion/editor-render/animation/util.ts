import { Easing } from 'remotion'

import { AnimationTiming } from '../schema/animation-timing.ts'

type EasingFn = (input: number) => number
export function getAnimationEasing(timing: AnimationTiming): EasingFn {
  switch (timing.type) {
    case 'linear':
      return Easing.linear
    case 'cubic-bezier': {
      const { x1, y1, x2, y2 } = timing.params
      return Easing.bezier(x1, y1, x2, y2)
    }
  }
}
