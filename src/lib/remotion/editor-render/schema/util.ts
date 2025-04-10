import {
  AudioAsset, ImageAsset
} from "./asset.ts";
import {
  AudioElement, ImageElement
} from "./element.ts";


export type AllAsset = ImageAsset | AudioAsset

export type AllElement = ImageElement | AudioElement

export type AllAssetType = AllAsset['type']
export type AllElementType = AllElement['type']

// element type must be unique: element -> asset = 1:n
type ElementAssetTypePair =
    { element: 'image'; asset: 'image' } |
    { element: 'extra'; asset: 'extra' } |
    { element: 'other'; asset: 'extra' }

export type ElementOfType<T extends AllElementType> = Extract<AllElement, { type: T }>

export type AssetOfType<T extends AllAssetType> = Extract<AllAsset, { type: T }>

export type AssetTypeOfElementType<T extends AllElementType> = Extract<ElementAssetTypePair, { element: T }>['asset']

export type AssetOfElementType<T extends AllElementType> = AssetOfType<AssetTypeOfElementType<T>>