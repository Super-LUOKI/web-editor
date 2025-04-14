import { z } from "zod";

export const LinearTimingSchema = z.object({ type: z.literal('linear'), });

const CubicBezierParamsSchema = z.object({
  x1: z.number(),
  y1: z.number(),
  x2: z.number(),
  y2: z.number()
});

const CubicBezierTimingSchema = z.object({
  type: z.literal('cubic-bezier'),
  params: CubicBezierParamsSchema
});
export const AnimationTimingSchema = z.discriminatedUnion('type', [
  LinearTimingSchema,
  CubicBezierTimingSchema
]);

export type AnimationTiming = z.infer<typeof AnimationTimingSchema>;
export type AllAnimationTimingType = AnimationTiming['type']