import Moveable from "moveable";
import { RefObject } from "react";

import { StateManager } from "@/common/object/state-manager.ts";
import { isHitControlBox } from "@/feature/editor/block/util/interaction.ts";
import { DraftManager } from "@/feature/editor/manager/draft-manager.ts";
import { EditorManager } from "@/feature/editor/manager/editor-manager.ts";
import { PlayerManager } from "@/feature/editor/manager/player-manager.ts";

type InitOptions = {
    interactionDomRef: RefObject<HTMLDivElement | null>
}
const initialState = {}

export class InteractionViewController extends StateManager<typeof initialState> {

  private disposers: (() => void)[] = [];
  private hoverMoveable = undefined as Moveable | undefined;
  private clickMoveable = undefined as Moveable | undefined;

  private selectedElementId = undefined as string | undefined;
  private isPlaying = false;


  constructor(
        private readonly playerManager: PlayerManager,
        private readonly draftManager: DraftManager,
        private readonly editorManager: EditorManager
  ) {
    super(initialState);
    this.disposers.push(
      this.editorManager.store.subscribe((state, prevState) => {
        if(state.selectedElementId === prevState.selectedElementId) return
        this.selectedElementId = state.selectedElementId
        this.updateByStateChange()
      })
    )

    this.disposers.push(
      this.playerManager.store.subscribe((state) => {
        if(state.isPlaying === this.isPlaying) return
        this.isPlaying = state.isPlaying
        this.updateByStateChange()
      })
    )
  }

  init(options: InitOptions) {
    const { interactionDomRef } = options
    const interactionDom = interactionDomRef.current
    const parent = interactionDomRef.current?.parentElement
    if (!interactionDom || !parent) return
    this.hoverMoveable = new Moveable(parent, { origin: false })
    this.clickMoveable = new Moveable(parent, {
      origin: false,
      renderDirections: ['nw', 'ne', 'sw', 'se'],
      rotatable: true,
      scalable: true,
      rotationPosition: 'bottom',
      draggable: true,
      keepRatio: true,
      useMutationObserver: true,
      useResizeObserver: true,
      snappable: true,
      snapDirections: { left: true, top: true, right: true, bottom: true, center: true, middle: true },
      elementSnapDirections: { left: true, top: true, right: true, bottom: true, center: true, middle: true },
      elementGuidelines: ['.__remotion-player'],
      snapRotationThreshold: 2,
      snapRotationDegrees: [0, 90, 180, 270],
      isDisplaySnapDigit: false,
    })
      
    const pointerMoveEventListener = this.handlePointerMove.bind(this);
    interactionDom.addEventListener('pointermove', pointerMoveEventListener)
    this.disposers.push(() => {
      interactionDom.removeEventListener('pointermove', pointerMoveEventListener)
    });

    const pointerLeaveEventListener = this.handlePointerLeave.bind(this);
    interactionDom.addEventListener('pointerleave', pointerLeaveEventListener)
    this.disposers.push(() => {
      interactionDom.removeEventListener('pointerleave', pointerLeaveEventListener)
    });

    const pointerDownEventListener = this.handlePointerDown.bind(this);
    interactionDom.addEventListener('pointerdown', pointerDownEventListener)
    this.disposers.push(() => {
      interactionDom.removeEventListener('pointerdown', pointerDownEventListener)
    });


  }
  
  

  updateClickTarget(elementId: string){
    if (!this.clickMoveable) return
    const moveable = this.clickMoveable
    const domEl = this.playerManager.getElementDOM(elementId)
    const draftEl = this.draftManager.getElement(elementId)
    if (!domEl) return
    this.clickMoveable.target = domEl
    if (draftEl.type === 'text') {
      moveable.keepRatio = false;
      moveable.resizable = true;
      moveable.scalable = false;
      moveable.renderDirections = ['w', 'e'];
    } else {
      moveable.scalable = true;
      moveable.keepRatio = true;
      moveable.resizable = false;
      moveable.renderDirections = ['nw', 'ne', 'sw', 'se'];
    }
    moveable.updateRect();
  }
  
  updateByStateChange(){
    if(!this.clickMoveable) return;
    const selectedElement = this.selectedElementId ? this.draftManager.getElement(this.selectedElementId) : undefined
    if (
      !selectedElement || 
        this.isPlaying || 
        !this.playerManager.isShowInCurrentTime(selectedElement)
    ) {
      this.clickMoveable.target = null;
      this.clickMoveable.updateRect()
    } else {
      this.updateClickTarget(selectedElement.id)
    }
  }

  handlePointerMove(e: PointerEvent){
    let el: HTMLElement | null | undefined = null
    if (!this.isPlaying) {
      const point = this.playerManager.getPlayerCoordinatesByPoint({ x: e.clientX, y: e.clientY })
      if (!point) return;
      const activeDraftElements = this.playerManager.getElementsByCoordinates(point)
      el = this.playerManager.getElementDOM(activeDraftElements[0]?.id)
    }
    if (this.clickMoveable?.target === el) {
      el = null;
    }

    if (this.clickMoveable?.isDragging()) {
      el = null;
    }
    if (this.hoverMoveable && this.hoverMoveable.target !== el) {
      this.hoverMoveable.target = el;
      this.hoverMoveable.updateRect();
    }
  }

  handlePointerDown(e: PointerEvent) {
    if (e.button !== 0) return;
    if (!this.clickMoveable) return
    let domEl: HTMLElement | undefined | null = undefined;
    let draftItem: { id: string } | undefined = undefined;
    const point = this.playerManager.getPlayerCoordinatesByPoint({ x: e.clientX, y: e.clientY })

    const startDrag = () => {
      let stop = false;
      window.addEventListener('pointerup', () => {
        stop = true;
      }, { once: true })

      setTimeout(() => {
        if (stop) return;
        if (!this.clickMoveable?.target) return;
        this.clickMoveable.dragStart(e)
      }, 10)
    }
    if (point) {
      draftItem = this.playerManager.getElementByCoordinate(point)
      if (draftItem) {
        domEl = this.playerManager.context?.box[draftItem.id]?.ref?.current
      }
    }

    // if already selected current element, drag directly
    if (!point && isHitControlBox(this.clickMoveable, e) || (domEl && domEl === this.clickMoveable?.target)) {
      startDrag()
      return
    }

    this.editorManager.selectElement(draftItem?.id)

    if (this.clickMoveable && this.clickMoveable.target !== domEl) {
      if (draftItem?.id) {
        this.updateClickTarget(draftItem.id);
      } else {
        this.clickMoveable.target = null;
        this.clickMoveable.updateRect()
      }
      if (!domEl) return;
      if (this.hoverMoveable) {
        this.hoverMoveable.target = null;
        this.hoverMoveable.updateRect()
      }
      startDrag()
    }
  }

  handlePointerLeave(){
    if (!this.hoverMoveable) return;
    this.hoverMoveable.target = null;
    this.hoverMoveable.updateRect()
  }
    
    


  destroy(): void {
    this.disposers.forEach(dispose => dispose())
    this.disposers = []
      
    this.hoverMoveable?.destroy()
    this.clickMoveable?.destroy()
    this.hoverMoveable = undefined
    this.clickMoveable = undefined
   
  }
}