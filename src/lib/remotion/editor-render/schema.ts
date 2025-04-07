import { z } from "zod";

export const TimelineSchema = z.object({});

export const OutputSchema = z.object({})

export const DraftDataSchema = z.object({
  name: z.string().optional(),
  timeline: TimelineSchema,
  output: OutputSchema,
  acceptAspectRatios: z.array(z.string()).optional(),
  watermark: z.boolean().optional(),
  thumbnailFrame: z.number().optional(),
});