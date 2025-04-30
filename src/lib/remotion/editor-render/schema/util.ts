import { AllAsset } from './asset.ts'
import { AllElement } from './element.ts'
import { AllAnimationTimingType, AnimationTiming } from '../schema/animation-timing.ts'

export type AllAssetType = AllAsset['type']
export type AllElementType = AllElement['type']

// element type must be unique: element -> asset = 1:n
type ElementAssetTypePair =
  | { element: 'image'; asset: 'image' }
  | { element: 'audio'; asset: 'audio' }
  | { element: 'text'; asset: never }

export const elementAssetPair: Record<AllElementType, string | null> = {
  image: 'image',
  audio: 'audio',
  text: null,
}

export type ElementOfType<T extends AllElementType> = Extract<AllElement, { type: T }>

export type AssetOfType<T extends AllAssetType> = Extract<AllAsset, { type: T }>

export type CorrespondElementAssetPair<E extends AllElementType> = {
  element: ElementOfType<E>
  asset: AssetOfElementType<E>
}

export type AssetTypeOfElementType<T extends AllElementType> = Extract<
  ElementAssetTypePair,
  { element: T }
>['asset']
export type AssetOfElementType<T extends AllElementType> = AssetOfType<AssetTypeOfElementType<T>>
export type AnimationTimingOfType<T extends AllAnimationTimingType> = Extract<
  AnimationTiming,
  { type: T }
>

export type AllElementTypeAllowString = AllElementType | string
export type AllAssetTypeAllowString = AllAssetType | string
