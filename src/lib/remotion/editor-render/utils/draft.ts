import { AllElement, DisplayElement } from "../schema/element.ts";
import { RenderDraftData } from "../schema/schema.ts";
import { EditorTrack } from "../schema/track.ts";
import {
  AllAssetType,
  AllAssetTypeAllowString,
  AllElementType,
  AllElementTypeAllowString, AssetOfElementType,
  AssetOfType,
  ElementOfType
} from "../schema/util.ts";

export function shallowWalkTracksElement(
  draft: RenderDraftData,
  tracks: EditorTrack[],
  callback: (element: AllElement, track: EditorTrack) => void
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

export function calculateDraftDuration(draft: RenderDraftData) {
  let duration = 0;
  shallowWalkTracksElement(draft, draft.timeline.tracks, (element)=>{
    duration = Math.max(duration, element.start + element.length);
  })
  return duration
}

export function isTargetElement<T extends AllElementType>(
  element: {type: AllElementTypeAllowString} | undefined,
  type: T
): element is ElementOfType<T> {
  if(!element) return false;
  return element.type === type;
}

export function isTargetAsset<T extends AllAssetType>(asset: {type: AllAssetTypeAllowString} | undefined, type: T): asset is AssetOfType<T> {
  if(!asset) return false;
  return asset.type === type;
}

export function isDisplayElement<T extends AllElement>(element: T): element is T & DisplayElement {
  const notDisplayElementType: AllElementType[] = []
  return !notDisplayElementType.includes(element.type);
}

export function getElements(draft: RenderDraftData, need: (element: AllElement) => boolean) {
  const elements: AllElement[] = [];
  shallowWalkTracksElement(draft, draft.timeline.tracks, (element) => {
    if (need(element)) {
      elements.push(element);
    }
  })
  return elements;
}

export function getAsset<T extends Pick<AllElement, 'assetId' | 'type'>>(draft:RenderDraftData, element: T): AssetOfElementType<T['type']>| undefined{
  if(!element.assetId) return undefined;
  return draft.timeline.assets[element.assetId] as AssetOfElementType<T['type']> | undefined;
}



export function getTrimProps(el: AllElement, fps: number) {
  const data = { startFrom: undefined, endAt: undefined, ...el };
  const out = {} as Partial<{ startFrom: number; endAt: number }>;

  if (data.startFrom !== undefined) {
    out.startFrom = Math.floor(data.startFrom * fps);
  }
  if (data.endAt !== undefined) {
    out.endAt = Math.ceil(data.endAt * fps) + 1; // need add 1 frame for end, else will be white screen on end
  }

  return out;
}

export function getAttributeWithOverwrite<T extends object, A extends keyof T>(obj: T, attr: A, overwrite?: Partial<T>, defaultValue?: T[A]){
  const value = overwrite?.[attr] ?? obj[attr];
  if (value === undefined) {
    return defaultValue;
  }
  return value;
}