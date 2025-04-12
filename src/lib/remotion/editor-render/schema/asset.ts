import { z } from "zod";


export const AbstractAssetSchema = z.object({
  id: z.string(), type: z.string()
})

export const SizeAssetSchema = AbstractAssetSchema.extend({
  width: z.number(),
  height: z.number(),
})


export const ImageAssetSchema = SizeAssetSchema.extend({
  type: z.literal('image'),
  src: z.string(),

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

export const AllAsset = z.discriminatedUnion('type',[
  ImageAssetSchema,
  AudioAssetSchema
])

export type SizeAsset = z.infer<typeof SizeAssetSchema>;
export type ImageAsset = z.infer<typeof ImageAssetSchema>;
export type AudioAsset = z.infer<typeof AudioAssetSchema>;
export type AllAsset = z.infer<typeof AllAsset>;