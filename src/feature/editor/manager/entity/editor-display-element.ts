import { DraftManager } from '@/feature/editor/manager/draft-manager.ts'
import { EditorElement } from '@/feature/editor/manager/entity/editor-element.ts'
import { AllElementType } from '@/lib/remotion/editor-render/schema/util.ts'

export abstract class EditorDisplayElement<
  T extends AllElementType = AllElementType,
> extends EditorElement<T> {
  constructor(draftManager: DraftManager, id: string) {
    super(draftManager, id)
  }
}
