import { useMemo } from 'react'

import { AllElement, AudioElement } from '../schema/element.ts'
import { RenderDraftData } from '../schema/schema.ts'
import { isTargetElement, shallowWalkTracksElement } from '../utils/draft.ts'

export function useElements(draft: RenderDraftData) {
  return useMemo(() => {
    const displayElements: AllElement[] = []
    const audioElements: AudioElement[] = []
    const orderedTracks = [...draft.timeline.tracks].sort((a, b) => -(a.order - b.order))
    shallowWalkTracksElement(draft, orderedTracks, element => {
      if (isTargetElement(element, 'audio')) {
        audioElements.push(element)
      } else {
        displayElements.push(element)
      }
    })
    return {
      displayElements: displayElements,
      audioElements: audioElements,
    }
  }, [draft])
}
