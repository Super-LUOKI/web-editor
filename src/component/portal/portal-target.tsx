import { useRef, useEffect } from 'react'

import { usePortalContext } from './portal-context'
import { PortalTargetProps } from './type'

export function getPortalTargetElemId(targetId: string) {
  return `portal_target_${targetId}`
}

export function PortalTarget(props: PortalTargetProps) {
  const { targetId, children, ...rest } = props
  const { registerTarget, unregisterTarget } = usePortalContext()
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    registerTarget(targetId, element)

    return () => {
      unregisterTarget(targetId)
    }
  }, [targetId, registerTarget, unregisterTarget])

  return (
    <div ref={elementRef} id={getPortalTargetElemId(targetId)} {...rest}>
      {children}
    </div>
  )
}
