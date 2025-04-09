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


export type ImageAsset = z.infer<typeof ImageAssetSchema>;