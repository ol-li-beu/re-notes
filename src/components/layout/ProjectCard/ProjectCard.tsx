"use client";

import { useRouter } from "next/navigation";
import { Project } from "@/utils/types";
import { TrashButton } from "@/components/ui/TrashButton/TrashButton";
import RefreshButton from "@/components/ui/RefreshButton/RefreshButton";
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

  const router = useRouter();

  return (
    <div
      className={styles.card}
      onClick={() => {
        if (mode === "normal" && lang) {
          router.push(`/${lang}/canvas/${project.id}`);
        }
      }}
    >
      {/* Header Section*/}
      <div className={styles.top}>
        <h3 className={styles.title}>{project.title}</h3>

        {mode === "normal" && (
          <div
            className={styles.menuWrap}
            onClick={(e) => e.stopPropagation()}
          >

            {/* Action Menu: Only visible in 'normal' mode */}
            <button
              className={styles.menuBtn}
              onClick={onToggleMenu}
              aria-expanded={isMenuOpen}
            >
              ⋯
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className={styles.dropdown}>
                <button
                  onClick={() => {
                    onCloseMenu?.();
                    onEdit?.(project);
                  }}>
                  {dict.edit}
                </button>

                <button
                  className={styles.danger}
                  onClick={() => {
                    onCloseMenu?.();
                    onDelete?.(project);
                  }}>
                  <TrashButton />
                  {dict.delete}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Content: Project Description */}
      <p className={styles.description}>{project.description}</p>
      
      {/* Recyclebin Actions */}
      {mode === "trash" && (
        <div className={styles.trashActions}>
          <button onClick={() => onRestore?.(project)}>
            <RefreshButton />
            {dict.restore}
          </button>

          <button
            className={styles.danger}
            onClick={() => onPermanentDelete?.(project)}
          >
            <TrashButton />
            {dict.deleteforever}
          </button>
        </div>
      )}
    </div>
  );
}