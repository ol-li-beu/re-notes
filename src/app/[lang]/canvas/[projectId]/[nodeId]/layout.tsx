import React from "react";
import { Edge } from "@xyflow/react";
import FlowStoreInitializer from "@/components/flow/store/FlowStoreInitializer";

import { NodeObj } from "@/components/flow/types";

export default function CanvasLayout({ children, }: { children: React.ReactNode; }) {

  // load node data from supabase and store. props down to the client wrapper call set flow there to mount
  // BOTH PROJECTS AND CANVAS

  // MOCK DATA
  const mockNodes: NodeObj[] = [
  {
    id: "node-1",
    type: "note",
    position: { x: 100, y: 100 },
    data: {
      type: "note",
      label: "Note Node",
      description: "hello",
      content: "",
      expanded: true,
      color: "",
      locked: false,
      width: 600,
      height: 540,
    },
  },
  {
    id: "node-2",
    type: "subnode",
    position: { x: 500, y: 100 },
    data: {
      type: "subnode",
      label: "Subnode One",
      description: "links somewhere",
      targetCanvasId: null,
      targetCanvasName: null,
      linkId: null,
      projectId: "proj-1",
      expanded: true,
      color: "",
      locked: false,
      width: 330,
      height: 230,
    },
  },
  {
    id: "node-3",
    type: "subnode",
    position: { x: 900, y: 100 },
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
      width: 330,
      height: 230,
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