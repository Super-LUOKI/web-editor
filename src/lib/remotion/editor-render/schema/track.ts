import { z } from "zod";

export const TrackCategorySchema = z.enum([ 'caption', 'voiceover', 'audio', 'text', 'image-video'])

export const TrackSchema = z.object({
  type: TrackCategorySchema,
  id: z.string(),
  /** Redundancies are allowed in elements and assets.
   * Only all the elements referenced by clips are the content that appears during rendering.
   */
  clips: z.array(z.object({ elementId: z.string() })),
  hidden: z.boolean().optional(),
});

export type EditorTrack = z.infer<typeof TrackSchema>;