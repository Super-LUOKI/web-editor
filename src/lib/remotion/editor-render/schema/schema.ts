import { z } from "zod";

import {
  AbstractElementSchema, AssetAbstractSchema
} from "./common.ts";


export const FontSchema = z.object({
  src: z.string(),
  family: z.string(),
})

export const TimelineSchema = z.object({
  assets: z.record(z.string(), AssetAbstractSchema),
  elements: z.record(z.string(), AbstractElementSchema),
  fonts: z.array(FontSchema).optional()
});

export const MetaSchema = z.object({
  watermark: z.string().optional(),
  thumbnailFrame: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  fps: z.number().optional(),
})

export const EditorDraftDataSchema = z.object({
  name: z.string().optional(),
  timeline: TimelineSchema,
  meta: MetaSchema,
});

export type EditorDraftData = z.infer<typeof EditorDraftDataSchema>;