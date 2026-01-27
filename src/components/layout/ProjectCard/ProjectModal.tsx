"use client";

import { useEffect, useState } from "react";
import { Project } from "@/utils/types";
import styles from "./projectmodal.module.css";


const MAX_TITLE = 30;
const MAX_DESC = 60;

export default function ProjectModal({
  project,
  onClose,
  onSave,
}: {
  project: Project | null;
  onClose: () => void;
  onSave: (data: { title: string; description: string }) => void;
}) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [shakeTitle, setShakeTitle] = useState(false);
  const [shakeDesc, setShakeDesc] = useState(false);

  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setDesc(project.description);
    } else {
      setTitle("");
      setDesc("");
    }
  }, [project]);

  useEffect(() => {
    if (shakeTitle) setTimeout(() => setShakeTitle(false), 300);
    if (shakeDesc) setTimeout(() => setShakeDesc(false), 300);
  }, [shakeTitle, shakeDesc]);

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>{project ? "Edit project" : "Create project"}</h2>

        
        <input
          value={title}
          maxLength={MAX_TITLE}
          className={shakeTitle ? styles.shake : ""}
          onChange={(e) => {
            if (e.target.value.length === MAX_TITLE) {
              setShakeTitle(true);
            }
            setTitle(e.target.value);
          }}
          placeholder="Project title"
        />
        <span className={styles.counter}>
          {title.length}/{MAX_TITLE}
        </span>

        
        
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
          placeholder="Short description"
        />
        <span className={styles.counter}>
          {desc.length}/{MAX_DESC}
        </span>

        <div className={styles.actions}>
          <button onClick={onClose}>Cancel</button>
          <button
            disabled={!title.trim()}
            onClick={() =>
              onSave({ title: title.trim(), description: desc.trim() })
            }
          >
            {project ? "Save" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}