"use client";
import { useEffect, useState, useRef, useCallback } from "react";

import { ReactFlow, Background, BackgroundVariant, Controls, MiniMap, useReactFlow, } from "@xyflow/react";
import { NodeClasses, NodeObj, NodeTypes, COLLAPSED_WIDTH, COLLAPSED_HEIGHT, EXPANDED_MIN_WIDTH, EXPANDED_MIN_HEIGHT} from "@/components/flow/types";

import { useFlowStore, } from "@/components/flow/store/useFlowStore";
import { useProjectStore } from "@/components/flow/store/useProjectStore";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import { useSearchParams } from "next/navigation";

import IconButtonWithHint from "@/components/ui/Icons/IconButtonWithHint";
import { Icon } from "@/components/ui/Icons/Icons";
import Toolbar from "@/components/flow/toolbar/ToolBar";
import Sidebar from "@/components/flow/sidebar/SideBar";
import { NodeOptionCard } from "@/components/flow/sidebar/NodeOptionCard";
import ClickCursor from "@/components/flow/cursor/ClickCursor";
import { SquareMiniMapNode } from "@/components/flow/nodes/MinimapNodes"

import styles from "./canvas.module.css";

import "@xyflow/react/dist/style.css";
import { useDictionary } from "@/utils/CanvasDictionaryContext";

export interface CanvasClientProps {
    lang: string,
    projectId: string,
    nodeId: string,
    canvasName: string,
}

export default function CanvasClient({lang, projectId, nodeId, canvasName} : CanvasClientProps) { // TODO props initial loaded from page.tsx (SUPABASE)

  const dict = useDictionary();
  const searchParams = useSearchParams();
  
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

  const projectName = useProjectStore((s) => s.projectName);
  const rootCanvasId = useProjectStore((s) => s.rootCanvasId);

  
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

  // adding node 
  const labelMap: Record<NodeTypes, string> = {
    note: dict.canvasclient.nodeLabels.note,
    subnode: dict.canvasclient.nodeLabels.redirect,
    group: dict.canvasclient.nodeLabels.group,
  };

  const handleAddNodeCentered = (type: NodeTypes) => {
    const wrapper = reactFlowWrapper.current;
    if (!wrapper) return;

    const rect = wrapper.getBoundingClientRect();

    const position = screenToFlowPosition({
      x: (rect.left + rect.width / 2) - COLLAPSED_WIDTH / 2,
      y: (rect.top + rect.height / 2) - COLLAPSED_HEIGHT / 2,
    });

  const label = labelMap[type];

  addNodeAtPosition(type, position, {
        label: label,
        description: "",
        projectId, 
      });
    setSidebarOpen(false);
  };

  // URL history for back up (from the project navigation)
  const handleBack = useCallback(() => {
    const history = searchParams.get("history") ?? "";
    const stack = history ? history.split(",") : [];
    const previous = stack[stack.length - 1];
    if (!previous) {
      router.push(`/${lang}/canvas/${projectId}`);
    } else {
      const newStack = stack.slice(0, -1);
      router.push(
        `/${lang}/canvas/${projectId}/${previous}${newStack.length ? `?history=${newStack.join(",")}` : ""}`
      );
    }
  }, [searchParams, lang, projectId, router]);

// RENDERING

return (
  <div className={styles.canvasPage}>
    <ClickCursor />
    <div className={styles.reactFlowWrapper} ref={reactFlowWrapper}>


     <div className={styles.topActions}>
       {/* TOP LEFT TOOLBAR */}
       <div className={styles.topLeftLabel}>
         <span>{projectName} | {canvasName}</span>
       </div>
      
       {/* TOP RIGHT TOOLBAR // ROOT AND PROJECT HOME CLEAN HISTORY */}
       <div className={styles.topRightToolbar}>
         <Toolbar children= {(<>
           <IconButtonWithHint iconName="canvasundo" description={dict.canvasclient.toolbar.undo} onClick={undo} disabled={!canUndo}/>
           <IconButtonWithHint iconName="canvasredo" description={dict.canvasclient.toolbar.redo} onClick={redo} disabled={!canRedo}/>
           <IconButtonWithHint iconName="canvasplus" description={dict.canvasclient.toolbar.addNode} onClick={() => setSidebarOpen(true)}/>
           <IconButtonWithHint iconName="canvassave" description={dict.canvasclient.toolbar.save} onClick={() => {}} /> {/* SHOW TOAST TODO after finish*/ }
           <IconButtonWithHint iconName="canvasarrowuptoline" description={dict.canvasclient.toolbar.goBack} onClick={handleBack} />
           <IconButtonWithHint iconName="canvasroot" description={dict.canvasclient.toolbar.goToRoot} onClick={() => {router.push(`/${lang}/canvas/${projectId}/${rootCanvasId}`)}} />
           <IconButtonWithHint iconName="canvashome" description={dict.canvasclient.toolbar.goToProjectHome} onClick={() => {router.push(`/${lang}/canvas/${projectId}`)}} />
         </>)}
         />
       </div>
      </div>
    
      <ReactFlow<NodeObj>
        nodeTypes={NodeClasses}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStart={(_, node) => {startBatch(); setDraggingNodeId(node.id);}}
        onNodeDragStop={(e, node) => {  
          endBatch();
          setDraggingNodeId(null);
          if (node.type === "group") return;

          const allNodes = useFlowStore.getState().nodes;

          const absPosition = node.parentId
            ? (() => {
                const par = allNodes.find((n) => n.id === node.parentId);
                return {
                  x: node.position.x + (par?.position.x ?? 0),
                  y: node.position.y + (par?.position.y ?? 0),
                };
              })()
            : node.position;

          const BOUNDARY_TOLERANCE = 30;

          const expandedGroups = useFlowStore.getState().nodes.filter(
            (n) => 
              n.type === "group" && 
              n.id !== node.id && 
              !!n.data.expanded
            );

          const TOP_OFFSET = COLLAPSED_HEIGHT/2;
          const parent = expandedGroups.find((g) => {
          const gw = (g.style?.width as number) ?? EXPANDED_MIN_WIDTH;
          const gh = (g.style?.height as number) ?? EXPANDED_MIN_HEIGHT;
            return (
              absPosition.x > g.position.x - BOUNDARY_TOLERANCE &&
              absPosition.y > g.position.y + TOP_OFFSET &&
              absPosition.x < g.position.x + gw + BOUNDARY_TOLERANCE &&
              absPosition.y < g.position.y + gh + BOUNDARY_TOLERANCE
            );
          });


          if (parent && node.parentId !== parent.id) {
          // entering a group
            useFlowStore.getState().setNodeParent(node.id, parent.id, {
              x: absPosition.x - parent.position.x,
              y: absPosition.y - parent.position.y,
            });
          } else if (!parent && node.parentId) {
            // only unparent if truly outside the group bounds 
            const currentParent = expandedGroups.find(g => g.id === node.parentId);
            if (currentParent) {
              const gw = (currentParent.style?.width as number) ?? (currentParent.data.width as number) ?? EXPANDED_MIN_WIDTH;
              const gh = (currentParent.style?.height as number) ?? (currentParent.data.height as number) ?? EXPANDED_MIN_HEIGHT;
              const trulyOutside = 
                absPosition.x < currentParent.position.x - BOUNDARY_TOLERANCE ||
                absPosition.y < currentParent.position.y - BOUNDARY_TOLERANCE ||
                absPosition.x > currentParent.position.x + gw + BOUNDARY_TOLERANCE ||
                absPosition.y > currentParent.position.y + gh + BOUNDARY_TOLERANCE;
    
              if (trulyOutside) {
                const oldParent = allNodes.find((n) => n.id === node.parentId);
                useFlowStore.getState().setNodeParent(node.id, undefined, {
                  x: node.position.x + (oldParent?.position.x ?? 0),
                  y: node.position.y + (oldParent?.position.y ?? 0),
                });
              }
            // if not truly outside ( in topbar area) keep as child 
            } else {
            // parent not found in expandedGroups  
              const oldParent = allNodes.find((n) => n.id === node.parentId);
              useFlowStore.getState().setNodeParent(node.id, undefined, {
                x: node.position.x + (oldParent?.position.x ?? 0),
                y: node.position.y + (oldParent?.position.y ?? 0),
              });
            }
          }
        }}
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
          nodeComponent={SquareMiniMapNode}
          style={{ backgroundColor: "var(--accent)" }}
        />
        </div>
      </ReactFlow>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)}>
        <NodeOptionCard
          icon={<> <Icon name="canvasfilepenline" /> </>}
          title={dict.canvasclient.sidebar.textNodeTitle}
          description={dict.canvasclient.sidebar.textNodeDescription}
          onClick={() => {
          handleAddNodeCentered("note"); }}
        /> 
        <NodeOptionCard
          icon={<> <Icon name="canvasarrowdowntoline" /> </>}
          title={dict.canvasclient.sidebar.redirectNodeTitle}
          description={dict.canvasclient.sidebar.redirectNodeDescription}
          onClick={() => {
          handleAddNodeCentered("subnode"); }}
        /> 
        <NodeOptionCard
          icon={<> <Icon name="canvasgroup" /> </>}
          title={dict.canvasclient.sidebar.groupNodeTitle}
          description={dict.canvasclient.sidebar.groupNodeDescription}
          onClick={() => {
          handleAddNodeCentered("group"); }}
        /> 
      </Sidebar>
    </div>
  </div>
);
}