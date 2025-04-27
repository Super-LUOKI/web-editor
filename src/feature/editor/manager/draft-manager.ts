import { immer } from "zustand/middleware/immer";
import { createStore } from "zustand/vanilla";

import { EditorAudioElement } from "@/feature/editor/manager/entity/editor-audio-element.ts";
import { EditorImageElement } from "@/feature/editor/manager/entity/editor-image-element.ts";
import { EditorTextElement } from "@/feature/editor/manager/entity/editor-text-element.ts";
import { ElementNotFoundError } from "@/feature/editor/manager/error/element-not-found-error.ts";
import { AllElement } from "@/lib/remotion/editor-render/schema/element.ts";
import { RenderDraftData } from "@/lib/remotion/editor-render/schema/schema.ts";
import { AllElementType } from "@/lib/remotion/editor-render/schema/util.ts";
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

  getElementInstance<T extends AllElementType>(id: string, type: T){

    const element = this.state.draft.timeline.elements[id]
    if(!element) throw new ElementNotFoundError({ id, type });
    
    switch(type){
      case 'image':
        return new EditorImageElement(this, id);
      case 'text':
        return new EditorTextElement(this, id);
      case "audio":
        return new EditorAudioElement(this, id);
      default:
        throw new ElementNotFoundError({ id, type })
    }
  }

  getElementData<T extends AllElementType = AllElementType>(id: string, type?: T){
    const element = this.state.draft.timeline.elements[id]
    if(!element) throw new ElementNotFoundError({ id, type });

    if(type && element.type !== type) throw new ElementNotFoundError({ id, type });

    return element;
  }

  updateElement(id: string, element: Partial<Omit<AllElement, "id">>){
    console.log("update element", id, element)
  }

  destroy(){
    this.disposers.forEach((dispose) => dispose());
    this.store.setState(initState)
  }
}