import { useMemo } from "react";
import { useVideoConfig } from "remotion";

export function useFrameRange(timeRange: { start: number; length: number }) {
  const { fps } = useVideoConfig();

  const start = timeRange.start * fps;
  const end = timeRange.start * fps + timeRange.length * fps;

  const frameStart = Math.floor(start);
  const frameDuration = Math.round(end) - frameStart + 1;

  return useMemo(() => {
    return {
      frameStart,
      frameDuration,
    };
  }, [frameStart, frameDuration]);
}
