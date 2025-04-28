import { immer } from "zustand/middleware/immer";
import { createStore } from "zustand/vanilla";

import { ElementNotFoundError } from "@/feature/editor/manager/error/element-not-found-error.ts";
import { ElementTypeError } from "@/feature/editor/manager/error/element-type-error.ts";
import { getElementData } from "@/feature/editor/util/draft.ts";
import { AllElement, DisplayElement } from "@/lib/remotion/editor-render/schema/element.ts";
import { RenderDraftData } from "@/lib/remotion/editor-render/schema/schema.ts";
import { AllElementType } from "@/lib/remotion/editor-render/schema/util.ts";
import { isDisplayElement } from "@/lib/remotion/editor-render/utils/draft.ts";
import { initState } from "@/lib/zustand/util.ts";

const emptyDraft:RenderDraftData = {
  timeline: { elements: {}, assets: {}, tracks: [], fonts: [] },
  meta: { fps: 30, width: 1920, height: 1080 },
    
}

const initialState = { draft: emptyDraft }

export class DraftManager{
  readonly store = createStore(immer(initState(initialState)))
  private disposers: (() => void)[] = [];

  constructor(
    draft: RenderDraftData
  ){
    this.store.setState((state) => {
      state.draft = draft;
    });
  }

  get state(){
    return this.store.getState();
  }

  get timeline(){
    return this.state.draft.timeline;
  }

  get meta(){
    return this.state.draft.meta;
  }

  getElement<T extends AllElementType = AllElementType>(id: string, type?: T){
    const element = this.state.draft.timeline.elements[id]
    if(!element) throw new ElementNotFoundError({ id, type });

    if(type && element.type !== type) throw new ElementNotFoundError({ id, type });

    return element;
  }

  updateElement<T extends AllElement>(id: string, element: Partial<Omit<T, "id">>){
    this.store.setState(state => {
      const rawElement = getElementData(state.draft, id);
      if(!rawElement) throw new ElementNotFoundError({ id });
      Object.assign(rawElement, element);
      
    })
  }

  updateDisplayElement(id: string, element: Partial<DisplayElement>){
    const fullElem = this.getElement(id)
    if(!isDisplayElement(fullElem)) {
      throw new ElementTypeError(fullElem, 'DisplayElement');
    }
    this.updateElement(id, element);
  }

  destroy(){
    this.disposers.forEach((dispose) => dispose());
    this.store.setState(initState)
  }
}