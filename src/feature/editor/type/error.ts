import { AllAsset } from '@/lib/remotion/editor-render/schema/asset'
import { AllElement } from '@/lib/remotion/editor-render/schema/element.ts'
import { RenderTrack } from '@/lib/remotion/editor-render/schema/track.ts'

export type ElementFeature = Partial<AllElement>
export type TrackFeature = Partial<RenderTrack>
export type AssetFeature = Partial<AllAsset>
