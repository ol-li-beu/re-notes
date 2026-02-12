"use client";

import Link from "next/link";

import { Project } from "@/utils/types";
import { Icon } from "@/components/ui/Icons/Icons";

import styles from "./projectcard.module.css";

type CardMode = "normal" | "trash";

type Props = {
  project: Project;
  lang?: string;
  mode?: CardMode;
  isMenuOpen?: boolean;
  onToggleMenu?: () => void;
  onCloseMenu?: () => void;
  onEdit?: (p: Project) => void;
  onDelete?: (p: Project) => void;
  onRestore?: (p: Project) => void;
  onPermanentDelete?: (p: Project) => void;
  dict: any;
};

export default function ProjectCard({project, lang, mode = "normal", isMenuOpen, 
  onToggleMenu, onCloseMenu, onEdit, onDelete, onRestore, onPermanentDelete, dict,}: Props) {
  

  return (
    <div
      className={styles.card}
    >
      {/* Header Section*/}
      <div className={styles.top}>

        <h3 className={styles.title}>
        {project.title}
        </h3>

        {mode === "normal" && (
          <div
            className={styles.menuWrap}
          >

            {/* Action Menu: Only visible in 'normal' mode */}
            <button
              className={`circle-fill ${styles.menuBtn}`} 
              onClick={(e) => {
                e.stopPropagation();   
                onToggleMenu?.();
              }}
            >
              <Icon name="ellipsisvertical" />
              
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className={styles.dropdown}>
                <button
                  onClick={() => {  
                    onCloseMenu?.();
                    onEdit?.(project);
                  }}>
                  <Icon name="edit" />
                  {dict.edit}
                </button>

                <button
                  className={styles.danger}
                  onClick={() => {
                    onCloseMenu?.();
                    onDelete?.(project);
                  }}>
                  <Icon name="trash" />
                  {dict.delete}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Content: Project Description */}
      <p className={styles.description}>{project.description}</p>
      
      {/* Go to project clickable area */}
      {mode === "normal" && lang && (
      <Link
        href={`/${lang}/canvas/${project.id}`}
        className={styles.openLink}
      >
        <Icon name="arrowright" /> {dict.gotoproject} 
      </Link>
      )}
      
      {/* Recyclebin Actions */}
      {mode === "trash" && (
        <div className={styles.trashActions}>
          <button onClick={() => { onRestore?.(project);}}>
            <Icon name="undo" />
            {dict.restore}
          </button>

          <button
            className={styles.danger}
            onClick={() => { onPermanentDelete?.(project);}}
          >
            <Icon name="trash" />
            {dict.deleteforever}
          </button>
        </div>
      )}
    </div>
  );
}