import { z } from "zod";

import { AssetAbstractSchema } from "./common.ts";

export const ImageAssetSchema = AssetAbstractSchema.extend({
  type: z.literal('image'),
  src: z.string(),
  width: z.number(),
  height: z.number(),
  srcset: z.array(z.object({
    src: z.string(),
    width: z.number(),
    height: z.number(),
  }))
})

export type ImageAsset = z.infer<typeof ImageAssetSchema>;