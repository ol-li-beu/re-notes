"use client";

import { useState, useContext, useEffect } from "react";
import ProjectCard from "@/components/layout/ProjectCard/ProjectCard";
import SearchController from "@/components/ui/SearchBar/SearchBarController";
import ConfirmModal from "@/components/ui/ConfirmModal/ConfirmModal";
import { Project } from "@/utils/types";
import { ToastContext } from "@/hooks/ToastContext";
import EmptyState from "@/components/ui/EmptyState/EmptyState";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

import styles from "@/app/[lang]/projects/projects.module.css";
// 1. IMPORTAR LAS ACCIONES REALES
import { restoreProject, deleteProjectForever } from "@/utils/project-actions";
import { useRouter } from "next/navigation";

interface RecycledBinProps {
  dict: any;
  initialProjects: Project[];
  lang: string; // 2. AGREGAR LANG AQUÍ
}

export default function RecycledBinClient({ dict, initialProjects, lang }: RecycledBinProps) {
  const { showToast } = useContext(ToastContext)!;
  const router = useRouter(); // Para refrescar datos

  // Sincronizar estado inicial (importante para que se actualice tras un refresh)
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  const [confirmDelete, setConfirmDelete] = useState<Project | null>(null);

  const [deleting, setDeleting] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const [restoringId, setRestoringId] = useState<string | null>(null);

  // Intervalo de seguridad para borrar
  useEffect(() => {
    if (!confirmDelete) return;
    setCooldown(5); 
    const timer = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [confirmDelete]);

 
  useLockBodyScroll(!!confirmDelete);


  if (projects.length === 0) {
    return (
      <div className={styles.center}>
        <EmptyState title={dict.empty || "Papelera vacía"} />
      </div>
    );
  }

  return (
    <>
      <SearchController
        items={projects}
        placeholder={dict.searchbar ?? "Search ..."}
        filterFn={(project, query) =>
          (project.title?.toLowerCase().includes(query.toLowerCase()) || false) ||
          (project.description?.toLowerCase().includes(query.toLowerCase()) || false)
        }
      >
        {(filteredProjects) => (
          <div className={styles.wrapper}>
            <div className={styles.grid}>
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  mode="trash" // Esto activa los botones de Restore/Delete
                  dict={dict}
                  
                  // 3. LOGICA DE RESTAURAR CONECTADA
                  onRestore={async (p) => {
                    setRestoringId(p.id);
                    setProjects((ps) => ps.filter((x) => x.id !== p.id));
                    
                    // Server Action
                    const res = await restoreProject(lang, p.id);
                    setRestoringId(null);
                    
                    if (res?.error) {
                        showToast("Error restoring", "error");
                        router.refresh(); // Si falla, que vuelva a aparecer
                    } else {
                        showToast(dict.projectrestored, "success");
                        router.refresh(); // Para asegurar consistencia
                    }
                  }}
                  
                  onPermanentDelete={(p) => setConfirmDelete(p)}

                  isRestoring={restoringId === project.id}
                />
              ))}
            </div>
          </div>
        )}
      </SearchController>

      {/* MODAL DE BORRADO DEFINITIVO */}
      {confirmDelete && (
        <ConfirmModal
          title={dict.confirmdelete ?? "Delete forever?"}
          description={dict.descriptiondelete ?? "This action cannot be undone."}
          btncancel={dict.btncanceldelete}
          btnconfirm={cooldown > 0 ? `${dict.deletein ?? "Delete in"} ${cooldown}s` : dict.btnconfirmdelete}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={async () => {
            if (deleting || cooldown > 0) return;

            setDeleting(true);
            
            // Optimistic UI
            setProjects((ps) => ps.filter((x) => x.id !== confirmDelete.id));
            
            // Server Action (DELETE REAL)
            const res = await deleteProjectForever(lang, confirmDelete.id);

            if (res?.error) {
                 showToast("Error deleting", "error");
                 router.refresh(); 
            } else {
                 showToast(dict.permadelete, "error"); // Mensaje rojo de "Borrado para siempre"
                 router.refresh();
            }

            setConfirmDelete(null);
            setDeleting(false);
          }}
          disabled={deleting || cooldown > 0} 
        />
      )}
    </>
  );
}