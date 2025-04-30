import { createContext, useContext } from 'react'

import { DraftManager } from '@/feature/editor/manager/draft-manager.ts'

const DraftManagerContext = createContext<DraftManager | null>(null)

export function DraftManagerProvider({
  children,
  value,
}: {
  children: React.ReactNode
  value: DraftManager
}) {
  return <DraftManagerContext.Provider value={value}>{children}</DraftManagerContext.Provider>
}

export function useDraftManager() {
  const value = useContext(DraftManagerContext)
  if (!value) {
    throw new Error('useDraftManager must be used within a DraftManagerProvider')
  }
  return value
}
