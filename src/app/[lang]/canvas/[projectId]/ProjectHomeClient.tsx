"use client";

import { useRef, useMemo, useState, useCallback, useEffect } from "react";
import { ReactFlow, Background, BackgroundVariant, Controls, MiniMap, applyNodeChanges, NodeChange, EdgeTypes, MarkerType } from "@xyflow/react";
import ArrowEdge from "@/components/flow/edges/ArrowEdge";

import { useRouter } from "next/navigation";
import { useDictionary } from "@/utils/CanvasDictionaryContext";
import { useProjectStore } from "@/components/flow/store/useProjectStore";

import GraphNode, { GraphNodeObj } from "@/components/flow/nodes/GraphNode";
import ClickCursor from "@/components/flow/cursor/ClickCursor";
import { CircleMiniMapNode } from "@/components/flow/nodes/MinimapNodes";

import styles from "./[nodeId]/canvas.module.css";
import "@xyflow/react/dist/style.css";



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

  //const dict = useDictionary();
  //const router = useRouter();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);


  const [rfNodesState, setRfNodesState] = useState<GraphNodeObj[]>([]);

  useEffect(() => {
    if (canvases.length === 0) return;
    setRfNodesState(prev =>
      canvases.map((canvas) => {
        const existing = prev.find(n => n.id === canvas.id);
        return {
          id: canvas.id,
          type: "graphnode" as const,
          position: existing?.position ?? { x: canvas.positionX, y: canvas.positionY },
          data: {
            canvasId: canvas.id,
            name: canvas.name,
            status: getStatus(canvas.id),
            projectId,
          },
        };
      })
    );
  }, [canvases]);


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


  return (
    <div className={styles.canvasPage}>
      <div className={styles.reactFlowWrapper} ref={reactFlowWrapper}>

        {/* TOP LEFT */}
        <div className={styles.topActions}>
          <div className={styles.topLeftLabel}>
            <span>{projectName}</span>
          </div>
        </div>

        <ReactFlow
          nodes={rfNodesState}
          edges={rfEdges}
          nodeTypes={GraphNodeClasses}
          edgeTypes={GraphEdgeClasses}
          onNodesChange={onNodesChange} 
          nodesConnectable={false}
          elementsSelectable={true}
          fitView
          proOptions={{ hideAttribution: true }}
          onNodeDragStop={(_, node) => {
            updateCanvasPosition(node.id, node.position.x, node.position.y);
          }}
        >
          <ClickCursor />
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
              nodeComponent={CircleMiniMapNode}
              style={{ backgroundColor: "var(--accent)" }}
            />
          </div>
        </ReactFlow>

      </div>
    </div>
  );
}