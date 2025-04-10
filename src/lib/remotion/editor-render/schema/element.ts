import { z } from "zod";

import { AnimationDataSchema } from "./animation.ts";
import { RectSchema } from "./common.ts";

export const AbstractElementSchema = z.object({
  id: z.string(), type: z.string(), assetId: z.string().optional()
})


export const BaseElementSchema = AbstractElementSchema.extend({
  parent: z.string().optional(),
  children: z.array(z.string()).optional(),
  start: z.number(),
  length: z.number(),
  hidden: z.boolean().optional(),
  /** display in timeline clip */
  name: z.string().optional(),
})

export const DisplayElement = BaseElementSchema.extend({
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
  /** right is positive */
  x: z.number(),
  /** down is positive */
  y: z.number(),
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
  animation: AnimationDataSchema.optional(),
  /** emphasize the current element or darken and blur other areas to achieve the "spotlight" effect. */
  mask: z.string().optional(),
  background: z.string().optional(),
})


export const ImageElementSchema = DisplayElement.extend({
  type: z.literal('image'),
  assetId: z.string(),
})

export const AudioElementSchema = BaseElementSchema.extend({
  type: z.literal('audio'),
  assetId: z.string(),
  playbackRate: z.number().optional(),
  startFrom: z.number().optional(),
  endAt: z.number().optional(),
  loop: z.boolean().optional(),
})

export type AbstractElement = z.infer<typeof AbstractElementSchema>;
export type DisplayElement = z.infer<typeof DisplayElement>;
export type ImageElement = z.infer<typeof ImageElementSchema>;
export type AudioElement = z.infer<typeof AudioElementSchema>;