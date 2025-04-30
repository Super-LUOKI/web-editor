import { StateManager } from '@/common/object/state-manager.ts'
import { DraftManager } from '@/feature/editor/manager/draft-manager.ts'
import { pointRotate } from '@/feature/editor/util/algorithm.ts'
import { DraftPlayerRef } from '@/lib/remotion/editor-render/draft-player.tsx'
import { Point } from '@/lib/remotion/editor-render/schema/common.ts'
import { AllElement, DisplayElement } from '@/lib/remotion/editor-render/schema/element.ts'
import {
  isDisplayElement,
  shallowWalkTracksElement,
} from '@/lib/remotion/editor-render/utils/draft.ts'

const initialState = {
  isPlaying: false,
  isBuffering: false,
  currentTime: 0,
}

export class PlayerManager extends StateManager<typeof initialState> {
  private _player: DraftPlayerRef['player'] | null = null
  private _context: DraftPlayerRef['context'] | null = null
  private playerEventListenerDisposers: (() => void)[] = []

  get context() {
    return this._context
  }

  get player() {
    return this._player
  }

  constructor(private readonly draftManager: DraftManager) {
    super(initialState)
  }

  play() {
    // todo global media play manager
    this._player?.play()
  }

  pause() {
    this._player?.pause()
  }

  private onPlay() {
    this.setState(state => {
      state.isPlaying = true
    })
  }

  private onPause() {
    this.setState(state => {
      state.isPlaying = false
    })
  }

  private onWaiting() {
    this.setState(state => {
      state.isBuffering = true
    })
  }

  private onResume() {
    this.setState(state => {
      state.isBuffering = false
    })
  }

  private onTimeUpdate(payload: { detail: { frame: number } }) {
    const time = payload.detail.frame / this.draftManager.meta.fps
    this.setState(state => {
      state.currentTime = time
    })
  }

  setPlayer(player: DraftPlayerRef['player'] | null) {
    if (this._player === player) return
    this.playerEventListenerDisposers.forEach(fn => fn())
    this._player = player
    this.setState(state => {
      state.isPlaying = false
      state.isBuffering = false
    })

    if (!this._player) return
    const handlePlay = this.onPlay.bind(this)
    const handlePause = this.onPause.bind(this)
    const handleTimeUpdate = this.onTimeUpdate.bind(this)
    const handleWaiting = this.onWaiting.bind(this)
    const handleResume = this.onResume.bind(this)

    this._player.addEventListener('play', handlePlay)
    this.playerEventListenerDisposers.push(() => {
      this._player?.removeEventListener('play', handlePlay)
    })

    this._player.addEventListener('pause', handlePause)
    this.playerEventListenerDisposers.push(() => {
      this._player?.removeEventListener('pause', handlePause)
    })

    this._player.addEventListener('ended', handlePause)
    this.playerEventListenerDisposers.push(() => {
      this._player?.removeEventListener('ended', handlePause)
    })

    this._player.addEventListener('error', handlePause)
    this.playerEventListenerDisposers.push(() => {
      this._player?.removeEventListener('error', handlePause)
    })

    this._player.addEventListener('frameupdate', handleTimeUpdate)
    this.playerEventListenerDisposers.push(() => {
      this._player?.removeEventListener('frameupdate', handleTimeUpdate)
    })

    this._player.addEventListener('waiting', handleWaiting)
    this.playerEventListenerDisposers.push(() => {
      this._player?.removeEventListener('waiting', handleWaiting)
    })

    this._player.addEventListener('resume', handleResume)
    this.playerEventListenerDisposers.push(() => {
      this._player?.removeEventListener('resume', handleResume)
    })
  }

  setContext(context: DraftPlayerRef['context'] | null) {
    this._context = context
  }

  getPlayerCoordinatesByPoint(point: Point): Point | undefined {
    const { x: rawX, y: rawY } = point
    const playerEl = this._player?.getContainerNode?.()?.children?.[0]
    if (!playerEl) return undefined
    const scale = this._player?.getScale() || 1
    const playerRect = playerEl.getBoundingClientRect()
    const clientPoint: Point = {
      x: rawX - playerRect.left,
      y: rawY - playerRect.top,
    }

    if (clientPoint.x < 0 || clientPoint.x > playerRect.width) return undefined
    if (clientPoint.y < 0 || clientPoint.y > playerRect.height) return undefined

    return {
      x: (clientPoint.x - playerRect.width / 2) / scale,
      y: (clientPoint.y - playerRect.height / 2) / scale,
    }
  }

  isShowInCurrentTime(element: AllElement) {
    const { start, length } = element
    const time = this.state.currentTime
    return time >= start && time <= start + length
  }

  // todo 这个函数还需要理解，不一定准确
  isHit(coordinate: Point, element: DisplayElement) {
    const item = this._context?.box[element.id]
    if (!item?.ref?.current) return
    const rect = item.ref.current.getBoundingClientRect()
    if (!rect) return false

    const p1 = { x: coordinate.x - element.x, y: coordinate.y - element.y }

    const style = getComputedStyle(item.ref.current)
    const size = {
      width: Math.abs(Number.parseInt(style.width)) * (element.scaleX || 1),
      height: Math.abs(Number.parseInt(style.height)) * (element.scaleY || 1),
    }
    if (isNaN(size.width) || isNaN(size.height)) return false

    const p2 = pointRotate(p1, -((element?.rotate || 0) / 180) * Math.PI)

    return (
      p2.x <= size.width * 0.5 &&
      p2.y <= size.height * 0.5 &&
      p2.x >= -size.width * 0.5 &&
      p2.y >= -size.height * 0.5
    )
  }

  getElementsByCoordinates(point: Point): AllElement[] {
    const scale = this._player?.getScale()
    const time = this.state.currentTime
    if (!scale || time < 0) return []

    const elements: AllElement[] = []
    const draft = this.draftManager.state.draft
    shallowWalkTracksElement(draft, draft.timeline.tracks, el => {
      if (!isDisplayElement(el)) return
      if (this.isShowInCurrentTime(el) && this.isHit(point, el)) {
        elements.push(el)
      }
    })

    return elements
  }

  getElementByCoordinate(point: Point): AllElement {
    return this.getElementsByCoordinates(point)?.[0]
  }

  getElementDOM(elementId: string | undefined) {
    if (!elementId) return undefined
    return this._context?.box[elementId]?.ref?.current
  }
}
