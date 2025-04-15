import { z } from "zod";

import { AllAssetSchema } from "./asset.ts";
import { AllElementSchema } from "./element.ts";
import { TrackSchema } from "./track.ts";


export const FontSchema = z.object({
  src: z.string(),
  family: z.string(),
})


export const TimelineSchema = z.object({
  assets: z.record(z.string(), AllAssetSchema),
  elements: z.record(z.string(), AllElementSchema),
  fonts: z.array(FontSchema).optional(),
  tracks: z.array(TrackSchema),
});

export const MetaSchema = z.object({
  watermark: z.string().optional(),
  thumbnail: z.boolean().optional(),
  thumbnailFrame: z.number().optional(),
  width: z.number(),
  height: z.number(),
  fps: z.number(),
})

export const EditorDraftDataSchema = z.object({
  name: z.string().optional(),
  timeline: TimelineSchema,
  meta: MetaSchema,
});

export type RenderDraftData = z.infer<typeof EditorDraftDataSchema>;