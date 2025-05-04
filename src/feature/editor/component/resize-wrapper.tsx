import { forwardRef, ReactNode, useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'

import { FullscreenMask } from '@/feature/editor/component/fullscreen-mask.tsx'
import { cn } from '@/lib/shadcn/util.ts'

type ResizeListener = (leftOffset: number, rightOffset: number) => void
type ResizeWrapperProps = React.HTMLAttributes<HTMLDivElement> & {
  handlerClassName?: string
  leftHandler?: ReactNode
  rightHandler?: ReactNode
  /** internally, the passed-in items won't be treated as dependencies. references are required to avoid closure issues. */
  onResizing?: ResizeListener
  /** internally, the passed-in items won't be treated as dependencies. references are required to avoid closure issues. */
  onResizeComplete?: ResizeListener
}

const LEFT_HANDLER_CONTAINER_ID = '__left-handler'
const RIGHT_HANDLER_CONTAINER_ID = '__right-handler'

export const ResizeWrapper = forwardRef<HTMLDivElement, ResizeWrapperProps>((props, ref) => {
  const {
    className,
    children,
    handlerClassName,
    leftHandler,
    rightHandler,
    onResizing,
    onResizeComplete,

    ...rest
  } = props
  const leftHandlerContainerRef = useRef<HTMLDivElement | null>(null)
  const rightHandlerContainerRef = useRef<HTMLDivElement | null>(null)
  const [isResizing, setIsResizing] = useState(false)

  useEffect(() => {
    const leftContainerEl = leftHandlerContainerRef.current
    const rightContainerEl = rightHandlerContainerRef.current
    if (!leftContainerEl || !rightContainerEl) {
      return
    }

    // record start offset and whether start drag
    let startOffset: number | undefined = undefined
    let currentHandlerId: string | undefined = undefined

    const handlePointerDown = (e: MouseEvent) => {
      startOffset = e.clientX
      currentHandlerId = (e.currentTarget as HTMLDivElement | null)?.id
      flushSync(() => {
        setIsResizing(true)
      })
    }

    const calculateOffset = (e: MouseEvent, callback?: ResizeListener) => {
      if (typeof startOffset === 'undefined' || !currentHandlerId) return

      const offset = e.clientX - startOffset

      if (currentHandlerId === LEFT_HANDLER_CONTAINER_ID) {
        callback?.(offset, 0)
      } else {
        callback?.(0, offset)
      }
    }

    const handlePointerMove = (e: MouseEvent) => {
      calculateOffset(e, onResizing)
    }
    const handlePointerUp = (e: MouseEvent) => {
      calculateOffset(e, onResizeComplete)
      startOffset = -1
      flushSync(() => {
        setIsResizing(false)
      })
    }

    const startResize = (e: MouseEvent) => {
      handlePointerDown(e)
      document.addEventListener('pointermove', handlePointerMove)
      document.addEventListener(
        'pointerup',
        e => {
          handlePointerUp(e)
          document.removeEventListener('pointermove', handlePointerMove)
        },
        { once: true }
      )
    }

    leftContainerEl.addEventListener('pointerdown', startResize)
    rightContainerEl.addEventListener('pointerdown', startResize)

    return () => {
      leftContainerEl.removeEventListener('pointerdown', startResize)
      document.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerup', handlePointerUp)

      rightContainerEl.removeEventListener('pointerdown', startResize)
      document.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerup', handlePointerUp)
    }
  }, [])

  return (
    <>
      <FullscreenMask show={isResizing} />
      <div ref={ref} className={cn('relative', className)} {...rest}>
        <div
          ref={leftHandlerContainerRef}
          id={LEFT_HANDLER_CONTAINER_ID}
          className={cn('absolute left-0 top-0 h-full cursor-ew-resize', handlerClassName)}
        >
          {leftHandler}
        </div>
        <div
          ref={rightHandlerContainerRef}
          id={RIGHT_HANDLER_CONTAINER_ID}
          className={cn('absolute right-0 top-0 h-full cursor-ew-resize', handlerClassName)}
        >
          {rightHandler}
        </div>
        {children}
      </div>
    </>
  )
})
