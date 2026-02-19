"use client";

import { NodeProps } from "@xyflow/react";
import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";

import { NodeObj, SubNodeData, CanvasMeta } from "../types";
import { useFlowStore } from "../store/useFlowStore";
import { useProjectStore } from "../store/useProjectStore";
import { Icon } from "@/components/ui/Icons/Icons";
import BaseNode from "./BaseNode";

import styles from "./subnodenode.module.css";

const STATUS_COLORS = {
  root: "var(--accent)",
  linked: "var(--fg)",
  orphan: "var(--bg)",
};

export default function SubNodeNode(props: NodeProps<NodeObj>) {
  const { id, data } = props;

  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const [pickerOpen, setPickerOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  if (data.type !== "subnode") return null;
  const subdata = data as SubNodeData;

  const updateNodeData = useFlowStore((s) => s.updateNodeData);
  const canvases = useProjectStore((s) => s.canvases);
  const addCanvas = useProjectStore((s) => s.addCanvas);
  const addLink = useProjectStore((s) => s.addLink);
  const getStatus = useProjectStore((s) => s.getStatus);

  const lang = params?.lang as string;
  const projectId = params?.projectId as string;
  const currentNodeId = params?.nodeId as string;

  const isLinked = !!subdata.targetCanvasId;
  const available = canvases.filter((c) => c.id !== currentNodeId);

  const handleNavigate = useCallback(() => {
    if (!subdata.targetCanvasId) return;
    const currentHistory = searchParams.get("history") ?? "";
    const newHistory = currentHistory
      ? `${currentHistory},${currentNodeId}`
      : currentNodeId;
    router.push(
      `/${lang}/canvas/${projectId}/${subdata.targetCanvasId}?history=${newHistory}`
    );
  }, [subdata.targetCanvasId, searchParams, currentNodeId, lang, projectId, router]);

  const assignCanvas = useCallback((canvasId: string, canvasName: string) => {
    const newLinkId = addLink(currentNodeId, canvasId);
    updateNodeData(id, "subnode", {
      targetCanvasId: canvasId,
      targetCanvasName: canvasName,
      linkId: newLinkId,
    });
    setPickerOpen(false);
    setNewName("");
  }, [id, currentNodeId, addLink, updateNodeData]);

  const handleCreate = useCallback(() => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    const exists = canvases.some(
      (c) => c.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) {
      console.log("Already exists:", trimmed);
      return;
    }
    const newCanvasId = addCanvas(trimmed, 200, 200);
    assignCanvas(newCanvasId, trimmed);
  }, [newName, canvases, addCanvas, assignCanvas]);


  // click outside handler

  useEffect(() => {
    if (!pickerOpen) return;
    const handle = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    };
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handle, true);
    }, 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handle, true);
    };
  }, [pickerOpen]);

return (
  <BaseNode
    {...props}
    noExpand={true}
    resizable={false}
    noEdit={false}
    iconName="canvasarrowdowntoline"
    specialActionDescription={isLinked ? `→ ${subdata.targetCanvasName}` : "No link"}
    onSpecialAction={isLinked ? handleNavigate : () => {
      setPickerOpen((p) => !p);
      setTimeout(() => inputRef.current?.focus(), 50);
    }}
    modal = {
      pickerOpen && !isLinked ? (
        <div ref={pickerRef} className={`nodrag nopan ${styles.picker}`}>
          <div className={styles.createRow}>
            <input
              ref={inputRef}
              className={styles.createInput}
              placeholder="New subspace..."
              value={newName}
              maxLength={15}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreate();
                if (e.key === "Escape") setPickerOpen(false);
              }}
            />
            <button
              className={styles.createBtn}
              disabled={!newName.trim()}
              onClick={handleCreate}
            >
              <Icon name="canvasplus" />
            </button>
          </div>

          {available.length > 0 && (
            <div className={`${styles.cardList} show-scrollbar`}>
              {available.map((c) => {
                const status = getStatus(c.id);
                return (
                  <button
                    key={c.id}
                    className={styles.card}
                    style={{ borderColor: STATUS_COLORS[status] }}
                    onClick={() => assignCanvas(c.id, c.name)}
                  >
                    <span
                      className={styles.statusDot}
                      style={{ background: STATUS_COLORS[status] }}
                    />
                    <span className={styles.cardName}>{c.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ) : undefined
    }
  >
    {null}
  </BaseNode>
);
}