"use client";
import { useEffect, useState, useRef } from "react";

import { ReactFlow, Background, BackgroundVariant, Controls, MiniMap, useReactFlow, } from "@xyflow/react";
import { NodeClasses, NodeObj, NodeTypes, COLLAPSED_WIDTH, COLLAPSED_HEIGHT } from "@/components/flow/types";

import { useFlowStore } from "@/components/flow/store/useFlowStore";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";

import IconButtonWithHint from "@/components/ui/Icons/IconButtonWithHint";
import Toolbar from "@/components/flow/toolbar/ToolBar";
import Sidebar from "@/components/flow/sidebar/SideBar";
import { NodeOptionCard } from "@/components/flow/sidebar/NodeOptionCard";

import styles from "./canvas.module.css";

import "@xyflow/react/dist/style.css";
import { useDictionary } from "@/utils/CanvasDictionaryContext";

export interface CanvasClientProps {
    lang: string,
    projectId: string,
}

export default function CanvasClient({lang, projectId} : CanvasClientProps) { // TODO props initial loaded from page.tsx (SUPABASE)

  const dict = useDictionary();
  
  const nodes = useFlowStore((s) => s.nodes);
  const edges = useFlowStore((s) => s.edges);
  const onNodesChange = useFlowStore((s) => s.onNodesChange);
  const onEdgesChange = useFlowStore((s) => s.onEdgesChange);
  const onConnect = useFlowStore((s) => s.onConnect);
  const undo = useFlowStore((s) => s.undo);
  const redo = useFlowStore((s) => s.redo); 
  const canUndo = useFlowStore((s) => s.past.length > 0);
  const canRedo = useFlowStore((s) => s.future.length > 0);
  const addNodeAtPosition = useFlowStore((s) => s.addNodeAtPosition);
  const deleteNode = useFlowStore((s) => s.deleteNode);
  const copyNode = useFlowStore((s) => s.copyNode);
  const cutNode = useFlowStore((s) => s.cutNode);
  const pasteNode = useFlowStore((s) => s.pasteNode);
  const duplicateNode = useFlowStore((s) => s.duplicateNode);
  const startBatch = useFlowStore(s => s.startBatch);
  const endBatch = useFlowStore(s => s.endBatch);
  const setDraggingNodeId = useFlowStore(s => s.setDraggingNodeId)

  const router = useRouter();
  const {showToast} = useToast();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null); // tracker
  const [sidebarOpen, setSidebarOpen] = useState(false); 

  const { screenToFlowPosition } = useReactFlow();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const store = useFlowStore.getState();
    if (store.nodes.length === 0) {
        store.addNodeAtPosition("note", { x: 100, y: 100 }, {label: "new NOte Node", description: "hello", projectId: ""});
        store.addNodeAtPosition("subnode", { x: 400, y: 150 }, {label: "New SUbonde Node", description: "bye", projectId: projectId});
        store.addNodeAtPosition("subnode", { x: 700, y: 150 }, {label: "New SUbonde Node", description: "bye2", projectId: projectId});
    }
  }, []);

  
  // Shortcuts also take into account mac
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

  // handlers

  const handleAddNodeCentered = (type: NodeTypes) => {
    const wrapper = reactFlowWrapper.current;
    if (!wrapper) return;

    const rect = wrapper.getBoundingClientRect();

    const position = screenToFlowPosition({
      x: (rect.left + rect.width / 2) - COLLAPSED_WIDTH / 2,
      y: (rect.top + rect.height / 2) - COLLAPSED_HEIGHT / 2,
    });

    addNodeAtPosition(type, position, {
        label: "New Node",
        description: "",
        projectId, 
      });
    setSidebarOpen(false);
  };

// RENDERING

return (
  <div className={styles.canvasPage}>
    <div className={styles.reactFlowWrapper} ref={reactFlowWrapper}>

      {/* TOP LEFT TOOLBAR */}
      <div className={styles.topLeftLabel}>
        <span>Project name: Node name</span>
      </div>
      
      {/* TOP RIGHT TOOLBAR */}
      <div className={styles.topRightToolbar}>
        <Toolbar children= {(<>
          <IconButtonWithHint iconName="canvasundo" description="undo" onClick={undo} disabled={!canUndo}/>
          <IconButtonWithHint iconName="canvasredo" description="redo" onClick={redo} disabled={!canRedo}/>
          <IconButtonWithHint iconName="canvasplus" description="add node" onClick={() => setSidebarOpen(true)}/>
          <IconButtonWithHint iconName="canvassave" description="save" onClick={() => {}} />
          <IconButtonWithHint iconName="canvasarrowuptoline" description="Go back" onClick={() => {}} />
          <IconButtonWithHint iconName="canvashome" description="Go to project home" onClick={() => {router.push(`/${lang}/canvas/${projectId}`)}} />

        </>)}
        />

       
      </div>
    
      <ReactFlow<NodeObj>
        nodeTypes={NodeClasses}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStart={(_, node) => {startBatch(); setDraggingNodeId(node.id);}}
        onNodeDragStop={(_, node) => {endBatch(); setDraggingNodeId(null);}}
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
        <div className={`${styles.hideOnMobile}`}>
        <Controls  />
        <MiniMap
          maskColor="var(--contrast)"
          nodeClassName={styles.nodeMinimap}
          style={{ backgroundColor: "var(--accent)" }}
        />
        </div>
      </ReactFlow>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)}>
        <NodeOptionCard
          icon={<> </>}
          title="Text Node"
          description="Simple note node"
          onClick={() => {
          handleAddNodeCentered("note"); }}
          /> 
      </Sidebar>
    </div>
  </div>
);
}