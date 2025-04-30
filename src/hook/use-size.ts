import lodash from 'lodash'
import { useLayoutEffect, useState } from 'react'

interface UseSizeOptions {
  /**
   * true: 返回 contentRect（不含 padding、border、margin）
   * false: 返回 clientWidth/clientHeight（含 padding，不含 border、margin）
   * @default true
   */
  onlyContentSize?: boolean
  /**
   * 节流间隔，单位 ms，默认 200ms
   */
  throttle?: number
}

export function useSize<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  options?: UseSizeOptions
) {
  const { onlyContentSize = false, throttle = 200 } = options || {}
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  })

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    // 更新逻辑
    const updateSize = () => {
      if (onlyContentSize) {
        // 使用 getBoundingClientRect 来近似 contentRect
        const { width, height } = el.getBoundingClientRect()
        setSize({ width, height })
      } else {
        // clientWidth/clientHeight 包含 padding
        setSize({ width: el.clientWidth, height: el.clientHeight })
      }
    }

    // ResizeObserver 回调
    const roCallback = (entries: ResizeObserverEntry[]) => {
      const entry = entries[0]
      if (!entry) return
      if (onlyContentSize) {
        const { width, height } = entry.contentRect
        setSize({ width, height })
      } else {
        setSize({
          width: entry.target.clientWidth,
          height: entry.target.clientHeight,
        })
      }
    }

    const throttled = lodash.throttle(roCallback, throttle)
    const observer = new ResizeObserver(throttled)

    observer.observe(el)

    // 初始读取一次
    updateSize()

    return () => {
      observer.disconnect()
      throttled.cancel()
    }
  }, [ref, onlyContentSize, throttle])

  return size
}
