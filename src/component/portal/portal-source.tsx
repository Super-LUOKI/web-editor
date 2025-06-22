import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { usePortalContext } from './portal-context'
import { PortalSourceProps } from './type'

export function PortalSource(props: PortalSourceProps) {
  const { children, targetId } = props
  const { getTarget, subscribe } = usePortalContext()
  const [container, setContainer] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const targetEl = getTarget(targetId)
    if (targetEl) {
      setContainer(targetEl)
      return
    }

    const unsubscribe = subscribe(targetId, ({ element }) => {
      setContainer(element)
      unsubscribe()
    })

    return () => {
      unsubscribe()
    }
  }, [targetId, getTarget, subscribe])

  if (!container) return null

  return createPortal(children, container)
}
