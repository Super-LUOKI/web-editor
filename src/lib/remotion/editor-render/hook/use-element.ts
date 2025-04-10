import { useMemo } from "react";

import {
  AudioElement, DisplayElement
} from "../schema/element.ts";
import { EditorDraftData } from "../schema/schema.ts";
import {
  isTargetType, shallowWalkTracksElement
} from "../utils.ts";

export function useElements(draft: EditorDraftData,){
  return useMemo(() => {
    const displayElements:DisplayElement[] = [];
    const audioElements:AudioElement[] = [];
    shallowWalkTracksElement(draft, draft.timeline.tracks, element => {
      if(isTargetType(element, 'audio')) {
        audioElements.push(element);
      }else{
        displayElements.push(element as DisplayElement);
      }
    })
    return {
      displayElements: displayElements,
      audioElements: audioElements,
    }
  }, [draft]);
}