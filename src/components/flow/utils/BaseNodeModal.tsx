"use client";

import { useEffect, useState, useRef } from "react";
import { NodeData } from "../types";
import { COLLAPSED_WIDTH, COLLAPSED_HEIGHT, EXPANDED_DEFAULT_WIDTH, EXPANDED_DEFAULT_HEIGHT } from "../types";
import styles from "./basenodemodal.module.css";

const MAX_TITLE = 20;
const MAX_DESC = 40;




export default function BaseNodeModal({ nodeData, nodeSize, onClose, onSave, dict }: {
  nodeData: NodeData | null;
  nodeSize?: { width: number; height: number };
  onClose: () => void;
  onSave: (data: { label: string; description: string }) => void;
  dict: any;
}) {
  const [label, setLabel] = useState("");
  const [desc, setDesc] = useState("");
  const [shakeLabel, setShakeLabel] = useState(false);
  const [shakeDesc, setShakeDesc] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const initial = useRef<{ label: string; desc: string }>({
    label: "",
    desc: "",
  });

  const modalWidth = Math.max(nodeSize?.width ?? 0, EXPANDED_DEFAULT_WIDTH) + 10;
  const modalHeight = Math.max(nodeSize?.height ?? 0, EXPANDED_DEFAULT_HEIGHT) + 10;

  useEffect(() => {
    if (nodeData) {
      setLabel(nodeData.label);
      setDesc(nodeData.description || "");
      initial.current = {
        label: nodeData.label,
        desc: nodeData.description || "",
      };
    }
  }, [nodeData]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Click outside to close modal
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const isDirty =
    label.trim() !== initial.current.label ||
    desc.trim() !== initial.current.desc;

  useEffect(() => {
    if (shakeLabel) setTimeout(() => setShakeLabel(false), 300);
    if (shakeDesc) setTimeout(() => setShakeDesc(false), 300);
  }, [shakeLabel, shakeDesc]);

  return (
    <div
      ref={modalRef}
      className={`${styles.modal}`}
      style={{
        width: `${modalWidth}px`,
        height: `${modalHeight}px`,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <h2>{dict.editnode || "Edit Node"}</h2>

      <div className={styles.formContent}>
        <div className={styles.inputGroup}>
          <input
            value={label}
            maxLength={MAX_TITLE}
            className={shakeLabel ? styles.shake : ""}
            onChange={(e) => {
              if (e.target.value.length === MAX_TITLE) {
                setShakeLabel(true);
              }
              setLabel(e.target.value);
            }}
            placeholder={dict.nodelabel || "Node label"}
            autoFocus
          />
          <span className={styles.counter}>
            {label.length}/{MAX_TITLE}
          </span>
        </div>

        <div className={styles.inputGroup}>
          <textarea
            value={desc}
            maxLength={MAX_DESC}
            className={shakeDesc ? styles.shake : ""}
            onChange={(e) => {
              if (e.target.value.length === MAX_DESC) {
                setShakeDesc(true);
              }
              setDesc(e.target.value);
            }}
            placeholder={dict.nodedescription || "Node description"}
          />
          <span className={styles.counter}>
            {desc.length}/{MAX_DESC}
          </span>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          className={`${styles.buttons} ${styles.ghost}`}
          onClick={onClose}
        >
          {dict.cancel || "Cancel"}
        </button>
        <button
          className={`${styles.buttons} ${styles.primary}`}
          disabled={!label.trim() || !isDirty}
          onClick={() =>
            onSave({ label: label.trim(), description: desc.trim() })
          }
        >
          {dict.save || "Save"}
        </button>
      </div>
    </div>
  );
}