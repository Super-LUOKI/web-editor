import { Point } from "@/lib/remotion/editor-render/schema/common.ts";

export function pointRotate(point: Point, rad: number) {
  const { x, y } = point;
  const matrix = [Math.cos(rad), Math.sin(rad), -Math.sin(rad), Math.cos(rad)];
  return {
    x: x * matrix[0] + y * matrix[2],
    y: x * matrix[1] + y * matrix[3],
  };
}
