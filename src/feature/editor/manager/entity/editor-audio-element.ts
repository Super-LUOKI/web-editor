import { DraftManager } from "@/feature/editor/manager/draft-manager.ts";
import { EditorElement, IElementOperation } from "@/feature/editor/manager/entity/editor-element.ts";
import { AudioElement } from "@/lib/remotion/editor-render/schema/element.ts";

export class EditorAudioElement extends EditorElement implements IElementOperation<'audio'>{
  constructor(
    draftManager: DraftManager,
    id: string,
  ) {
    super(draftManager, id);
  }

  update(element: Partial<Omit<AudioElement, "id">>): void {
    this.draftManager.updateElement(this.id, element)
  }
}