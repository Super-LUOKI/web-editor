import { ElementFeature } from '@/feature/editor/type/error.ts'
import { AllElementType } from '@/lib/remotion/editor-render/schema/util.ts'

export class ElementTypeError extends Error {
  public element: ElementFeature

  constructor(element: ElementFeature, require: string | AllElementType) {
    super(`Element with ID ${element.id}(${element.type ?? ''}) is not of type ${require}.`)
    this.name = 'ElementTypeError'
    this.element = element
  }
}
