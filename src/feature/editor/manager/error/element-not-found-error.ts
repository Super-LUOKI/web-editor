import { AllElement } from "@/lib/remotion/editor-render/schema/element.ts";

export class ElementNotFoundError extends Error {
  public element: Pick<AllElement, 'type' | 'id'>;

  constructor(element: Pick<AllElement, 'type' | 'id'>) {
    super(`Element with ID ${element.id}(${element.type ?? ''}) not found.`);
    this.name = "ElementNotFoundError";
    this.element = element;
  }
}