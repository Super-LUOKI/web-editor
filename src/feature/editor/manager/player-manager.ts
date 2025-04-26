import { immer } from "zustand/middleware/immer";
import { createStore } from "zustand/vanilla";

import { DraftManager } from "@/feature/editor/manager/draft-manager.ts";
import { pointRotate } from "@/feature/editor/util/algorithm.ts";
import { DraftPlayerRef } from "@/lib/remotion/editor-render/draft-player.tsx";
import { Point } from "@/lib/remotion/editor-render/schema/common.ts";
import { AllElement, DisplayElement } from "@/lib/remotion/editor-render/schema/element.ts";
import { isDisplayElement, shallowWalkTracksElement } from "@/lib/remotion/editor-render/utils/draft.ts";
import { initState } from "@/lib/zustand/util.ts";

const initialState = {
  isPlaying: false,
  isBuffering: false,
  currentTime: 0,
}

export class PlayerManager {
  readonly store = createStore(immer(initState(initialState)))
  private player: DraftPlayerRef['player'] | null = null;
  private context: DraftPlayerRef['context'] | null = null;

  constructor(private readonly draftManager: DraftManager) {
  }

  get state() {
    return this.store.getState()
  }

  private onPlay() {
    this.store.setState(state => {
      state.isPlaying = true
    });
  }

  private onPause() {
    this.store.setState(state => {
      state.isPlaying = false
    });
  }

  private onWaiting() {
    this.store.setState(state => {
      state.isBuffering = true;
    });
  }

  private onResume() {
    this.store.setState(state => {
      state.isBuffering = false;
    });
  }

  private onTimeUpdate(payload: { detail: { frame: number } }) {
    const time = payload.detail.frame / this.draftManager.meta.fps;
    this.store.setState({ currentTime: time, });
  }

  setPlayer(player: DraftPlayerRef['player'] | null) {
    if (this.player === player) return;
    const oldPlayer = this.player;
    this.player = player;
    this.store.setState(state => {
      state.isPlaying = false;
      state.isBuffering = false;
    });

    if (this.player) {
      this.player.addEventListener('play', this.onPlay);
      this.player.addEventListener('pause', this.onPause);
      this.player.addEventListener('ended', this.onPause);
      this.player.addEventListener('error', this.onPause);
      this.player.addEventListener('frameupdate', this.onTimeUpdate);
      this.player.addEventListener('waiting', this.onWaiting);
      this.player.addEventListener('resume', this.onResume);
    }
    if (oldPlayer) {
      oldPlayer.removeEventListener('play', this.onPlay);
      oldPlayer.removeEventListener('pause', this.onPause);
      oldPlayer.removeEventListener('ended', this.onPause);
      oldPlayer.removeEventListener('error', this.onPause);
      oldPlayer.removeEventListener('frameupdate', this.onTimeUpdate);
      oldPlayer.removeEventListener('waiting', this.onWaiting);
      oldPlayer.removeEventListener('resume', this.onResume);
    }
  }

  setContext(context: DraftPlayerRef['context'] | null) {
    this.context = context
  }

  getPlayerCoordinatesByPoint(point: Point): Point | undefined {
    const { x: rawX, y: rawY } = point
    const playerEl = this.player?.getContainerNode?.()?.children?.[0];
    if (!playerEl) return undefined;
    const scale = this.player?.getScale() || 1;
    const playerRect = playerEl.getBoundingClientRect();
    const clientPoint: Point = {
      x: rawX - playerRect.left,
      y: rawY - playerRect.top
    }

    if (clientPoint.x < 0 || clientPoint.x > playerRect.width) return undefined;
    if (clientPoint.y < 0 || clientPoint.y > playerRect.height) return undefined;

    return {
      x: (clientPoint.x - playerRect.width / 2) / scale,
      y: (clientPoint.y - playerRect.height / 2) / scale,
    }
  }

  isShowInCurrentTime(element: AllElement) {
    const { start, length } = element
    const time = this.state.currentTime;
    return time >= start && time <= start + length
  }

  // todo 这个函数还需要理解，不一定准确
  isHit(coordinate: Point, element: DisplayElement) {
    const item = this.context?.box[element.id]
    if (!item?.ref?.current) return;
    const rect = item.ref.current.getBoundingClientRect()
    if (!rect) return false;

    const p1 = { x: coordinate.x - element.x, y: coordinate.y - element.y }

    const style = getComputedStyle(item.ref.current)
    const size = {
      width: Math.abs(Number.parseInt(style.width)) * (element.scaleX || 1),
      height: Math.abs(Number.parseInt(style.height)) * (element.scaleY || 1),
    }
    if (isNaN(size.width) || isNaN(size.height)) return false;

    const p2 = pointRotate(p1, -((element?.rotate || 0) / 180) * Math.PI)

    return (
      p2.x <= size.width * 0.5 &&
      p2.y <= size.height * 0.5 &&
      p2.x >= -size.width * 0.5 &&
      p2.y >= -size.height * 0.5
    )

  }

  getElementsByCoordinates(point: Point): AllElement[] {
    const scale = this.player?.getScale();
    const time = this.state.currentTime;
    if (!scale || time < 0) return []

    const elements: AllElement[] = []
    const draft = this.draftManager.state.draft
    shallowWalkTracksElement(draft, draft.timeline.tracks, (el) => {
      if (!isDisplayElement(el)) return
      if (this.isShowInCurrentTime(el) && this.isHit(point, el)) {
        elements.push(el)
      }
    })

    return elements
  }

  getElementDOM(elementId: string | undefined) {
    if (!elementId) return undefined
    return this.context?.box[elementId]?.ref?.current
  }


}