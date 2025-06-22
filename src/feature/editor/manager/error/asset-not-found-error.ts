import { AssetFeature } from '../../type/error'

export class AssetNotFoundError extends Error {
  public asset: AssetFeature

  constructor(asset: AssetFeature) {
    super(`Asset with ID ${asset.id}(${asset.type ?? ''}) not found.`)
    this.name = 'AssetNotFoundError'
    this.asset = asset
  }
}
