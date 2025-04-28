import { ElementFeature } from "@/feature/editor/type/error.ts";

export class ElementNotFoundError extends Error {
  public element: ElementFeature;

  constructor(element: ElementFeature) {
    super(`Element with ID ${element.id}(${element.type ?? ''}) not found.`);
    this.name = "ElementNotFoundError";
    this.element = element;
  }
}