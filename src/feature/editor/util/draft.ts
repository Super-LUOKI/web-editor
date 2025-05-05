import { RenderDraftData } from '@/lib/remotion/editor-render/schema/schema.ts'
import { AllElementType, ElementOfType } from '@/lib/remotion/editor-render/schema/util.ts'

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
