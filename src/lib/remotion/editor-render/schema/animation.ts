import { z } from "zod";

import { AnimationTimingSchema } from "./animation-timing.ts";

export const SupportTransformSchema = z.union([z.literal('opacity'), z.literal('rotate')])
export const SupportAttribute = z.union([
  z.literal('x'),
  z.literal('y'),
  z.literal(  'rotate'),
  z.literal(  'scaleX'),
  z.literal(  'scaleY'),
  z.literal('opacity'),
  z.literal('volume')
])

export const BasicAnimationAttributeSchema = z.record(SupportAttribute, z.number().optional())

export const AnimationTransformSchema = z.object({
  attributes: BasicAnimationAttributeSchema,
  /** default timing*/
  timing: AnimationTimingSchema,
  specificTiming: z.record(SupportTransformSchema, AnimationTimingSchema).optional(),
})

export const KeyFrameAnimationSchema = z.object({
  type: z.literal('keyframe'),
  keyframes: z.array(z.object({
    /** The scope of a single keyframe is a left-closed and right-open interval like [from, from + duration). */
    start: z.number(),
    transform: AnimationTransformSchema
  })),
});

export const PresetAnimationSchema = z.object({
  name: z.string(),
  duration: z.number().optional(),
  start: z.number().optional(),
})

export const InAnimationSchema = PresetAnimationSchema.extend({ type: z.literal('in'), })
export const OutAnimationSchema = PresetAnimationSchema.extend({ type: z.literal('out'), })
export const LoopAnimationSchema = PresetAnimationSchema.extend({ type: z.literal('loop'), })

export const AllAnimationSchema = z.discriminatedUnion('type', [
  KeyFrameAnimationSchema,
  InAnimationSchema,
  OutAnimationSchema,
  LoopAnimationSchema,
])


export type BasicAnimationAttribute = z.infer<typeof BasicAnimationAttributeSchema>;
export type KeyFrameAnimation = z.infer<typeof KeyFrameAnimationSchema>;
export type PresetAnimation = z.infer<typeof PresetAnimationSchema>;
export type InAnimation = z.infer<typeof InAnimationSchema>;
export type OutAnimation = z.infer<typeof OutAnimationSchema>;
export type LoopAnimation = z.infer<typeof LoopAnimationSchema>;