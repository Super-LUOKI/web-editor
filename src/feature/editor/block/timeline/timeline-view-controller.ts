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

  private getTrackUsedRanges(trackId: string, ignoreElementId?: string) {
    const track = this.draftManager.draft.timeline.tracks.find(t => t.id === trackId)
    if (!track) return undefined
    const trackUsedRanges: Range[] = track.clips
      .map(clip => {
        const elem = this.draftManager.getElement(clip.elementId)
        if (!elem || elem.id === ignoreElementId) {
          return undefined
        }
        return { start: elem.start, end: elem.start + elem.length }
      })
      .filter(Boolean)
      .sort((a, b) => a.start - b.start)

    return trackUsedRanges
  }

  getResizeRange(range: Range, targetElementId: string, direction: 'left' | 'right') {
    if (!range || range.start > range.end) return undefined

    let resizeRange: Range | undefined = undefined
    const trackId = this.draftManager.getTrackByElement(targetElementId)?.id
    if (!trackId) return undefined
    const trackUsedRanges = this.getTrackUsedRanges(trackId, targetElementId)
    if (!trackUsedRanges) return undefined

    let leftUsedRange = lodash.findLast(trackUsedRanges, r => r.start < range.start)
    let rightUsedRange = trackUsedRanges.find(r => r.end > range.end)

    const inTargetRangeRanges = trackUsedRanges.filter(
      usedRange => usedRange.start >= range.start && usedRange.end <= range.end
    )
    if (inTargetRangeRanges.length > 0) {
      if (direction === 'left') {
        leftUsedRange = inTargetRangeRanges.at(-1)
      } else {
        rightUsedRange = inTargetRangeRanges[0]
      }
    }

    if (!leftUsedRange && rightUsedRange) {
      resizeRange = {
        start: Math.max(0, range.start),
        end: Math.min(rightUsedRange.start, range.end),
      }
    } else if (leftUsedRange && !rightUsedRange) {
      resizeRange = {
        start: Math.max(leftUsedRange.end, range.start),
        end: range.end,
      }
    } else if (leftUsedRange && rightUsedRange) {
      console.log({
        rightRangeStart: rightUsedRange.start,
        leftRangeEnd: leftUsedRange.end,
      })
      resizeRange = {
        start: Math.max(leftUsedRange.end, range.start),
        end: Math.min(rightUsedRange.start, range.end),
      }
    }

    return resizeRange
  }

  getDropRange(range: Range, trackId: string, targetElementId: string) {
    let dropRange: Range | undefined = undefined

    const rangeLength = range.end - range.start
    if (!range || range.start >= range.end) return undefined
    const trackUsedRanges = this.getTrackUsedRanges(trackId, targetElementId)
    if (!trackUsedRanges) return undefined

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
      const end = Math.min(rightUsedRange.start, range.end)
      dropRange = { start: end - rangeLength, end }
      console.log('dropRange', dropRange)
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

  updatePixelPerSecond(pixel: number, followTimeIndicator: boolean = false) {
    this.setState(state => {
      state.pixelPerSecond = pixel
    })
  }
}
