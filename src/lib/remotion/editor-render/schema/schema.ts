import { z } from "zod";

import { ImageAssetSchema } from "./asset.ts";
import { ImageElementSchema } from "./element.ts";
import { TrackSchema } from "./track.ts";


export const FontSchema = z.object({
  src: z.string(),
  family: z.string(),
})

const AssetSchema = z.discriminatedUnion('type', [
  ImageAssetSchema,
]);

const ElementSchema = z.discriminatedUnion('type', [
  ImageElementSchema
])

export const TimelineSchema = z.object({
  assets: z.record(z.string(), AssetSchema),
  elements: z.record(z.string(), ElementSchema),
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

export type EditorAsset = z.infer<typeof AssetSchema>;
export type EditorElement = z.infer<typeof ElementSchema>;
export type RenderDraftData = z.infer<typeof EditorDraftDataSchema>;