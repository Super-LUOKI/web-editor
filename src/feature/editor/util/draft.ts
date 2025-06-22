import { AssetNotFoundError } from '../manager/error/asset-not-found-error'
import { ElementNotFoundError } from '@/feature/editor/manager/error/element-not-found-error.ts'
import { RenderDraftData } from '@/lib/remotion/editor-render/schema/schema.ts'
import { RenderTrack } from '@/lib/remotion/editor-render/schema/track.ts'
import {
  AllAssetType,
  AllElementType,
  AssetOfType,
  ElementOfType,
} from '@/lib/remotion/editor-render/schema/util.ts'
import { shallowWalkTracksElement } from '@/lib/remotion/editor-render/utils/draft.ts'

export function getElementData<T extends AllElementType>(
  draft: RenderDraftData,
  id: string,
  type?: T
) {
  const elem = draft.timeline.elements[id]
  if (typeof type !== 'undefined' && elem.type !== type) {
    return undefined
  }
  return elem as ElementOfType<T>
}

export function getDraftTrack(draft: RenderDraftData, trackId: string) {
  return draft.timeline.tracks.find(track => track.id === trackId)
}

export function getNearestFrame(currentTime: number, fps: number): { frame: number; time: number } {
  const frame = Math.max(0, Math.round(currentTime * fps))
  const time = Math.max(0, frame / fps)
  return { frame, time }
}

export function getElement<T extends AllElementType = AllElementType>(
  draft: RenderDraftData,
  id: string,
  type?: T
) {
  const element = draft.timeline.elements[id]
  if (!element) throw new ElementNotFoundError({ id, type })

  if (type && element.type !== type) throw new ElementNotFoundError({ id, type })

  return element as ElementOfType<T>
}

export function getAsset<T extends AllAssetType = AllAssetType>(
  draft: RenderDraftData,
  id: string,
  type?: T
) {
  const asset = draft.timeline.assets[id]
  if (!asset) throw new AssetNotFoundError({ id, type })

  if (type && asset.type !== type) throw new AssetNotFoundError({ id, type })

  return asset as AssetOfType<T>
}

export function getTrackByElement(draft: RenderDraftData, elementId: string) {
  const element = getElement(draft, elementId)
  let track = undefined as RenderTrack | undefined
  shallowWalkTracksElement(draft, draft.timeline.tracks, (el, _track) => {
    if (el === element) {
      track = _track
      return true
    }
  })
  return track
}
