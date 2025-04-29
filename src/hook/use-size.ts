import lodash from "lodash";
import { useLayoutEffect, useState } from "react";

export function useSize<T extends HTMLElement>(ref: React.RefObject<T | null>, throttle = 200) {
  const [size, setSize] = useState({ width: 0, height: 0 })

  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return

    const callback = ([entry]: ResizeObserverEntry[])=>{
      const { width, height } = entry.contentRect
      setSize({ width, height })
    }

    const observer = new ResizeObserver(lodash.throttle(callback, throttle))

    observer.observe(element)

    const rect = element.getBoundingClientRect()
    setSize({ width: rect.width, height: rect.height })

    return () => observer.disconnect()
  }, [])

  return size
}