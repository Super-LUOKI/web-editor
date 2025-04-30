import { DraftManager } from '@/feature/editor/manager/draft-manager.ts'
import { EditorDisplayElement } from '@/feature/editor/manager/entity/editor-display-element.ts'
import { ImageElement } from '@/lib/remotion/editor-render/schema/element.ts'

export class EditorImageElement extends EditorDisplayElement<'image'> {
  constructor(draftManager: DraftManager, id: string) {
    super(draftManager, id)
  }

  get elementData() {
    return super.elementData as ImageElement
  }
}
