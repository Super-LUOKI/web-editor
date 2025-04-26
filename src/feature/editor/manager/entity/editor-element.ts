import { DraftManager } from "@/feature/editor/manager/draft-manager.ts";
import { AllElementType, AssetOfElementType, ElementOfType } from "@/lib/remotion/editor-render/schema/util.ts";

export interface IElementOperation<T extends AllElementType> {
    getAttribute<K extends keyof ElementOfType<T>>(key: K, placeholder?: ElementOfType<T>[K]): ElementOfType<T>[K] | undefined
    update(element: Partial<Omit<ElementOfType<T>, 'id'>>):void
}


export class EditorElement<T extends AllElementType = AllElementType> implements IElementOperation<T>{
  constructor(
      protected readonly draftManager: DraftManager,
      protected readonly id: string
  ){}

  get elementData(){
    return this.draftManager.state.draft.timeline.elements[this.id] as ElementOfType<T>;
  }

  get assetData(){
    return this.draftManager.state.draft.timeline.assets[this.id] as AssetOfElementType<T>
  }

  getAttribute<K extends keyof ElementOfType<T>>(key: K, placeholder?: ElementOfType<T>[K]): ElementOfType<T>[K] | undefined {
    const element = this.elementData as ElementOfType<T>;
    return element[key] ?? placeholder;
  }
  
  update(element: Partial<Omit<ElementOfType<T>, 'id'>>): void {
    this.draftManager.updateElement(this.id, element)
  }

}