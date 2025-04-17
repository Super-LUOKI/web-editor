import { DraftManager } from "@/feature/editor/manager/draft-manager.ts";
import {  AllElementType, ElementOfType } from "@/lib/remotion/editor-render/schema/util.ts";

export interface IElementOperation<T extends AllElementType> {
    update(element: Partial<Omit<ElementOfType<T>, 'id'>>):void
}

export abstract class EditorElement {
  constructor(
      protected readonly draftManager: DraftManager,
      protected readonly id: string
  ){}

  get elementData(){
    return this.draftManager.state.draft.timeline.elements[this.id]
  }
}