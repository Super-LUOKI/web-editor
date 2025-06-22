import { createContext, useContext, useRef, useCallback, ReactNode } from 'react'

interface PortalTargetInfo {
  element: HTMLElement
  targetId: string
}

type PortalSubscribeCallback = (info: PortalTargetInfo) => void
interface PortalContextValue {
  registerTarget: (targetId: string, element: HTMLElement) => void
  unregisterTarget: (targetId: string) => void
  getTarget: (targetId: string) => HTMLElement | null
  subscribe: (targetId: string, callback: PortalSubscribeCallback) => () => void
}

const PortalContext = createContext<PortalContextValue | null>(null)

export function usePortalContext() {
  const context = useContext(PortalContext)
  if (!context) {
    throw new Error('usePortalContext must be used within PortalProvider')
  }
  return context
}

interface PortalProviderProps {
  children: ReactNode
}

export function PortalProvider({ children }: PortalProviderProps) {
  const targetsRef = useRef<Map<string, PortalTargetInfo>>(new Map())
  const subscribersRef = useRef<Map<string, Set<PortalSubscribeCallback>>>(new Map())

  const registerTarget = useCallback((targetId: string, element: HTMLElement) => {
    targetsRef.current.set(targetId, { element, targetId })

    // Notify subscribers
    const subscribers = subscribersRef.current.get(targetId)
    if (subscribers) {
      subscribers.forEach(callback => callback({ element, targetId }))
    }
  }, [])

  const unregisterTarget = useCallback((targetId: string) => {
    targetsRef.current.delete(targetId)
    subscribersRef.current.delete(targetId)
  }, [])

  const getTarget = useCallback((targetId: string) => {
    const target = targetsRef.current.get(targetId)
    return target?.element || null
  }, [])

  const subscribe = useCallback((targetId: string, callback: (info: PortalTargetInfo) => void) => {
    if (!subscribersRef.current.has(targetId)) {
      subscribersRef.current.set(targetId, new Set())
    }

    const subscribers = subscribersRef.current.get(targetId)!
    subscribers.add(callback)

    // Return unsubscribe function
    return () => {
      subscribers.delete(callback)
      if (subscribers.size === 0) {
        subscribersRef.current.delete(targetId)
      }
    }
  }, [])

  const contextValue: PortalContextValue = {
    registerTarget,
    unregisterTarget,
    getTarget,
    subscribe,
  }

  return <PortalContext.Provider value={contextValue}>{children}</PortalContext.Provider>
}
