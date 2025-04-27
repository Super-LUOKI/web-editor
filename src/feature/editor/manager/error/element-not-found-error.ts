import { AllElement } from "@/lib/remotion/editor-render/schema/element.ts";
import { OptionalField } from "@/type/tool";

type ElementNotFoundPayload = OptionalField<Pick<AllElement, 'type' | 'id'>, 'type'>
export class ElementNotFoundError extends Error {
  public element: ElementNotFoundPayload;

  constructor(element: ElementNotFoundPayload) {
    super(`Element with ID ${element.id}(${element.type ?? ''}) not found.`);
    this.name = "ElementNotFoundError";
    this.element = element;
  }
}