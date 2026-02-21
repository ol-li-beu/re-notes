import React from "react";
import { Edge } from "@xyflow/react";
import FlowStoreInitializer from "@/components/flow/store/FlowStoreInitializer";
import { COLLAPSED_HEIGHT, COLLAPSED_WIDTH } from "@/components/flow/types";
import { NodeObj } from "@/components/flow/types";

export default function CanvasLayout({ children, }: { children: React.ReactNode; }) {

  // load node data from supabase and store. props down to the client wrapper call set flow there to mount
  // BOTH PROJECTS AND CANVAS

  // MOCK DATA
  const mockNodes: NodeObj[] = [
  {
    id: "node-3",
    type: "subnode",
    position: { x: 900, y: 100 },
    style: { width: COLLAPSED_WIDTH, height: COLLAPSED_HEIGHT },
    data: {
      type: "subnode",
      label: "Subnode Two",
      description: "also links somewhere",
      targetCanvasId: null,
      targetCanvasName: null,
      linkId: null,
      projectId: "proj-1",
      expanded: false,
      color: "",
      locked: false,
      width: COLLAPSED_WIDTH,
      height: COLLAPSED_HEIGHT,
    },
  },
];

  const mockEdges: Edge[] = [];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column",  minHeight: 0,}} >
      <FlowStoreInitializer nodes={mockNodes} edges={mockEdges} />
      
      {children}
    </div>
  );
}