"use client";

import { useRef, useMemo, useState, useCallback } from "react";
import { ReactFlow, Background, BackgroundVariant, Controls, MiniMap, applyNodeChanges, NodeChange, EdgeTypes, MarkerType } from "@xyflow/react";
import ArrowEdge from "@/components/flow/edges/ArrowEdge";

import { useRouter } from "next/navigation";
import { useDictionary } from "@/utils/CanvasDictionaryContext";
import { useProjectStore } from "@/components/flow/store/useProjectStore";

import GraphNode, { GraphNodeObj } from "@/components/flow/nodes/GraphNode";

import styles from "./[nodeId]/canvas.module.css";
import "@xyflow/react/dist/style.css";

// MOCK DATA
const mockCanvases = [
  { id: "root-1", projectId: "proj-1", name: "Root", positionX: 400, positionY: 300 },
  { id: "canvas-2", projectId: "proj-1", name: "Ideas", positionX: 200, positionY: 500 },
  { id: "canvas-3", projectId: "proj-1", name: "Research", positionX: 600, positionY: 500 },
  { id: "canvas-4", projectId: "proj-1", name: "Orphan", positionX: 800, positionY: 200 },
];

const mockLinks = [
  { id: "link-1", projectId: "proj-1", fromCanvasId: "root-1", toCanvasId: "canvas-2" },
  { id: "link-2", projectId: "proj-1", fromCanvasId: "root-1", toCanvasId: "canvas-3" },
];

const GraphNodeClasses = { graphnode: GraphNode };
const GraphEdgeClasses: EdgeTypes = { arrowedge: ArrowEdge };



export interface ProjectHomeClientProps {
  lang: string;
  projectId: string;
}

export default function ProjectHomeClient({ lang, projectId }: ProjectHomeClientProps) {
  const canvases = useProjectStore((s) => s.canvases);
  const links = useProjectStore((s) => s.links);
  const projectName = useProjectStore((s) => s.projectName);
  const getStatus = useProjectStore((s) => s.getStatus);
  const updateCanvasPosition = useProjectStore((s) => s.updateCanvasPosition);


  const [rfNodesState, setRfNodesState] = useState<GraphNodeObj[]>(() => {
    useProjectStore.getState().initProject(
        "proj-1", "My Project", "root-1", mockCanvases, mockLinks
    );
    const store = useProjectStore.getState();
      return store.canvases.map((canvas) => ({
        id: canvas.id,
        type: "graphnode" as const,
        position: { x: canvas.positionX, y: canvas.positionY },
        data: {
            canvasId: canvas.id,
            name: canvas.name,
            status: store.getStatus(canvas.id),
            projectId,
        },
      }));
  });


   const onNodesChange = useCallback((changes: NodeChange<GraphNodeObj>[]) => {
        setRfNodesState((nds) => applyNodeChanges(changes, nds));
        }, []);

  const rfEdges = useMemo(() => links.map((link) => ({
    id: link.id,
    source: link.fromCanvasId,
    target: link.toCanvasId,
    type: "arrowedge",
    focusable: false,
    deletable: false,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "var(--fg)",
      width: 16,
      height: 16,
    },
  })), [links]);




  const dict = useDictionary();
  const router = useRouter();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.canvasPage}>
      <div className={styles.reactFlowWrapper} ref={reactFlowWrapper}>

        {/* TOP LEFT */}
        <div className={styles.topLeftLabel}>
          <span>{projectName}</span>
        </div>

        <ReactFlow
          nodes={rfNodesState}
          edges={rfEdges}
          nodeTypes={GraphNodeClasses}
          edgeTypes={GraphEdgeClasses}
          onNodesChange={onNodesChange} 
          nodesConnectable={false}
          elementsSelectable={false}
          fitView
          proOptions={{ hideAttribution: true }}
          onNodeDragStop={(_, node) => {
            updateCanvasPosition(node.id, node.position.x, node.position.y);
          }}
        >
          <Background
            variant={BackgroundVariant.Lines}
            gap={80}
            size={1}
            color="var(--canvasbackground)"
          />
          <div className={styles.hideOnMobile}>
            <Controls />
            <MiniMap
              maskColor="var(--contrast)"
              nodeClassName={styles.nodeMinimap}
              style={{ backgroundColor: "var(--accent)" }}
            />
          </div>
        </ReactFlow>

      </div>
    </div>
  );
}