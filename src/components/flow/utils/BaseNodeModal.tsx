"use client";

import { useEffect, useState, useRef } from "react";
import { Project } from "@/utils/types";
import styles from "./basenodemodal.module.css";


const MAX_TITLE = 30;
const MAX_DESC = 120;

export default function ProjectModal({project ,onClose, onSave, dict}: {project: Project | null; onClose: () => void; 
  onSave: (data: { title: string; description: string }) => void; dict: any;}, ) {

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [shakeTitle, setShakeTitle] = useState(false);
  const [shakeDesc, setShakeDesc] = useState(false);
  const initial = useRef<{ title: string; desc: string }>({ title: "", desc: "", });

  // edit or new
  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setDesc(project.description);
      initial.current = {
        title: project.title,
        desc: project.description,
      };
    } else {
      setTitle("");
      setDesc("");
        initial.current = {
        title: "",
        desc: "",
      };
    }
  }, [project]);

  const isDirty = title.trim() !== initial.current.title || desc.trim() !== initial.current.desc;


  useEffect(() => {
    if (shakeTitle) setTimeout(() => setShakeTitle(false), 300);
    if (shakeDesc) setTimeout(() => setShakeDesc(false), 300);
  }, [shakeTitle, shakeDesc]);



  // BCK Functiones para guardar ediciones y eliminaciones de proyectos

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>{project ? dict.editproject : dict.createproject}</h2>

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
          placeholder={dict.projecttitle}
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
          placeholder={dict.projectdescription}
        />
        <span className={styles.counter}>
          {desc.length}/{MAX_DESC}
        </span>

        <div className={styles.actions}>
          <button className={`${styles.buttons} ${styles.ghost}`} onClick={onClose}> {dict.cancel} </button>
          <button className={`${styles.buttons} ${styles.primary}`} 
            disabled={!title.trim() || (!!project && !isDirty)} // !! force boolean
            onClick={() =>
              onSave({ title: title.trim(), description: desc.trim() })
            }
          >
            {project ? dict.save : dict.create}
          </button>
        </div>
      </div>
    </div>
  );
}