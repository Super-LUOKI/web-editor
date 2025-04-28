import { RenderDraftData } from "@/lib/remotion/editor-render/schema/schema.ts";
import { AllElementType, ElementOfType } from "@/lib/remotion/editor-render/schema/util.ts";

export function getElementData<T extends AllElementType>(draft: RenderDraftData, id: string, type?: T){
  const elem = draft.timeline.elements[id];
  if(typeof type !== 'undefined' && elem.type !== type) {
    return undefined
  }
  return elem as ElementOfType<T>;
}