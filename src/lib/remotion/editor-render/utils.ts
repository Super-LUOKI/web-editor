import { AbstractElement } from "./schema/element.ts";
import { EditorDraftData } from "./schema/schema.ts";
import { EditorTrack } from "./schema/track.ts";
import {
  AllElementType, ElementOfType
} from "./schema/util.ts";

export function shallowWalkTracksElement(
  draft: EditorDraftData,
  tracks: EditorTrack[],
  callback: (element: AbstractElement, track: EditorTrack) => void
) {
  const { timeline } = draft;
  for (const track of tracks) {
    const { clips } = track
    for (const clip of clips) {
      const { elementId } = clip
      const element = timeline.elements[elementId];
      if (!element) continue;
      callback(element, track);
    }
  }
}

export function isTargetType<T extends AllElementType>(
  element: AbstractElement,
  type: T
): element is ElementOfType<T> {
  return element.type === type;
}

export function getElements(draft: EditorDraftData, need: (element: AbstractElement) => boolean) {
  const elements: AbstractElement[] = [];
  shallowWalkTracksElement(draft, draft.timeline.tracks, (element) => {
    if (need(element)) {
      elements.push(element);
    }
  })
  return elements;
}