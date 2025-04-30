import { throttle } from 'lodash'

import { Size } from '@/lib/remotion/editor-render/schema/common.ts'

export function observeElementSize(
  element: HTMLElement,
  callback: (size: Size) => void,
  options?: {
    throttle: number
  }
) {
  const throttleDelay = options?.throttle || 50
  if (!element) {
    throw new Error('observeElementSize: element is required.')
  }

  const handleResize = (entry: ResizeObserverEntry) => {
    const { clientWidth, clientHeight } = entry.target
    callback({ width: clientWidth, height: clientHeight })
  }

  const throttledResize = throttle(handleResize, throttleDelay)

  const resizeObserver = new ResizeObserver(entries => {
    entries.forEach(entry => {
      throttledResize(entry)
    })
  })

  resizeObserver.observe(element)

  return () => resizeObserver.disconnect()
}
