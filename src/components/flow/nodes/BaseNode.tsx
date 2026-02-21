"use client";

import {
  Handle,
  Position,
  NodeProps,
  NodeResizer,
  useUpdateNodeInternals,
} from "@xyflow/react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icons/Icons";
import { ICONSTYPE } from "@/utils/types";

import {
  NodeObj,
  COLLAPSED_WIDTH,
  COLLAPSED_HEIGHT,
  EXPANDED_MIN_WIDTH,
  EXPANDED_MIN_HEIGHT,
  EXPANDED_MAX_WIDTH,
  EXPANDED_MAX_HEIGHT,
} from "../types";

import { useFlowStore } from "../store/useFlowStore";
import { useDictionary } from "@/utils/CanvasDictionaryContext";


import IconButtonWithHint from "@/components/ui/Icons/IconButtonWithHint";
import BaseNodeModal from "../utils/BaseNodeModal";


import styles from "./basenode.module.css";

type BaseNodeProps = NodeProps<NodeObj> & { children?: React.ReactNode; iconName?: keyof typeof ICONSTYPE; 
  resizable?: boolean; noEdit?: boolean; onSpecialAction?: () => void; specialActionDescription?: string; noExpand?: boolean;
  modal?: React.ReactNode; noLock?: boolean; dragHandle?: string; };

type OpenMenu = "palette" | "menu" | null;

export default function BaseNode({ id, data, children, iconName, resizable=true, selected, noEdit=false, 
  onSpecialAction, specialActionDescription, noExpand = false, modal, noLock=false, dragHandle }: BaseNodeProps) {

  const router = useRouter();
  const dict = useDictionary();
  const updateNodeInternals = useUpdateNodeInternals();

  const updateNodeData = useFlowStore((s) => s.updateNodeData);
  const deleteNode = useFlowStore((s) => s.deleteNode);
  const pasteNode = useFlowStore((s) => s.pasteNode);
  const copyNode = useFlowStore((s) => s.copyNode);
  const cutNode = useFlowStore((s) => s.cutNode);
  const startBatch = useFlowStore((s) => s.startBatch);
  const endBatch = useFlowStore((s) => s.endBatch);

  const paletteRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const draggingNodeId = useFlowStore(s => s.draggingNodeId);
  const isDraggingNode = draggingNodeId === id;

  const nodeRef = useRef<HTMLDivElement>(null);

  const hasModal = showEditModal;

  const maxWidth = data.type === "group" ? 999999 : EXPANDED_MAX_WIDTH;
  const maxHeight = data.type === "group" ? 999999 : EXPANDED_MAX_HEIGHT;
  
  const thisNode = useFlowStore((s) => s.nodes.find((n) => n.id === id));
  const isInGroup = !!thisNode?.parentId;
  

  // CLICK OUTSIDE HANDLER ON MODAL
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showEditModal) return;
      
      const target = event.target as HTMLElement;
      
      if (
        (paletteRef.current && paletteRef.current.contains(target)) ||
        (menuRef.current && menuRef.current.contains(target)) ||
        target.closest('[data-menu-trigger]')
      ) {
        return;
      }
      
      setOpenMenu(null);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (showEditModal) {
          setShowEditModal(false);
        } else {
          setOpenMenu(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside, true);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showEditModal]);

  /* COlors array with typing */
  const COLORS: { value: string; key: keyof typeof dict.basenode.colors }[] = [
    { value: "var(--color-default)", key: "default" },
    { value: "var(--color-blue)",    key: "blue"    },
    { value: "var(--color-red)",     key: "red"     },
    { value: "var(--color-green)",   key: "green"   },
    { value: "var(--color-yellow)",  key: "yellow"  },
    { value: "var(--color-orange)",  key: "orange"  },
    { value: "var(--color-purple)",  key: "purple"  },
    { value: "var(--color-teal)",    key: "teal"    },
  ];

  /* SIZE LOGIC */



  // group on first expand included 
  const isExpanded = !!data.expanded;
  const computedWidth = isExpanded
    ? data.width ?? (data.type === "group" ? 600 : EXPANDED_MIN_WIDTH)
    : COLLAPSED_WIDTH;

  const computedHeight = isExpanded
    ? data.height ?? (data.type === "group" ? 500 : EXPANDED_MIN_HEIGHT)
    : COLLAPSED_HEIGHT;

  const [localSize, setLocalSize] = useState({
    width: computedWidth,
    height: computedHeight,
  });

  const localSizeRef = useRef(localSize);

  // Sync when data changes (undo/redo etc

  useEffect(() => {
    localSizeRef.current = localSize;
  }, [localSize]);

  useEffect(() => {
    if (isResizing) return;
    setLocalSize({ width: computedWidth, height: computedHeight, });
    updateNodeInternals(id);
  }, [data.width, data.height, data.expanded, id, isResizing]);
  
  /* EDGE UPDATE based on observer for optimal performance*/
  useEffect(() => {
    if (!nodeRef.current) return;

    const observer = new ResizeObserver(() => {
      updateNodeInternals(id);
    });

    observer.observe(nodeRef.current);

    return () => {
      observer.disconnect();
    };
    }, [id, updateNodeInternals]);
   
  const toggleExpand = useCallback(() => {
    updateNodeData(id, data.type, { expanded: !isExpanded, });
    requestAnimationFrame(() => { 
      updateNodeInternals(id);
    });
  }, [id, data.type, isExpanded, updateNodeData, updateNodeInternals])

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    if (!isExpanded) return;

    const { width, height } = localSizeRef.current;
    console.log("RESIZE END", { localSize, id, type: data.type });
    console.log("RESIZE END from ref", { width, height });

    updateNodeData(id, data.type, { width, height});
    updateNodeInternals(id);
  }, [id, data.type, isExpanded, localSize, updateNodeData, updateNodeInternals]);


  const handleRemoveFromGroup = useCallback(() => {
      const allNodes = useFlowStore.getState().nodes;
      const self = allNodes.find((n) => n.id === id);
      if (!self?.parentId) return;
        const parent = allNodes.find((n) => n.id === self.parentId);
        useFlowStore.getState().setNodeParent(id, undefined, {
          x: self.position.x + (parent?.position.x ?? 0),
          y: self.position.y + (parent?.position.y ?? 0),
        });
    }, [id]);


  /* MENU ACTIONS */

  const changeColor = useCallback(
    (color: string) => {
      updateNodeData(id, data.type, { color });
    },
    [id, data.type, updateNodeData]
  );

  const handleSaveEdit = useCallback(
    (editData: { label: string; description: string }) => {
      updateNodeData(id, data.type, {
        label: editData.label,
        description: editData.description,
      });
      setShowEditModal(false);
    },
    [id, data.type, updateNodeData]
  );

  const handleDelete = useCallback(() => {
    deleteNode(id);
    setOpenMenu(null);
  }, [id, deleteNode]);

  const handleCopy = useCallback(() => {
    copyNode(id);
    setOpenMenu(null);
  }, [id, copyNode]);

  const handleCut = useCallback(() => {
    cutNode(id);
    setOpenMenu(null);
  }, [id, cutNode]);

  const handlePaste = useCallback(() => {
    pasteNode();
    setOpenMenu(null);
  }, [pasteNode]);

  /* RENDER*/

  return (
    <>
    <div className={`${styles.wrapper} ${isDraggingNode ? styles.nodeDragging : ""}`}>
      <div
        className={`${styles.node} ${selected ? styles.selected : ""}`}
        ref={nodeRef}
        style={{
          background: data.color || " var(--node-bg)",
          width: isResizing ? localSizeRef.current.width : isExpanded ? "100%" : COLLAPSED_WIDTH,
          height: isResizing ? localSizeRef.current.height : isExpanded ? "100%" : COLLAPSED_HEIGHT,
          minWidth: COLLAPSED_WIDTH,
          minHeight: COLLAPSED_HEIGHT,
          fontSize: "var(--font-canvastitle)",
          fontWeight: "var(--font-weight)",
          opacity: 1,
          pointerEvents: hasModal ? "none" : "auto",
          transform: isDraggingNode
            ? "translateY(-10px) scale(1.04) rotate(0.4deg)"
            : "translateY(0px) scale(1) rotate(0deg)",
          transition: isResizing
            ? "none"
            : isInGroup
            ? "none"
            : data.type === "group"
            ? "width 0.15s ease, height 0.15s ease, transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.22s cubic-bezier(0.2, 0.8, 0.2, 1)"
            : isExpanded
            ? "transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.22s cubic-bezier(0.2, 0.8, 0.2, 1)"
            : "transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.22s cubic-bezier(0.2, 0.8, 0.2, 1)",
          boxShadow: isDraggingNode
            ? "0 18px 40px rgba(0,0,0,0.55)"
            : "0 2px 6px rgba(0,0,0,0.4)"
        }}
      >
        {/* Resizer only when expanded */}
        {!data.locked && !showEditModal && isExpanded && resizable !== false && noExpand !== true && (
          <NodeResizer
            minWidth={EXPANDED_MIN_WIDTH}
            minHeight={EXPANDED_MIN_HEIGHT}
            maxWidth={maxWidth}
            maxHeight={maxHeight}
            isVisible
            lineStyle={{ display: "none" }}
            handleStyle={{
            width: 16,
            height: 16,
            background: "transparent",
            border: "none",
            }}
            onResizeStart={() => {setIsResizing(true); startBatch();}}
            onResize={(_, { width, height }) => {
              localSizeRef.current = { width, height };
              useFlowStore.setState(s => ({
                nodes: s.nodes.map(n =>
                  n.id === id
                  ? { ...n, style: { ...n.style, width, height }, data: { ...n.data, width, height } }
                  : n
                )
              }));
              // Live group container resize
              const node = useFlowStore.getState().nodes.find(n => n.id === id);
              if (node?.parentId) {
                useFlowStore.getState().resizeGroupToFitChildren(node.parentId);
              }
            }}
            onResizeEnd={() => {handleResizeEnd(); endBatch(); }}
            nodeId={id}
            
          />
        )}

        {/* TOP BAR */}
        <div className={`${styles.topBar} ${dragHandle ? "groupDragHandle" : ""}`}>
          <div className={styles.topRow}>
            <div className={styles.leftBlock}>
              <div className={styles.label}>{data.label}</div>
              <div className={styles.description}>{data.description}</div>
            </div>

            <div className={styles.rightBlock}>
              <IconButtonWithHint
                iconName="ellipsisvertical"
                description={dict.basenode.menu}
                onClick={() => {
                  setOpenMenu(prev => (prev === "menu" ? null : "menu"))
                }}
                disabled={isDraggingNode}
              />

              <IconButtonWithHint
                iconName="canvaspalette"
                description={dict.basenode.palette}
                onClick={() =>
                  setOpenMenu(openMenu === "palette" ? null : "palette")
                }
                disabled={isDraggingNode}
              />

              {noLock !== true && (
               <IconButtonWithHint
                iconName={data.locked ? "canvaslock" : "canvaslockopen"}
                description={data.locked ? dict.basenode.lock : dict.basenode.unlock}
                onClick={() =>
                  updateNodeData(id, data.type, {
                    locked: !data.locked,
                  })
                }
                disabled={isDraggingNode}
               />
              )}    

              {openMenu === "menu" && (
                <div className={`${styles.dropdown} ${openMenu === "menu" ? styles.dropdownOpen : ""}`} ref={menuRef}
                >
                  {noEdit !== true && (
                    <button onClick={() => { setOpenMenu(null); setShowEditModal(true); }}>
                      <Icon name="edit"/> {dict.basenode.edit}
                    </button>
                  )}
                  <button onClick={() => { setOpenMenu(null); handleCopy(); }}><Icon name="canvascopy"/> {dict.basenode.copy}</button>
                  <button onClick={() => { setOpenMenu(null); handleCut(); }}><Icon name="canvascut"/> {dict.basenode.cut}</button>
                  <button onClick={() => { setOpenMenu(null); handlePaste(); }}><Icon name="canvaspaste"/> {dict.basenode.paste}</button>
                  <button
                    className={styles.danger}
                    onClick={() => { setOpenMenu(null); handleDelete(); }}
                  >
                    <Icon name="canvasdelete"/> {dict.basenode.delete}
                  </button>
                </div>
              )}

              {openMenu === "palette" && (
                <div className={`${styles.dropdown} ${styles.dropdownOpen}`} ref={paletteRef}>
                  {COLORS.map(({ value, key }) => (
                    <button
                      key={value}
                      onClick={() => {
                      changeColor(value);
                      setOpenMenu(null);
                      }}
                    >
                     <span
                       className={styles.colorPreview}
                       style={{ background: value }}
                     />
                       {dict.basenode.colors[key]}
                    </button>
                  ))}
                </div> )}
            </div>
          </div>

          <div className={styles.specialAction}>
              <IconButtonWithHint
              iconName={iconName ?? "canvasarrowdowntoline"}
              description={
                specialActionDescription
                ? specialActionDescription
                : noExpand
                ? ""
                : isExpanded ? dict.basenode.collapse : dict.basenode.expand
              }
              onClick={noExpand ? onSpecialAction : (onSpecialAction ?? toggleExpand)}
              disabled={isDraggingNode}
            />

            {isInGroup && (
               <IconButtonWithHint
                iconName="canvasungroup"
                description={dict.basenode.ungroup}
                onClick={handleRemoveFromGroup}
                disabled={isDraggingNode}
               />
              )}
          </div>
        </div>

        {/* CONTENT */}
      
          <div
            className={`${styles.content} ${isExpanded ? styles.contentExpanded : styles.contentCollapsed} 
            ${data.type === "group" ? styles.contentGroup : ""}
            ${data.type === "group" ? "nodrag" : ""}`}
          >

            {children}
          </div>
        

        <Handle
          type="target"
          position={Position.Top}
          className={styles.handle}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          className={styles.handle}
        />
     </div>

     {showEditModal && (
        <BaseNodeModal
          nodeData={data}
          nodeSize={localSize}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveEdit}
          dict={dict.basenodemodal}
        />
      )}

      {modal} {/* If custom modal apart from desc and label */}

     </div>
    </>
  );
}
