import { z } from 'zod'

export const TrackCategorySchema = z.enum(['caption', 'audio', 'text', 'image-video'])

export const TrackClip = z.object({ elementId: z.string() })

export const TrackSchema = z.object({
  type: TrackCategorySchema,
  id: z.string(),
  /** Redundancies are allowed in elements and assets.
   * Only all the elements referenced by clips are the content that appears during rendering.
   */
  clips: z.array(TrackClip),
  hidden: z.boolean().optional(),
  zIndex: z.number().optional(),
})

export type RenderTrackClip = z.infer<typeof TrackClip>
export type RenderTrack = z.infer<typeof TrackSchema>
