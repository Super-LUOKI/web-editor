import { ImageAsset } from "./asset.ts";
import { ImageElement } from "./element.ts";

type TestExtraAsset = {
    type: 'extra';
    asset: string;
}

type TestExtraElement = {
    type: 'extra';
    extra: string;
}

type TestOtherElement = {
    type: 'other';
    other: string;
}

export type AllAsset = ImageAsset | TestExtraAsset

export type AllElement = ImageElement | TestExtraElement | TestOtherElement

// element type must be unique: element -> asset = 1:n
type ElementAssetTypePair =
    { element: 'image'; asset: 'image' } |
    { element: 'extra'; asset: 'extra' } |
    { element: 'other'; asset: 'extra' }

export type ElementOfType<T extends AllElement['type']> = Extract<AllElement, { type: T }>

export type AssetOfType<T extends AllAsset['type']> = Extract<AllAsset, { type: T }>

export type AssetTypeOfElementType<T extends AllElement['type']> = Extract<ElementAssetTypePair, { element: T }>['asset']

export type AssetOfElementType<T extends AllElement['type']> = AssetOfType<AssetTypeOfElementType<T>>