import { GenericManager } from "@/common/object/generic-manager.ts";

const initialState = { pixelPerSecond: 10, maxDuration: 5 * 60 }

export class TimelineViewController extends GenericManager<typeof initialState> {


  constructor() {
    super(initialState)
  }


  onInit(): void | Promise<void> {

  }


  updatePixelPerSecond(pixel: number) {
    console.log({ pixel })
    this.setState(state => {
      state.pixelPerSecond = pixel
    })
  }
}