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

type BaseNodeProps = NodeProps<NodeObj> & { children?: React.ReactNode };
type OpenMenu = "palette" | "menu" | null;

export default function BaseNode({ id, data, children }: BaseNodeProps) {
  const router = useRouter();
  const dict = useDictionary();
  const updateNodeInternals = useUpdateNodeInternals();

  const updateNodeData = useFlowStore((s) => s.updateNodeData);
  const deleteNode = useFlowStore((s) => s.deleteNode);
  const pasteNode = useFlowStore((s) => s.pasteNode);
  const copyNode = useFlowStore((s) => s.copyNode);
  const cutNode = useFlowStore((s) => s.cutNode);

  const paletteRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isDraggingNode, setIsDraggingNode] = useState(false);

  const nodeRef = useRef<HTMLDivElement>(null);

  // CLICK OUTSIDE HANDLER ON MODAL
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDraggingNode || showEditModal) return;
      
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
  }, [isDraggingNode, showEditModal]);

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
      <div
        className={styles.node}
        ref={nodeRef}
        style={{
          background: data.color || "var(--color-default)",
          width: localSize.width,
          height: localSize.height,
          fontSize: "var(--font-canvastitle)",
          fontWeight: "var(--font-weight)",
          visibility: showEditModal ? "hidden" : "visible",
          pointerEvents: showEditModal ? 'none' : 'auto',
        }}
        onDragStart={() => { setIsDraggingNode(true); }}
        onDragEnd={() => {
          setTimeout(() => setIsDraggingNode(false), 100);
        }}
        onMouseDown={() => setIsDraggingNode(false)}
        onMouseMove={(e) => {
          if (e.buttons === 1 && !showEditModal) {
            setIsDraggingNode(true);
          }
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
            width: 12,
            height: 12,
            background: "transparent",
            border: "none",
            }}
            onResizeStart={() => setIsResizing(true)}
            onResize={(e, { width, height }) =>
              setLocalSize({ width, height })
            }
            onResizeEnd={handleResizeEnd}
            
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
                onClick={() =>
                  setOpenMenu(openMenu === "menu" ? null : "menu")
                }
              />

              <IconButtonWithHint
                iconName="canvaspalette"
                description="change color"
                onClick={() =>
                  setOpenMenu(openMenu === "palette" ? null : "palette")
                }
              />

              <IconButtonWithHint
                iconName={data.locked ? "canvaslock" : "canvaslockopen"}
                description={data.locked ? "Unlock resizing" : "Lock resizing"}
                onClick={() =>
                  updateNodeData(id, data.type, {
                    locked: !data.locked,
                  })
                }
              />

              {openMenu === "menu" && (
                <div className={styles.dropdown} ref={menuRef}>
                  <button onClick={() => setShowEditModal(true)}>
                    <Icon name="edit"/> Edit
                  </button>
                  <button onClick={handleCopy}><Icon name="canvascopy"/> Copy</button>
                  <button onClick={handleCut}><Icon name="canvascut"/> Cut</button>
                  <button onClick={handlePaste}><Icon name="canvaspaste"/> Paste</button>
                  <button
                    className={styles.danger}
                    onClick={handleDelete}
                  >
                    <Icon name="canvasdelete"/> Delete
                  </button>
                </div>
              )}

              {openMenu === "palette" && (
                <div className={styles.dropdown} ref={paletteRef}>
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
    }}
  >
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
              />
            ) : (
              <IconButtonWithHint
                iconName="canvasfilepenline"
                description="expand"
                onClick={toggleExpand}
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
    </>
  );
}
