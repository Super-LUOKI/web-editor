import { DraftManager } from "@/feature/editor/manager/draft-manager.ts";
import { EditorDisplayElement } from "@/feature/editor/manager/entity/editor-display-element.ts";
import { IElementOperation } from "@/feature/editor/manager/entity/editor-element.ts";
import { TextElement } from "@/lib/remotion/editor-render/schema/element.ts";

export class EditorTextElement extends EditorDisplayElement implements IElementOperation<'text'>{
  constructor(
    draftManager: DraftManager,
    id: string,
  ) {
    super(draftManager, id);
  }
  
  update(element: Partial<Omit<TextElement, "id">>): void {
    this.draftManager.updateElement(this.id, element)
  }
}