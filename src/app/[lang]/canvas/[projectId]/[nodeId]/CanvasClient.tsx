"use client";
import { useEffect, useState } from "react";

import { ReactFlow, Background, BackgroundVariant, Controls, MiniMap, ReactFlowProvider, } from "@xyflow/react";
import { NodeClasses, NodeObj } from "@/components/flow/types";

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
  const deleteNode = useFlowStore((s) => s.deleteNode);
  const copyNode = useFlowStore((s) => s.copyNode);
  const cutNode = useFlowStore((s) => s.cutNode);
  const pasteNode = useFlowStore((s) => s.pasteNode);
  const duplicateNode = useFlowStore((s) => s.duplicateNode);


  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null); // tracker

  useEffect(() => {
    const store = useFlowStore.getState();
    if (store.nodes.length === 0) {
        store.addNodeAtPosition("note", { x: 100, y: 100 }, {label: "new NOte Node", description: "hello", projectId: ""});
        store.addNodeAtPosition("subnode", { x: 400, y: 150 }, {label: "New SUbonde Node", description: "bye", projectId: projectId});
        store.addNodeAtPosition("subnode", { x: 700, y: 150 }, {label: "New SUbonde Node", description: "bye2", projectId: projectId});
    }
  }, []);


  // Shortcuts
  useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Ignore if typing in input/textarea
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement
    ) {
      return;
    }

    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const modKey = isMac ? e.metaKey : e.ctrlKey;

    // Ctrl/Cmd + Z (Undo)
    if (modKey && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      useFlowStore.getState().undo();
      return;
    }

    // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y (Redo)
    if ((modKey && e.shiftKey && e.key === 'z') || (modKey && e.key === 'y')) {
      e.preventDefault();
      useFlowStore.getState().redo();
      return;
    }

    // Delete or Backspace
    if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNodeId) {
      e.preventDefault();
      deleteNode(selectedNodeId);
      setSelectedNodeId(null);
    }

    // Ctrl/Cmd + C (Copy)
    if (modKey && e.key === 'c' && selectedNodeId) {
      e.preventDefault();
      copyNode(selectedNodeId);
    }

    // Ctrl/Cmd + X (Cut)
    if (modKey && e.key === 'x' && selectedNodeId) {
      e.preventDefault();
      cutNode(selectedNodeId);
      setSelectedNodeId(null);
    }

    // Ctrl/Cmd + V (Paste)
    if (modKey && e.key === 'v') {
      e.preventDefault();
      pasteNode();
      setSelectedNodeId(null); 
    }

    // Ctrl/Cmd + D (Duplicate)
    if (modKey && e.key === 'd' && selectedNodeId) {
      e.preventDefault();
      duplicateNode(selectedNodeId);
      setSelectedNodeId(null);  
    }
  };

  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeId, deleteNode, copyNode, cutNode, pasteNode, duplicateNode]);

  


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
        onNodeClick={(_, node) => setSelectedNodeId(node.id)}
        onPaneClick={() => setSelectedNodeId(null)}
      >
        <Background 
        variant={BackgroundVariant.Dots}
        gap={30}
        size={4}
        color="var(--canvasbackground)"
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