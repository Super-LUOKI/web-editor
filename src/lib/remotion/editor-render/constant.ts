import { RenderTrack } from './schema/track.ts'

export const trackPriorityMap: Record<RenderTrack['type'], number> = {
  ['caption']: 100,
  ['text']: 200,
  ['image-video']: 300,
  ['audio']: 400,
}
