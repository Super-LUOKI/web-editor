import { TrackFeature } from '@/feature/editor/type/error.ts'

export class TrackNotFoundedError extends Error {
  public track: TrackFeature

  constructor(track: TrackFeature) {
    super(`Track with ID ${track.id}(${track.type ?? ''}) is not founded.`)
    this.name = 'TrackNotFoundedError'
    this.track = track
  }
}
