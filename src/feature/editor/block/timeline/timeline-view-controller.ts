import lodash from 'lodash'

import { GenericManager } from '@/common/object/generic-manager.ts'
import { DraftManager } from '@/feature/editor/manager/draft-manager.ts'

type InitOptions = {
  tes: string
}

type Range = {
  start: number
  end: number
}

const initialState = { pixelPerSecond: 300, maxDuration: 5 * 60 }

export class TimelineViewController extends GenericManager<typeof initialState, InitOptions> {
  constructor(private readonly draftManager: DraftManager) {
    super(initialState)
  }

  private _timelineContentDomContainer: HTMLElement | null = null
  private _timelineIndicatorDom: HTMLElement | null = null

  get timelineContentDomContainer() {
    return this._timelineContentDomContainer
  }

  get timelineIndicatorDom() {
    return this._timelineIndicatorDom
  }

  get timelineContentDomRect() {
    return this._timelineContentDomContainer?.getBoundingClientRect()
  }

  setTimelineContentDomContainer(dom: HTMLElement | null) {
    this._timelineContentDomContainer = dom
  }

  setTimelineIndicatorDom(dom: HTMLElement | null) {
    this._timelineIndicatorDom = dom
  }

  onInit(): void | Promise<void> {}

  onDestroy(): void | Promise<void> {
    return super.onDestroy()
  }

  getAvailableTrackRange(trackId: string) {
    const availableRanges: Range[] = []
    const track = this.draftManager.draft.timeline.tracks.find(t => t.id === trackId)
    if (!track) return availableRanges
    const trackUsedRanges: Range[] = track.clips
      .map(clip => {
        const elem = this.draftManager.getElement(clip.elementId)
        if (!elem) return undefined
        return { start: elem.start, end: elem.start + elem.length }
      })
      .filter(Boolean)
      .sort((a, b) => a.start - b.start)

    const availableStart = 0
    const availableEnd = trackUsedRanges[0]?.start || Infinity
    if (availableEnd > availableStart) {
      availableRanges.push({ start: availableStart, end: availableEnd })
    }

    for (let i = 0; i < trackUsedRanges.length; i++) {
      const usedRange = trackUsedRanges[i]
      const nextUsedRange = trackUsedRanges[i + 1]
      if (!nextUsedRange) {
        availableRanges.push({ start: usedRange.end, end: Infinity })
        break
      }
      if (usedRange.end < nextUsedRange.start) {
        availableRanges.push({ start: usedRange.end, end: nextUsedRange.start })
      }
    }

    return availableRanges
  }

  getDropRange(range: Range, trackId: string, targetElementId: string) {
    let dropRange: Range | undefined = undefined

    const rangeLength = range.end - range.start
    if (!range || range.start >= range.end) return undefined
    const track = this.draftManager.draft.timeline.tracks.find(t => t.id === trackId)
    if (!track) return undefined

    const trackUsedRanges: Range[] = track.clips
      .map(clip => {
        const elem = this.draftManager.getElement(clip.elementId)
        if (!elem || elem.id === targetElementId) {
          return undefined
        }
        return { start: elem.start, end: elem.start + elem.length }
      })
      .filter(Boolean)
      .sort((a, b) => a.start - b.start)

    const leftUsedRangeIndex = lodash.findLastIndex(trackUsedRanges, r => r.start <= range.start)
    const rightUsedRangeIndex = lodash.findIndex(trackUsedRanges, r => r.end >= range.end)
    // no any clip in the left/right side
    if (leftUsedRangeIndex === -1 && rightUsedRangeIndex === -1) {
      dropRange = range
    }
    // current range is in one of clips
    if (rightUsedRangeIndex === leftUsedRangeIndex) {
      return undefined
    }

    const leftUsedRange = trackUsedRanges[leftUsedRangeIndex] as Range | undefined
    const rightUsedRange = trackUsedRanges[rightUsedRangeIndex] as Range | undefined

    if (!leftUsedRange && rightUsedRange) {
      if (rightUsedRange.start < rangeLength) return undefined
      const end = Math.min(rightUsedRange.start - rangeLength, range.end)
      dropRange = { start: end - range.start, end }
    }
    if (leftUsedRange && !rightUsedRange) {
      const start = Math.max(leftUsedRange.end, range.start)
      dropRange = { start, end: start + rangeLength }
    }
    if (leftUsedRange && rightUsedRange) {
      if (rightUsedRange.start - leftUsedRange.end < rangeLength) return undefined
      const start = Math.min(
        rightUsedRange.start - rangeLength,
        Math.max(leftUsedRange.end, range.start)
      )
      dropRange = { start, end: start + rangeLength }
    }

    const hasUsedInTargetRange = trackUsedRanges.some(
      usedRange => usedRange.start >= range.start && usedRange.end <= range.end
    )
    if (hasUsedInTargetRange) {
      return undefined
    }

    return dropRange
  }

  updatePixelPerSecond(pixel: number) {
    this.setState(state => {
      state.pixelPerSecond = pixel
    })
  }
}
