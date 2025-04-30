import { createContext, useContext } from 'react'

import { TimelineViewController } from '@/feature/editor/block/timeline/timeline-view-controller.ts'

const TimelineViewControllerContext = createContext<TimelineViewController | null>(null)

export function TimelineViewControllerProvider({
  children,
  value,
}: {
  children: React.ReactNode
  value: TimelineViewController
}) {
  return (
    <TimelineViewControllerContext.Provider value={value}>
      {children}
    </TimelineViewControllerContext.Provider>
  )
}

export function useTimelineViewController() {
  const value = useContext(TimelineViewControllerContext)
  if (!value) {
    throw new Error(
      'useTimelineViewController must be used within a TimelineViewControllerProvider'
    )
  }
  return value
}
