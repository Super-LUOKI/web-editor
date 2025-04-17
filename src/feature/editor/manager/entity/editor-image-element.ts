import { DraftManager } from "@/feature/editor/manager/draft-manager.ts";
import { EditorDisplayElement } from "@/feature/editor/manager/entity/editor-display-element.ts";
import { IElementOperation } from "@/feature/editor/manager/entity/editor-element.ts";
import { ElementNotFoundError } from "@/feature/editor/manager/error/element-not-found-error.ts";
import { ImageElement } from "@/lib/remotion/editor-render/schema/element.ts";
import { getAsset } from "@/lib/remotion/editor-render/utils/draft.ts";

export class EditorImageElement extends EditorDisplayElement implements IElementOperation<'image'>{
  constructor(
    draftManager: DraftManager,
    id: string,
  ) {
    super(draftManager, id);
  }
  
  get elementData(){
    return super.elementData as ImageElement
  }
  
  get assetData(){
    const asset = getAsset(this.draftManager.state.draft, this.elementData)
    if(!asset) throw new ElementNotFoundError(this.elementData)
    return asset
  }
  
  update(element: Partial<Omit<ImageElement, "id">>): void {
    this.draftManager.updateElement(this.id, element)
  }
}