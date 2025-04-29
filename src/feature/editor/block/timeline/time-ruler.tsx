import { useZustand } from "use-zustand";

import { useTimelineViewController } from "@/feature/editor/context/timeline-view-controller.tsx";

export function TimeRuler() {
  const vc = useTimelineViewController()

  const pixelPerSecond = useZustand(vc.store, s => s.pixelPerSecond)
  const maxDuration = useZustand(vc.store, s => s.maxDuration)


  return (
    <div
      style={{
        width: `${maxDuration * pixelPerSecond}px`,
        height: 16,
        background:'red'
      }}
    ></div>
  )
}