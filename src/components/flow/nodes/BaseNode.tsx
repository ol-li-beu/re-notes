"use client";

import { Handle, Position, NodeProps, NodeResizer, useStore, useUpdateNodeInternals } from "@xyflow/react";
import { useState, useEffect, useRef, useCallback} from "react";
import { useRouter } from "next/navigation";

import { NodeObj } from "../types";
import { useFlowStore } from "../store/useFlowStore";
import { useDictionary } from "@/utils/CanvasDictionaryContext";
import { useDebouncedCallback } from 'use-debounce';

import IconButtonWithHint from "@/components/ui/Icons/IconButtonWithHint";
import BaseNodeModal from "../utils/BaseNodeModal";
import { Icon } from "@/components/ui/Icons/Icons";

import styles from "./basenode.module.css";

type BaseNodeProps = NodeProps<NodeObj> & { children?: React.ReactNode };

type OpenMenu = "palette" | "menu" | null;

export default function BaseNode({ id, data, children }: BaseNodeProps) {
  const router = useRouter();
  const dict = useDictionary();
  const zoom = useStore((state) => state.transform[2]);

  const updateNodeData = useFlowStore((s) => s.updateNodeData);
  const updateNodeInternals = useUpdateNodeInternals();
  const deleteNode = useFlowStore((s) => s.deleteNode);
  const pasteNode = useFlowStore((s) => s.pasteNode);
  const copyNode = useFlowStore((s) => s.copyNode);
  const cutNode = useFlowStore((s) => s.cutNode);

  const nodeRef = useRef<HTMLDivElement>(null);
  const paletteRef = useRef<HTMLDivElement>(null);   
  const menuRef = useRef<HTMLDivElement>(null); 
  const contentRef = useRef<HTMLDivElement>(null);
  
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const [isDraggingNode, setIsDraggingNode] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const [localSize, setLocalSize] = useState({
    width: data.width || 300,
    height: data.height || 220,
  });

  const [contentConstraints, setContentConstraints] = useState({
    minHeight: 220,
    maxHeight: 2000,
  });

  // Sync with data changes
  useEffect(() => {
    setLocalSize({
      width: data.width || 300,
      height: data.height || 220,
    });
  }, [data.width, data.height]);

  // 🔧 FIXED: Smart expansion logic that preserves collapsed height
  useEffect(() => {
    if (!contentRef.current) return;

    const timeoutId = setTimeout(() => {
      if (data.expanded && !isResizing) {
        const contentHeight = contentRef.current!.scrollHeight;
        const topBarHeight = 110;
        const padding = 40;
        const calculatedHeight = topBarHeight + contentHeight + padding;
        const newHeight = Math.max(calculatedHeight, 350);
        
        setContentConstraints({
          minHeight: Math.max(newHeight - 50, 300),
          maxHeight: Math.max(newHeight + 400, 800),
        });
        
        if (Math.abs(newHeight - localSize.height) > 20) {
          setLocalSize(prev => ({ ...prev, height: newHeight }));
          // 🔧 CRITICAL: When expanded, only update height, NOT collapsedHeight
          updateNodeData(id, data.type, { height: newHeight });
          
          requestAnimationFrame(() => {
            updateNodeInternals(id);
          });
        }
      } else if (!data.expanded && !isResizing) {
        // Collapsing: restore saved collapsed height
        const restoredHeight = data.collapsedHeight || 220;
        
        setContentConstraints({ minHeight: 220, maxHeight: 2000 });
        
        if (Math.abs(localSize.height - restoredHeight) > 5) {
          setLocalSize(prev => ({ ...prev, height: restoredHeight }));
          updateNodeData(id, data.type, { height: restoredHeight });
        }
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [data.expanded, children, isResizing, id, data.type, data.collapsedHeight, localSize.height, updateNodeData, updateNodeInternals]);

  // 🔧 FIXED: Save collapsed height before expanding
  const toggleExpand = useCallback(() => {
    if (!data.expanded) {
      // Expanding: save current height as collapsed height
      updateNodeData(id, data.type, { 
        expanded: true,
        collapsedHeight: localSize.height,
      });
    } else {
      // Collapsing: restore to saved height
      const restoredHeight = data.collapsedHeight || 220;
      setLocalSize(prev => ({ ...prev, height: restoredHeight }));
      updateNodeData(id, data.type, { 
        expanded: false,
        height: restoredHeight,
      });
    }
  }, [id, data.type, data.expanded, data.collapsedHeight, localSize.height, updateNodeData]);

  const changeColor = useCallback((color: string) => {
    updateNodeData(id, data.type, { color });
  }, [id, data.type, updateNodeData]); 

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

  const handlePaste = useCallback(() => {
    pasteNode();
    setOpenMenu(null);
  }, [pasteNode]);

  const handleCopy = useCallback(() => {
    copyNode(id);
    setOpenMenu(null);
  }, [id, copyNode]);

  const handleCut = useCallback(() => {
    cutNode(id);
    setOpenMenu(null);
  }, [id, cutNode]);

  
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


  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    
    const dataUpdate: any = {
      width: localSize.width,
      height: localSize.height,
    };
    

    if (!data.expanded) {
      dataUpdate.collapsedHeight = localSize.height;
    }
    // If expanded, keep old collapsedHeight unchanged
    
    updateNodeData(id, data.type, dataUpdate);
    updateNodeInternals(id);
  }, [id, data.type, data.expanded, localSize, updateNodeData, updateNodeInternals]);

  return ( 
    <>
      <div
        ref={nodeRef}
        className={`${styles.node}`}
        style={{
          background: data.color || "var(--color-default)",
          width: localSize.width,
          height: localSize.height,
          fontSize: "var(--font-canvastitle)",
          fontWeight: "var(--font-weight)",
          visibility: showEditModal ? "hidden" : "visible",
          pointerEvents: showEditModal ? 'none' : 'auto',
          transition: isResizing ? 'none' : 'height 0.25s ease-out',
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
        {!data.locked && !showEditModal && (
          <NodeResizer
            minWidth={300}
            minHeight={data.expanded ? contentConstraints.minHeight : 220}
            maxHeight={data.expanded ? contentConstraints.maxHeight : undefined}
            isVisible={!data.locked && !showEditModal}
            handleStyle={{ 
              width: 2, 
              height: 2,
              backgroundColor: "transparent", 
              border: "1px solid transparent", 
              borderRadius: 2,
              padding: 6, 
              boxSizing: "content-box",
            }}
            lineStyle={{ display: "none" }}
            onResizeStart={() => {
              setIsResizing(true);
            }}
            onResize={(e, { width, height }) => {
              setLocalSize({ width, height });
            }}
            onResizeEnd={handleResizeEnd}
          />
        )}

        <div className={styles.topBar}>
          <div className={styles.topRow}>
            <div className={styles.leftBlock}>
              <div className={styles.label}>{data.label}</div>
              <div className={styles.description}>{data.description}</div>
            </div>

            <div className={styles.rightBlock}>
              <IconButtonWithHint
                iconName="ellipsisvertical"
                onClick={() => setOpenMenu(openMenu === "menu" ? null : "menu")}
                description="Menu"
                data-menu-trigger="true"
              />

              <IconButtonWithHint
                iconName="canvaspalette"
                onClick={() => setOpenMenu(openMenu === "palette" ? null : "palette")}
                description={dict.basenode.palette}
                data-menu-trigger="true"
              />

              <IconButtonWithHint
                iconName={data.locked ? "canvaslock" : "canvaslockopen"}
                onClick={() =>
                  updateNodeData(id, data.type, { locked: !data.locked })
                }
                description={
                  data.locked ? "Unlock Resizing" : "Lock Resizing"
                }
              />

              {openMenu === "palette" && (
                <div className={styles.dropdown} ref={paletteRef}>
                  <div className={styles.colorGrid}>
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
                        className={styles.colorOption}
                        style={{ background: c }}
                        onClick={(e) => {
                          e.stopPropagation();  
                          changeColor(c);
                          setOpenMenu(null);
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {openMenu === "menu" && (
                <div className={styles.dropdown} ref={menuRef}>
                  <button onClick={(e) => {
                    e.stopPropagation();
                    setShowEditModal(true);
                    setOpenMenu(null);
                  }}>
                    Edit
                  </button>

                  <button onClick={(e) => {
                    e.stopPropagation();
                    handleCopy();
                  }}>
                    Copy
                  </button>

                  <button onClick={(e) => {
                    e.stopPropagation();
                    handleCut();
                  }}>
                    Cut
                  </button>

                  <button onClick={(e) => {
                    e.stopPropagation();
                    handlePaste();
                  }}>
                    Paste
                  </button>

                  <button onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className={styles.specialAction}>
            {data.type === "subnode" && data.redirectId ? (
              <IconButtonWithHint
                iconName="canvasarrowdowntoline"
                onClick={() =>
                  router.push(`/canvas/${data.projectId}/${data.redirectId}`)
                }
                description="Go to subnode"
              />
            ) : (
              <IconButtonWithHint
                iconName="canvasfilepenline"
                onClick={toggleExpand}
                description="Expand"
                size={28}
              />
            )}
          </div>
        </div>

        {data.expanded && (
          <div className={styles.content} ref={contentRef}>
            {children}
          </div>
        )}

        <Handle type="target" position={Position.Top} className={styles.handle} />
        <Handle type="source" position={Position.Bottom} className={styles.handle} />
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