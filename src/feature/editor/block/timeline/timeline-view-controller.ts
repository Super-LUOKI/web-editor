import { GenericManager } from '@/common/object/generic-manager.ts'

type InitOptions = {
  tes: string
}
const initialState = { pixelPerSecond: 300, maxDuration: 5 * 60 }

export class TimelineViewController extends GenericManager<typeof initialState, InitOptions> {
  constructor() {
    super(initialState)
  }

  private _timelineContentDomContainer: HTMLElement | null = null

  get timelineContentDomContainer() {
    return this._timelineContentDomContainer
  }

  get timelineContentDomRect() {
    return this._timelineContentDomContainer?.getBoundingClientRect()
  }

  setTimelineContentDomContainer(dom: HTMLElement | null) {
    this._timelineContentDomContainer = dom
  }

  onInit(): void | Promise<void> {}

  onDestroy(): void | Promise<void> {
    return super.onDestroy()
  }

  updatePixelPerSecond(pixel: number) {
    this.setState(state => {
      state.pixelPerSecond = pixel
    })
  }
}
