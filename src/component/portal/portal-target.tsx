import { HTMLAttributes } from 'react'

export function getPortalTargetElemId(targetId: string) {
  return `portal_target_${targetId}`
}

type PortalTargetProps = HTMLAttributes<HTMLDivElement> & {
  targetId: string
}

export function PortalTarget(props: PortalTargetProps) {
  const { targetId, ...rest } = props
  return <div id={getPortalTargetElemId(targetId)} {...rest} />
}
