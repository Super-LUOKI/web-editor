export interface PortalTargetProps {
  targetId: string
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}

export interface PortalSourceProps {
  targetId: string
  children: React.ReactNode
}

export interface PortalProviderProps {
  children: React.ReactNode
}

export interface PortalContextValue {
  registerTarget: (targetId: string, element: HTMLElement) => void
  unregisterTarget: (targetId: string) => void
  getTarget: (targetId: string) => HTMLElement | null
  subscribe: (targetId: string, callback: () => void) => () => void
}
