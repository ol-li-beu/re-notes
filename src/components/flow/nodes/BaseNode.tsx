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

type BaseNodeProps = NodeProps<NodeObj> & { children?: React.ReactNode; iconName?: keyof typeof ICONSTYPE };
type OpenMenu = "palette" | "menu" | null;

export default function BaseNode({ id, data, children, iconName }: BaseNodeProps) {
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

  /* SIZE LOGIC */

  const isExpanded = !!data.expanded;

  const computedWidth = isExpanded
    ? data.width ?? EXPANDED_MIN_WIDTH
    : COLLAPSED_WIDTH;

  const computedHeight = isExpanded
    ? data.height ?? EXPANDED_MIN_HEIGHT
    : COLLAPSED_HEIGHT;

  const [localSize, setLocalSize] = useState({
    width: computedWidth,
    height: computedHeight,
  });

  // Sync when data changes (undo/redo etc.)
  useEffect(() => {
    setLocalSize({
      width: computedWidth,
      height: computedHeight,
    });
  }, [computedWidth, computedHeight]);

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
    updateNodeData(id, data.type, {
    expanded: !isExpanded,
    });
  }, [id, data.type, isExpanded, updateNodeData])

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    if (!isExpanded) return;

    updateNodeData(id, data.type, {
      width: localSize.width,
      height: localSize.height,
    });
  }, [id, data.type, isExpanded, localSize, updateNodeData]);





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
        className={`${styles.node} ${isDraggingNode ? styles.nodeDragging : ""}`}
        ref={nodeRef}
        style={{
          background: data.color || "var(--color-default)",
          width: localSize.width,
          height: localSize.height,
          fontSize: "var(--font-canvastitle)",
          fontWeight: "var(--font-weight)",
          opacity: showEditModal ? 0 : 1,
          pointerEvents: showEditModal ? "none" : "auto",
          transform: isDraggingNode
            ? "translateY(-10px) scale(1.04) rotate(0.4deg)"
            : "translateY(0px) scale(1) rotate(0deg)",
          transition: isResizing
            ? "none"
            : "width 0.2s ease, height 0.2s ease, transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.22s cubic-bezier(0.2, 0.8, 0.2, 1)",
          boxShadow: isDraggingNode
            ? "0 18px 40px rgba(0,0,0,0.55)"
            : "0 2px 6px rgba(0,0,0,0.4)"
        }}
      >
        {/* Resizer only when expanded */}
        {!data.locked && !showEditModal && isExpanded && (
          <NodeResizer
            minWidth={EXPANDED_MIN_WIDTH}
            minHeight={EXPANDED_MIN_HEIGHT}
            maxWidth={EXPANDED_MAX_WIDTH}
            maxHeight={EXPANDED_MAX_HEIGHT}
            isVisible
            lineStyle={{ display: "none" }}
            handleStyle={{
            width: 16,
            height: 16,
            background: "transparent",
            border: "none",
            }}
            onResizeStart={() => {setIsResizing(true); startBatch();}}
            onResize={(e, { width, height }) =>
              setLocalSize({ width, height })
            }
            onResizeEnd={() => {handleResizeEnd(); endBatch(); }}
            
          />
        )}

        {/* TOP BAR */}
        <div className={styles.topBar}>
          <div className={styles.topRow}>
            <div>
              <div className={styles.label}>{data.label}</div>
              <div className={styles.description}>{data.description}</div>
            </div>

            <div className={styles.rightBlock}>
              <IconButtonWithHint
                iconName="ellipsisvertical"
                description="menu"
                onClick={() => {
                  setOpenMenu(prev => (prev === "menu" ? null : "menu"))
                }}
                disabled={isDraggingNode}
              />

              <IconButtonWithHint
                iconName="canvaspalette"
                description="change color"
                onClick={() =>
                  setOpenMenu(openMenu === "palette" ? null : "palette")
                }
                disabled={isDraggingNode}
              />

              <IconButtonWithHint
                iconName={data.locked ? "canvaslock" : "canvaslockopen"}
                description={data.locked ? "Unlock resizing" : "Lock resizing"}
                onClick={() =>
                  updateNodeData(id, data.type, {
                    locked: !data.locked,
                  })
                }
                disabled={isDraggingNode}
              />

              {openMenu === "menu" && (
                <div className={`${styles.dropdown} ${openMenu === "menu" ? styles.dropdownOpen : ""}`} ref={menuRef}
                >
                  <button onClick={() => { setOpenMenu(null); setShowEditModal(true); }}>
                    <Icon name="edit"/> Edit
                  </button>
                  <button onClick={() => { setOpenMenu(null); handleCopy(); }}><Icon name="canvascopy"/> Copy</button>
                  <button onClick={() => { setOpenMenu(null); handleCut(); }}><Icon name="canvascut"/> Cut</button>
                  <button onClick={() => { setOpenMenu(null); handlePaste(); }}><Icon name="canvaspaste"/> Paste</button>
                  <button
                    className={styles.danger}
                    onClick={() => { setOpenMenu(null); handleDelete(); }}
                  >
                    <Icon name="canvasdelete"/> Delete
                  </button>
                </div>
              )}

              {openMenu === "palette" && (
                <div className={`${styles.dropdown} ${styles.dropdownOpen}`} ref={paletteRef}>
                  {[
                    "var(--color-default)",
                    "var(--color-blue)",
                    "var(--color-red)",
                    "var(--color-green)",
                    "var(--color-yellow)",
                    "var(--color-orange)",
                    "var(--color-purple)",
                    "var(--color-teal)",
                  ].map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                      changeColor(c);
                      setOpenMenu(null);
                    }}>
                      <span
                        className={styles.colorPreview}
                        style={{ background: c }}
                      />
                      {c.replace("var(--color-", "").replace(")", "")}
                    </button>
                    ))}
                </div> )}
            </div>
          </div>

          <div className={styles.specialAction}>
            {data.type === "subnode" && data.redirectId ? (
              <IconButtonWithHint
                iconName="canvasarrowdowntoline"
                description="navigate"
                onClick={() =>
                  router.push(
                    `/canvas/${data.projectId}/${data.redirectId}`
                  )
                }
                disabled={isDraggingNode}
              />
            ) : (
              <IconButtonWithHint
                iconName={!!iconName ? iconName : "canvasarrowdowntoline"}
                description="expand"
                onClick={toggleExpand}
                disabled={isDraggingNode}
              />
            )}
          </div>
        </div>

        {/* CONTENT */}
      
          <div
            className={`${styles.content} ${
            isExpanded ? styles.contentExpanded : styles.contentCollapsed
            }`}>
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
          dict={dict}
          
        />
       )}
     </div>
    </>
  );
}
