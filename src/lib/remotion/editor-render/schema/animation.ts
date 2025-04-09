import { z } from "zod";

export const AbstractAnimationSchema = z.object({
  type: z.string(),
  name: z.string(),
  duration: z.number().optional(),
  start: z.number().optional(),
});

export const InAnimationSchema = AbstractAnimationSchema.extend({ type: z.literal('in'), })
export const OutAnimationSchema = AbstractAnimationSchema.extend({ type: z.literal('out'), })
export const LoopAnimationSchema = AbstractAnimationSchema.extend({ type: z.literal('loop'), })

export const AnimationDataSchema = z.array(AbstractAnimationSchema);
