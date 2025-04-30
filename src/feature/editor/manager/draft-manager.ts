import lodash from "lodash";

import { GenericManager } from "@/common/object/generic-manager.ts";
import { ElementNotFoundError } from "@/feature/editor/manager/error/element-not-found-error.ts";
import { ElementTypeError } from "@/feature/editor/manager/error/element-type-error.ts";
import { editorMockDraft } from "@/feature/editor/util";
import { getElementData } from "@/feature/editor/util/draft.ts";
import {
  AllElement,
  DisplayElement,
} from "@/lib/remotion/editor-render/schema/element.ts";
import { RenderDraftData } from "@/lib/remotion/editor-render/schema/schema.ts";
import { AllElementType } from "@/lib/remotion/editor-render/schema/util.ts";
import {
  calculateDraftDuration,
  isDisplayElement,
} from "@/lib/remotion/editor-render/utils/draft.ts";
type InitOptions = {
  videoId: string;
};

const emptyDraft: RenderDraftData = {
  timeline: { elements: {}, assets: {}, tracks: [], fonts: [] },
  meta: { fps: 30, width: 1920, height: 1080 },
};

const initialState = { draft: emptyDraft, duration: 0 };

export class DraftManager extends GenericManager<
  typeof initialState,
  InitOptions
> {
  constructor() {
    super(initialState);
  }

  get draft() {
    return this.state.draft;
  }

  get timeline() {
    return this.state.draft.timeline;
  }

  get meta() {
    return this.state.draft.meta;
  }

  getElement<T extends AllElementType = AllElementType>(id: string, type?: T) {
    const element = this.state.draft.timeline.elements[id];
    if (!element) throw new ElementNotFoundError({ id, type });

    if (type && element.type !== type)
      throw new ElementNotFoundError({ id, type });

    return element;
  }

  updateElement<T extends AllElement>(
    id: string,
    element: Partial<Omit<T, "id">>,
  ) {
    this.setState((state) => {
      const rawElement = getElementData(state.draft, id);
      if (!rawElement) throw new ElementNotFoundError({ id });
      Object.assign(rawElement, element);
    });
  }

  updateDisplayElement(id: string, element: Partial<DisplayElement>) {
    const fullElem = this.getElement(id);
    if (!isDisplayElement(fullElem)) {
      throw new ElementTypeError(fullElem, "DisplayElement");
    }
    this.updateElement(id, element);
  }

  async getDraftData(videoId: string) {
    console.log("mock draft data", videoId);
    return editorMockDraft;
  }

  async onInit(options: InitOptions) {
    const { videoId } = options;
    this.addDisposers(
      this.store.subscribe(
        lodash.debounce((state: typeof initialState) => {
          this.setState((storeState) => {
            storeState.duration = calculateDraftDuration(state.draft);
          });
        }, 200),
      ),
    );

    const draftData = await this.getDraftData(videoId);
    this.setDraft(draftData);
  }

  onDestroy(): void | Promise<void> {
    return super.onDestroy();
  }

  setDraft(draft: RenderDraftData) {
    this.setState((state) => {
      state.draft = draft;
    });
  }
}
