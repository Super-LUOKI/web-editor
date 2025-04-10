import { z } from "zod";


export const AbstractAssetSchema = z.object({
  id: z.string(), type: z.string()
})


export const ImageAssetSchema = AbstractAssetSchema.extend({
  type: z.literal('image'),
  src: z.string(),
  width: z.number(),
  height: z.number(),
  srcset: z.array(z.object({
    src: z.string(),
    width: z.number(),
    height: z.number(),
  })).optional()
})

export const AudioAssetSchema = AbstractAssetSchema.extend({
  type: z.literal('audio'),
  src: z.string(),
  duration: z.number(),
})


export type ImageAsset = z.infer<typeof ImageAssetSchema>;
export type AudioAsset = z.infer<typeof AudioAssetSchema>;