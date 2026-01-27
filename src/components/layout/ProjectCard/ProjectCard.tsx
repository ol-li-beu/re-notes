"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Project } from "@/utils/types";
import { TrashButton } from "@/components/ui/TrashButton/TrashButton";
import styles from "./projectcard.module.css";


type Props = {
  project: Project;
  onEdit: (p: Project) => void;
  onDelete: (p: Project) => void;
  lang: string;
};

export default function ProjectCard({ project, onEdit, onDelete, lang }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  return (
    <div
      className={styles.card}
      onClick={() => router.push(`/${lang}/canvas/${project.id}`)}
    >
      <div className={styles.top}>
        <h3 className={styles.title}>{project.title}</h3>

        <div
          ref={ref}
          className={styles.menuWrap}
          onClick={e => e.stopPropagation()}
        >
          <button
            className={styles.menuBtn}
            onClick={() => setOpen(v => !v)}>
            ⋯
          </button>

          {open && (
            <div className={styles.dropdown}>
              <button onClick={() => onEdit(project)}>Edit</button>
              <button
                className={styles.danger}
                onClick={() => onDelete(project)}
              >
                <TrashButton></TrashButton>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <p className={styles.description}>{project.description}</p>
    </div>
  );
}