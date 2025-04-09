import { z } from "zod";

export const AssetAbstractSchema = z.object({
  id: z.string(), type: z.string()
})
export const AbstractElementSchema = z.object({
  id: z.string(), type: z.string(), assetId: z.string().optional()
})

export const PointSchema = z.object({
  x: z.number(),
  y: z.number(),
});

export const SizeSchema = z.object({
  width: z.number(),
  height: z.number(),
})

export const RectSchema = PointSchema.merge(SizeSchema)