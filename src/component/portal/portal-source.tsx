import { PropsWithChildren } from 'react'
import { createPortal } from 'react-dom'

import { getPortalTargetElemId } from './portal-target'

type PortalSourceProps = PropsWithChildren<{
  targetId: string
}>

export function PortalSource(props: PortalSourceProps) {
  const { children, targetId } = props
  const container = document.getElementById(getPortalTargetElemId(targetId))
  if (!container) return null

  return createPortal(children, container)
}
