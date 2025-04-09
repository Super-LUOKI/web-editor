import { z } from "zod";

export const PointSchema = z.object({
  x: z.number(),
  y: z.number(),
});

export const SizeSchema = z.object({
  width: z.number(),
  height: z.number(),
})

export const RectSchema = PointSchema.merge(SizeSchema)