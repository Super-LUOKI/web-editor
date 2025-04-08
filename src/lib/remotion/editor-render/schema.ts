import { z } from "zod";

export const TimelineSchema = z.object({});

export const MetaSchema = z.object({
  watermark: z.string().optional(),
  thumbnailFrame: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  fps: z.number().optional(),
})

export const DraftDataSchema = z.object({
  name: z.string().optional(),
  timeline: TimelineSchema,
  meta: MetaSchema,
});