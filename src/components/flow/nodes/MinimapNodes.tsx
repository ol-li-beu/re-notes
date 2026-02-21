import { useFlowStore } from "../store/useFlowStore";
import { COLLAPSED_HEIGHT, COLLAPSED_WIDTH } from "../types";


// Canvas // since no width and height and only style use store for reading source
export function SquareMiniMapNode({ x, y, width, height }: { x: number; y: number; width: number; height: number  }) {
  
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      rx={0}
      ry={0}
      fill="var(--node-bg)"
      stroke="var(--fg)"
      strokeWidth={15}
    />
  );
}

// Project home
export function CircleMiniMapNode({ x, y, width, height }: { x: number; y: number; width: number; height: number }) {
  return (
    <circle
      cx={x + width / 2}
      cy={y + height / 2}
      r={Math.max(width, height) / 2}
      fill="var(--node.bg)"
      stroke="var(--fg)"
      strokeWidth={15}
    />
  );
}