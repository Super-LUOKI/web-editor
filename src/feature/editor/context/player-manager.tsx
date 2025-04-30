import { createContext, useContext } from 'react'

import { PlayerManager } from '@/feature/editor/manager/player-manager.ts'

const PlayerManagerContext = createContext<PlayerManager | null>(null)

export function PlayerManagerProvider({
  children,
  value,
}: {
  children: React.ReactNode
  value: PlayerManager
}) {
  return <PlayerManagerContext.Provider value={value}>{children}</PlayerManagerContext.Provider>
}

export function usePlayerManager() {
  const value = useContext(PlayerManagerContext)
  if (!value) {
    throw new Error('usePlayerManager must be used within a PlayerManagerProvider')
  }
  return value
}
