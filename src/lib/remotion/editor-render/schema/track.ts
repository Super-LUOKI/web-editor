import { z } from "zod";

export const TrackCategorySchema = z.enum([ 'caption', 'voiceover', 'audio', 'text', 'image-video'])

export const TrackSchema = z.object({
  type: TrackCategorySchema,
  id: z.string(),
  clips: z.array(z.object({ elementId: z.string() })),
  hidden: z.boolean().optional(),
});

export type EditorTrack = z.infer<typeof TrackSchema>;