"use client";

import { NodeProps, Handle, Position, Node as XYNode, } from "@xyflow/react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { GraphNodeData, CanvasStatus,} from "../types";
import { useProjectStore } from "../store/useProjectStore";

import IconButtonWithHint from "@/components/ui/Icons/IconButtonWithHint";
import ConfirmModal from "@/components/ui/ConfirmModal/ConfirmModal";

import styles from "./graphnode.module.css";


export type GraphNodeObj = XYNode<GraphNodeData>;

const STATUS_COLORS: Record<CanvasStatus, string> = {
  root: "var(--accent)",
  linked: "var(--fg)",
  orphan: "var(--contrast)",
};

export default function GraphNode({ data }: NodeProps<GraphNodeObj>) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(data.name);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const renameCanvas = useProjectStore((s) => s.renameCanvas);
  const deleteCanvas = useProjectStore((s) => s.deleteCanvas);
  const getCanvasStats = useProjectStore((s) => s.getCanvasStats);
  const rootCanvasId = useProjectStore((s) => s.rootCanvasId);

  const isRoot = data.canvasId === rootCanvasId;
  const color = STATUS_COLORS[data.status];

  useEffect(() => {
    if (isRenaming) inputRef.current?.focus();
  }, [isRenaming]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Element)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside, true);
    return () => document.removeEventListener("mousedown", handleClickOutside, true);
  }, []);

  const handleRename = useCallback(() => {
    const trimmed = renameValue.trim();
    if (!trimmed || trimmed === data.name) {
      setRenameValue(data.name);
      setIsRenaming(false);
      return;
    }
    renameCanvas(data.canvasId, trimmed);
    setIsRenaming(false);
  }, [renameValue, data.name, data.canvasId, renameCanvas]);

  const stats = getCanvasStats(data.canvasId);
  

  return (
    <>
      <div
        className={`${styles.wrapper}`}
        style={{
            borderColor: color,
            boxShadow: `0 0 0 3px ${color}22`,
        }}
      >
        {isRenaming ? (
          <input
            ref={inputRef}
            className={`nodrag ${styles.renameInput}`}
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRename();
              if (e.key === "Escape") {
                setRenameValue(data.name);
                setIsRenaming(false);
              }
            }}
          />
        ) : (
          <span className={styles.name}>{data.name}</span>
        )}

        <span className={styles.badge} 
              style={{ background: color, color: data.status === "orphan" ? "var(--fg)" : "var(--bg)",}}>
          {data.status}
        </span>

        <div className={`nodrag nopan ${styles.menuButtonWrapper}`}>
          <IconButtonWithHint
            iconName="canvasellipsis"
            description="options"
            onClick={() => {
                setMenuOpen((p) => !p);
            }}
            />
        </div>

        {menuOpen && (
          <div className={`nodrag ${styles.dropdown}`} ref={menuRef}>
            <button onClick={() => {
              router.push(`/canvas/${data.projectId}/${data.canvasId}`);
              setMenuOpen(false);
            }}>
              Enter
            </button>

            {!isRoot && (
              <button onClick={() => {
                setIsRenaming(true);
                setMenuOpen(false);
              }}>
                Rename
              </button>
            )}

            {!isRoot && (
              <button
                className={styles.danger}
                onClick={() => {
                  setShowDeleteModal(true);
                  setMenuOpen(false);
                }}
              >
                Delete
              </button>
            )}
          </div>
        )}

        <Handle
            type="source"
            position={Position.Left}
            style={{
                opacity: 0,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                }}
        />
        <Handle
            type="target"
            position={Position.Left}
            style={{
                opacity: 0,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
            }}
        />
      </div>

      {showDeleteModal && (
        <ConfirmModal
          title={`Delete "${data.name}"?`}
          description={`Incoming links: ${stats.incomingCount} · Outgoing: ${stats.outgoingCount}. This cannot be undone.`}
          btncancel="Cancel"
          btnconfirm="Delete"
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={() => {
            deleteCanvas(data.canvasId);
            setShowDeleteModal(false);
          }}
        />
      )}
    </>
  );
}