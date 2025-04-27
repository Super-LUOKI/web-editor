import { StateManager } from "@/common/object/state-manager.ts";

const initialState = { selectedElementId: undefined as string | undefined }
export class EditorManager  extends StateManager<typeof initialState>{

  constructor() {
    super(initialState)
  }

  selectElement(elementId: string | undefined) {
    this.setState(state => {
      state.selectedElementId = elementId
    })
  }

}