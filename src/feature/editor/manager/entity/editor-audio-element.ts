import { DraftManager } from '@/feature/editor/manager/draft-manager.ts'
import { EditorElement } from '@/feature/editor/manager/entity/editor-element.ts'

export class EditorAudioElement extends EditorElement<'audio'> {
  constructor(draftManager: DraftManager, id: string) {
    super(draftManager, id)
  }
}
