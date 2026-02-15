"use client";

import { Handle, Position, NodeProps, NodeResizer, useStore, useUpdateNodeInternals, } from "@xyflow/react";
import { useState, useEffect, useRef, useCallback} from "react";
import { useRouter } from "next/navigation";

import { NodeObj } from "../types";
import { useFlowStore } from "../store/useFlowStore";
import { useDictionary } from "@/utils/CanvasDictionaryContext";
import { useDebouncedCallback } from 'use-debounce';

import IconButtonWithHint from "@/components/ui/Icons/IconButtonWithHint";

import styles from "./basenode.module.css";


type BaseNodeProps = NodeProps<NodeObj> & { children?: React.ReactNode };7

type OpenMenu = "palette" | "menu" | null;

export default function BaseNode({ id, data, children }: BaseNodeProps) {
  const router = useRouter();
  const dict = useDictionary();

  const zoom = useStore((state) => state.transform[2]);

  const updateNodeData = useFlowStore((s) => s.updateNodeData);
  const updateNodeInternals = useUpdateNodeInternals();

  type OpenMenu = "palette" | "menu" | null;
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);

  const [isResizing, setIsResizing] = useState(false);


  // resize easing
  const [localSize, setLocalSize] = useState({
  width: data.width || 300,
  height: data.height || 180,
  });

  useEffect(() => {
  setLocalSize({
    width: data.width || 300,
    height: data.height || 180,
  });
  }, [data.width, data.height]);


  // handlers

  const toggleExpand =  useCallback( () => {
    updateNodeData(id, data.type, { expanded: !data.expanded });
  }, [id, data.type, data.expanded]);

  const changeColor = useCallback((color: string) => {
    updateNodeData(id, data.type, { color });
  }, [id, data.type]); 


 // Dropdown Click handler 
const dropdownRef = useRef<HTMLDivElement>(null);
const paletteRef = useRef<HTMLDivElement>(null);
const menuRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      (paletteRef.current && !paletteRef.current.contains(event.target as Node)) &&
      (menuRef.current && !menuRef.current.contains(event.target as Node))
    ) {
      setOpenMenu(null);
    }
  };

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape") setOpenMenu(null);
  };

  document.addEventListener("mousedown", handleClickOutside);
  document.addEventListener("keydown", handleEscape);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
    document.removeEventListener("keydown", handleEscape);
  };
}, []);

const delayedUpdateInternals = useDebouncedCallback(() => {

  requestAnimationFrame(() => {
    updateNodeInternals(id);
  });
}, 100);

  return (
    <div
      className={styles.node}
      style={{
        background: data.color || "var(--color-default)",
        width: localSize.width,
        height: localSize.height,
        fontSize: "var(--font-canvastitle)",
        fontWeight: "var(--font-weight)"
      }}
      
    >
      {/* Node Resizer */}
      {!data.locked && (
      <NodeResizer
        minWidth={300}
        minHeight={180}
        isVisible={!data.locked}
        handleStyle={{ width: 2, height: 2,
                       backgroundColor: "transparent", border: "1px solid transparent", borderRadius: 2,
                       padding: 6, boxSizing: "content-box", }}
        lineStyle={{ display: "none" }}

        onResizeStart={() => {
            setIsResizing(true);
        }}
        onResize={(e, { width, height }) => {
            setLocalSize({ width, height });
        }}
        onResizeEnd={() => {
            setIsResizing(false);
            
            updateNodeData(id, data.type, {
            width: localSize.width,
            height: localSize.height,
            });
            delayedUpdateInternals();
            
        }}
      /> )}


      <div className={styles.topBar}>

  {/* LEFT SIDE */}
  <div className={styles.leftBlock}>
    <div className={styles.label}>{data.label}</div>
    <div className={styles.description}>{data.description}</div>

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
        />
      )}
    </div>
  </div>

  {/* RIGHT SIDE */}
  <div className={styles.rightBlock}>
    <IconButtonWithHint
      iconName="ellipsisvertical"
      onClick={() =>  setOpenMenu(openMenu === "menu" ? null : "menu")}
      description="Menu"
    />

    <IconButtonWithHint
      iconName="canvaspalette"
      onClick={() => setOpenMenu(openMenu === "palette" ? null : "palette")}
      description={dict.basenode.palette}
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

    {/* Palette dropdown */}
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
              onClick={() => changeColor(c)}
            />
          ))}
        </div>
      </div>
    )}

    {/* Ellipsis dropdown */}
    {openMenu === "menu" && (
      <div className={styles.dropdown} ref={menuRef}>
        <button onClick={() => console.log("Duplicate")}>
          Duplicate
        </button>
        <button onClick={() => console.log("Delete")}>
          Delete
        </button>
      </div>
    )}
    </div>
    </div>

      {/* Expandable Content */}
      {data.expanded && <div className={styles.content}>{children}</div>}

      {/* Handles */}
      <Handle type="target" position={Position.Top} className={styles.handle} />
      <Handle type="source" position={Position.Bottom} className={styles.handle} />
    </div>
  );
}
