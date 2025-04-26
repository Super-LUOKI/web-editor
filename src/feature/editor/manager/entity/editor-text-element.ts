import { DraftManager } from "@/feature/editor/manager/draft-manager.ts";
import { EditorDisplayElement } from "@/feature/editor/manager/entity/editor-display-element.ts";

export class EditorTextElement extends EditorDisplayElement<'text'>{
  constructor(
    draftManager: DraftManager,
    id: string,
  ) {
    super(draftManager, id);
  }
}