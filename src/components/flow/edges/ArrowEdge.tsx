"use client";

import { EdgeProps, } from "@xyflow/react";

const RADIUS_X = 100;
const RADIUS_Y = 100;
const TARGET_OFFSET = 20;

export default function ArrowEdge({ sourceX, sourceY, targetX, targetY, markerEnd, }: EdgeProps) {

  // angle from source to target center
  const angle = Math.atan2(targetY - sourceY, targetX - sourceX);

  // offset 
  const srcX = sourceX + Math.cos(angle) * RADIUS_X;
  const srcY = sourceY + Math.sin(angle) * RADIUS_Y;
  const tgtX = targetX - Math.cos(angle) * (RADIUS_X + TARGET_OFFSET);
  const tgtY = targetY - Math.sin(angle) * (RADIUS_Y + TARGET_OFFSET);

  // bezier control points
  const dx = tgtX - srcX;
  const dy = tgtY - srcY;
  const cx1 = srcX + dx * 0.4;
  const cy1 = srcY + dy * 0.1;
  const cx2 = srcX + dx * 0.6;
  const cy2 = srcY + dy * 0.9;

  const path = `M ${srcX} ${srcY} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${tgtX} ${tgtY}`;

  return (
    <g>
      <path
        d={path}
        strokeWidth={35}
        stroke="transparent"
        fill="none"
      />
      <path
        d={path}
        strokeWidth={4}
        stroke="var(--fg)"
        fill="none"
        strokeOpacity={0.5}
        markerEnd={markerEnd}
      />
    </g>
  );
}