import lodash from 'lodash'

import { ApiRequestService } from '@/api'
import { cancelable } from '@/common/object/cancelable-enhance.ts'
import { StateManager } from '@/common/object/state-manager.ts'
import { ElementNotFoundError } from '@/feature/editor/manager/error/element-not-found-error.ts'
import { ElementTypeError } from '@/feature/editor/manager/error/element-type-error.ts'
import { TrackNotFoundedError } from '@/feature/editor/manager/error/track-not-founded-error.ts'
import {
  getElement,
  getElementData,
  getNearestFrame,
  getTrackByElement,
} from '@/feature/editor/util/draft.ts'
import { AllElement, DisplayElement } from '@/lib/remotion/editor-render/schema/element.ts'
import { RenderDraftData } from '@/lib/remotion/editor-render/schema/schema.ts'
import { AllElementType } from '@/lib/remotion/editor-render/schema/util.ts'
import {
  calculateDraftDuration,
  calculateDraftDurationInFrames,
  isDisplayElement,
  shallowWalkTracksElement,
} from '@/lib/remotion/editor-render/utils/draft.ts'
import { TrialDraft } from '@/lib/remotion/mock/trial.ts'

type bootstrapOptions = {
  videoId: string
}

const emptyDraft: RenderDraftData = {
  timeline: { elements: {}, assets: {}, tracks: [], fonts: [] },
  meta: { fps: 30, width: 1920, height: 1080 },
}

const initialState = { draft: emptyDraft, duration: 0, frameDuration: 0 }

export class DraftManager extends StateManager<typeof initialState> {
  private disposers: (() => void)[] = []

  constructor() {
    super(initialState)
  }

  get draft() {
    return this.state.draft
  }

  get timeline() {
    return this.state.draft.timeline
  }

  get meta() {
    return this.state.draft.meta
  }

  get fps() {
    return this.state.draft.meta.fps
  }

  get duration() {
    return this.state.duration
  }

  getElement<T extends AllElementType = AllElementType>(id: string, type?: T) {
    return getElement(this.draft, id, type)
  }

  getTrackByElement(elementId: string) {
    return getTrackByElement(this.draft, elementId)
  }

  moveToTrack(elementId: string, trackId: string) {
    const track = this.getTrackByElement(elementId)
    if (!track) throw new TrackNotFoundedError({})
    if (track.id === trackId) return

    const tracks = this.draft.timeline.tracks
    const sourceTrackIndex = tracks.findIndex(t => t.id === track.id)
    const targetTrackIndex = tracks.findIndex(t => t.id === trackId)

    if (sourceTrackIndex === -1 || targetTrackIndex === -1) {
      return
    }

    const clip = tracks[sourceTrackIndex].clips.find(c => c.elementId === elementId)
    if (!clip) return

    this.setState(state => {
      const sourceTrack = state.draft.timeline.tracks[sourceTrackIndex]
      const targetTrack = state.draft.timeline.tracks[targetTrackIndex]

      sourceTrack.clips = sourceTrack.clips.filter(clip => clip.elementId !== elementId)
      targetTrack.clips.push(clip)
    })
  }

  updateElement<T extends AllElement>(id: string, element: Partial<Omit<T, 'id'>>) {
    this.setState(state => {
      const rawElement = getElementData(state.draft, id)
      if (!rawElement) throw new ElementNotFoundError({ id })
      Object.assign(rawElement, element)
    })
  }

  getNearestFrameTime(time: number) {
    const { time: frameTime } = getNearestFrame(time, this.fps)
    return Math.max(0, Math.min(this.state.duration, frameTime))
  }

  updateDisplayElement(id: string, element: Partial<DisplayElement>) {
    const fullElem = this.getElement(id)
    if (!isDisplayElement(fullElem)) {
      throw new ElementTypeError(fullElem, 'DisplayElement')
    }
    this.updateElement(id, element)
  }

  async getDraftData(videoId: string) {
    const isMock = true
    if (!isMock) {
      return await ApiRequestService.get<RenderDraftData>(
        '/demo/story',
        {},
        { timeout: 20 * 60 * 1000 }
      )
    }
    return TrialDraft
  }

  getTrackByElementId(elementId: string) {
    return this.draft.timeline.tracks.find(track => {
      return track.clips.findIndex(clip => clip.elementId === elementId) !== -1
    })
  }

  getIntersectingElements(
    range: { start: number; length: number },
    trackId: string,
    isNeeded?: (element: AllElement) => boolean
  ) {
    const elems = [] as AllElement[]
    const track = this.draft.timeline.tracks.find(t => t.id === trackId)
    if (!track) return elems
    const { start, length } = range

    shallowWalkTracksElement(this.draft, [track], element => {
      const { start: elementStart, length: elementLength } = element
      const rangeEnd = start + length
      const elementEnd = elementStart + elementLength
      if (
        (start >= elementStart && start <= elementEnd) ||
        (rangeEnd >= elementStart && rangeEnd <= elementEnd) ||
        (elementStart >= start && elementStart <= rangeEnd) ||
        (elementEnd >= start && elementEnd <= rangeEnd)
      ) {
        if (isNeeded && isNeeded(element)) {
          elems.push(element)
        }
      }
    })
    return elems
  }

  async _bootstrap(options: bootstrapOptions) {
    const { videoId } = options
    this.disposers.push(
      this.store.subscribe(
        lodash.debounce((state: typeof initialState) => {
          this.setState(storeState => {
            storeState.duration = calculateDraftDuration(state.draft)
          })
        }, 200)
      )
    )
    const draftDataPromise = cancelable(this.getDraftData(videoId))
    this.disposers.push(draftDataPromise.cancel.bind(draftDataPromise))

    const draftData = await draftDataPromise
    this.setDraft(draftData)
  }

  private _bootstrapTimer: ReturnType<typeof setTimeout> | undefined = undefined
  /** todo: test */
  async bootstrap(options: bootstrapOptions) {
    if (this._bootstrapTimer) {
      clearTimeout(this._bootstrapTimer)
    }
    this._bootstrapTimer = setTimeout(() => this._bootstrap(options), 500)
  }

  destroy(): void | Promise<void> {
    this.disposers.forEach(disposer => disposer())
    this.disposers = []
  }

  setDraft(draft: RenderDraftData) {
    this.setState(state => {
      state.draft = draft
      state.duration = calculateDraftDuration(draft)
      state.frameDuration = calculateDraftDurationInFrames(draft)
    })
  }
}
