import lodash from 'lodash';
import Moveable from "moveable";
import { RefObject } from "react";

import { StateManager } from "@/common/object/state-manager.ts";
import { isHitControlBox } from "@/feature/editor/block/util/interaction.ts";
import { DraftManager } from "@/feature/editor/manager/draft-manager.ts";
import { EditorManager } from "@/feature/editor/manager/editor-manager.ts";
import { PlayerManager } from "@/feature/editor/manager/player-manager.ts";
import { isDisplayElement } from "@/lib/remotion/editor-render/utils/draft.ts";
import { observeElementSize } from "@/util/dom.ts";

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
        this.updateClickMoveableByState()
        this.refreshMoveableListeners()
      })
    )

    this.disposers.push(
      this.playerManager.store.subscribe((state) => {
        if(state.isPlaying === this.isPlaying) return
        this.isPlaying = state.isPlaying
        this.updateClickMoveableByState()
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

    this.disposers.push(observeElementSize(interactionDom, this.updateMoveableByElementSize.bind(this)))


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
  
  updateClickMoveableByState(){
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

  updateMoveableByElementSize(){
    // wait for the dom update
    setTimeout(() => {
      this.hoverMoveable?.updateRect();
      this.clickMoveable?.updateRect();
    }, 50)

  }

  refreshMoveableListeners(){
    const clickMoveable = this.clickMoveable
    const selectedElementId = this.selectedElementId
    if (!selectedElementId || !clickMoveable) return;
    clickMoveable.off();

    const getInitialDiff = () => {
      return {
        x: 0,
        y: 0,
        rotate: 0,
        scaleX: 1,
        scaleY: 1,
        width: 0,
        height: 0,
      };
    };
    
    const startData = { transform: '', width: 0, height: 0 };
    let diff = getInitialDiff()
    
    const handleStart = () => {
      const target = clickMoveable.target as HTMLElement | undefined;
      if(!target) return

      // collect init data
      const rect = clickMoveable.getRect()
      startData.width = rect.offsetWidth;
      startData.height = rect.offsetHeight
      startData.transform = target.style.transform

      // init diff data
      diff = getInitialDiff()
    }

    const handleEnd = ()=>{
      // collect final data

      if(lodash.isEqual(diff, getInitialDiff())) return;
      const draftEl = this.draftManager.getElement(selectedElementId)
      if(!draftEl || !isDisplayElement(draftEl)) return;
      
      const data = {
        x: draftEl.x,
        y: draftEl.y,
        width: draftEl.width,
        height: draftEl.height,
        rotate: draftEl.rotate,
        scaleX: draftEl.scaleX,
        scaleY: draftEl.scaleY,
      }

      if(clickMoveable.resizable && Array.isArray(clickMoveable.renderDirections)){
        const renderDirections = clickMoveable.renderDirections
        if((renderDirections.includes('w') ||  renderDirections.includes('e'))
        ){
          data.width = (data.width || startData.width) + diff.width
        }

        if((renderDirections.includes('n') ||  renderDirections.includes('s'))
        ){
          data.height = (data.height || startData.height) + diff.height
        }
      }

      data.x += diff.x;
      data.y += diff.y;
      data.rotate += diff.rotate;
      data.scaleX *= diff.scaleX;
      data.scaleY *= diff.scaleY;

      this.draftManager.updateDisplayElement(draftEl.id, data)


      // reset diff data
      diff = getInitialDiff()

    }

    clickMoveable
      .on('dragStart', handleStart)
      .on('rotateStart', handleStart)
      .on('resizeStart', handleStart)
      .on('scaleStart', handleStart)

      .on('dragEnd', handleEnd)
      .on('rotateEnd', handleEnd)
      .on('resizeEnd', handleEnd)
      .on('scaleEnd', handleEnd);
  

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