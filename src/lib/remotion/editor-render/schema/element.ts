import { CSSProperties } from 'react'
import { z } from 'zod'

import { AllAnimationSchema } from './animation.ts'
import { RectSchema } from './common.ts'

export const BaseElementSchema = z.object({
  id: z.string(),
  start: z.number(),
  length: z.number(),
  assetId: z.string().optional(),
  parent: z.string().optional(),
  children: z.array(z.string()).optional(),
  hidden: z.boolean().optional(),
  /** display in timeline clip */
  name: z.string().optional(),
})

export const DisplayElementSchema = BaseElementSchema.extend({
  /** right is positive */
  x: z.number(),
  /** down is positive */
  y: z.number(),
  /**
   * display size width
   * do not modify it, it will be be automatically generated.
   */
  width: z.number().optional(),
  /**
   * display size width
   * do not modify it, it will be be automatically generated.
   */
  height: z.number().optional(),
  scaleX: z.number(),
  scaleY: z.number(),
  /** right rotate is positive */
  rotate: z.number(),

  crop: RectSchema.optional(),
  /**
   * a path or shape name: like circle; circle:50%,50%;  path:z1...;
   * @link https://developer.mozilla.org/en-US/docs/Web/CSS/clip-path
   */
  shape: z.string().optional(),
  /** @link https://developer.mozilla.org/en-US/docs/Web/CSS/filter */
  filter: z.string().optional(),
  blendMode: z.string().optional(),
  /** opacity 0-1 */
  opacity: z.number().optional(),
  animation: AllAnimationSchema.optional(),
  /** emphasize the current element or darken and blur other areas to achieve the "spotlight" effect. */
  mask: z.string().optional(),
  background: z.string().optional(),
})

export const ImageElementSchema = DisplayElementSchema.extend({
  type: z.literal('image'),
  assetId: z.string(),
})

export const TextElementSchema = DisplayElementSchema.extend({
  type: z.literal('text'),
  text: z.string(),
  style: z.custom<CSSProperties>().optional(),
})

export const AudioElementSchema = BaseElementSchema.extend({
  type: z.literal('audio'),
  assetId: z.string(),
  playbackRate: z.number().optional(),
  startFrom: z.number().optional(),
  endAt: z.number().optional(),
  loop: z.boolean().optional(),
  animation: AllAnimationSchema.optional(),
  /** 0-1 */
  volume: z.number().optional(),
})

export const AllElementSchema = z.discriminatedUnion('type', [
  ImageElementSchema,
  AudioElementSchema,
  TextElementSchema,
])

export type DisplayElement = z.infer<typeof DisplayElementSchema>

export type ImageElement = z.infer<typeof ImageElementSchema>
export type AudioElement = z.infer<typeof AudioElementSchema>
export type TextElement = z.infer<typeof TextElementSchema>
export type AllElement = z.infer<typeof AllElementSchema>
