"use client";
import { useEffect } from "react";

import { ReactFlow, Background, BackgroundVariant, Controls, MiniMap, ReactFlowProvider, } from "@xyflow/react";
import { NodeTypes, NodeClasses, NodeObj } from "@/components/flow/types";

import { useFlowStore } from "@/components/flow/store/useFlowStore";
import { createNode } from "@/components/flow/store/NodeFactory";


import styles from "./canvas.module.css";
    

interface CanvasClientProps {
    lang: string,
    dict: any,
    projectId: string,
}




export default function CanvasClient({lang, dict, projectId} : CanvasClientProps) { // TODO props initial loaded from page.tsx (SUPABASE)

  console.log("CanvasClient projectId:", projectId);

  const nodeTypes = {note : "component class", subnode: "", }
  
  const nodes = useFlowStore((s) => s.nodes);
  const edges = useFlowStore((s) => s.edges);
  const onNodesChange = useFlowStore((s) => s.onNodesChange);
  const onEdgesChange = useFlowStore((s) => s.onEdgesChange);
  const onConnect = useFlowStore((s) => s.onConnect);
  const undo = useFlowStore((s) => s.undo);
  const redo = useFlowStore((s) => s.redo);  

  useEffect(() => {
    const store = useFlowStore.getState();
    if (store.nodes.length === 0) {
        store.addNodeAtPosition("note", { x: 100, y: 100 }, {label: "new NOte Node", description: "hello", projectId: ""});
        store.addNodeAtPosition("subnode", { x: 400, y: 150 }, {label: "New SUbonde Node", description: "bye", projectId: projectId});
        store.addNodeAtPosition("subnode", { x: 700, y: 150 }, {label: "New SUbonde Node", description: "bye2", projectId: projectId});
    }
  }, []);

  


  return (
    
    <div className={styles.canvasPage}>
        <div className={styles.toolbar}>
            <button onClick={() => undo()}>UNDO</button>
            <button onClick={() => redo()}>REDO</button>
        </div>

     <div className={styles.reactFlowWrapper}>

      <ReactFlow<NodeObj>
        nodeTypes={NodeClasses}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        isValidConnection={(connection) => connection.source !== connection.target }
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStart={() => useFlowStore.getState().startBatch()}
        onNodeDragStop={() => useFlowStore.getState().endBatch()}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background 
        variant={BackgroundVariant.Dots}
        gap={30}
        size={4}
        color="var(--contrast)"
        />

        {/* for UX purposes no controls or minimap on mobile */}
        <div className={styles.hideOnMobile}>
          <Controls />
          <MiniMap
           maskColor="var(--contrast)"
           nodeClassName={styles.nodeMinimap}
           style={{
              backgroundColor: "var(--accent)",
           }}
          />
        </div>
      </ReactFlow>
      </div>
    </div>
  );
}