"use client";

import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";

import Link from "next/link";
import ProjectCard from "@/components/layout/ProjectCard/ProjectCard";
import SpecialProjectCard from "@/components/layout/ProjectCard/SpecialProjectCard";
import ProjectModal from "@/components/layout/ProjectCard/ProjectModal";
import SearchController from "@/components/ui/SearchBar/SearchBarController";
import ConfirmModal from "@/components/ui/ConfirmModal/ConfirmModal";
import Spinner from "@/components/ui/Spinner/Spinner";

import { Project } from "@/utils/types";
import { ToastContext } from "@/hooks/ToastContext";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
// 1. IMPORTAR LAS ACCIONES REALES
import { createProject, updateProject, softDeleteProject } from "@/utils/project-actions";

import styles from "./projects.module.css";

interface ProjectsProp {
  lang: string;
  dict: any;
  initialProjects: Project[];
}

export default function ProjectsClient({ lang, dict, initialProjects }: ProjectsProp) {
  const router = useRouter();
  const { showToast } = useContext(ToastContext)!;

  // Usamos initialProjects directamente. Cuando router.refresh() ocurra, 
  // este componente se volverá a renderizar con los datos nuevos.
  const [projects, setProjects] = useState(initialProjects); 
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Project | null>(null);

  // Sincronizar estado local si initialProjects cambia (por router.refresh)
  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const close = () => setOpenMenuId(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  useLockBodyScroll(modalOpen);
  useLockBodyScroll(!!toDelete);

  if (loading) {
    return (
      <div className={styles.loading}>
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div className={styles.header}>
        {/* SEARCH */}
        <div className={styles.search}>
          <SearchController
            items={projects}
            placeholder={dict.searchbar ?? "Search"}
            filterFn={(project, query) =>
              (project.title?.toLowerCase().includes(query.toLowerCase()) || false) ||
              (project.description?.toLowerCase().includes(query.toLowerCase()) || false)
            }
          >
            {(filteredProjects) => (
              <div className={styles.wrapper}>
                <div className={styles.grid}>
                  
                  {/* BOTÓN CREAR */}
                  <SpecialProjectCard
                    title={dict.createproject}
                    onClick={() => {
                      setEditing(null);
                      setModalOpen(true);
                    }}
                    iconName="create"
                  />

                  {/* LISTA DE PROYECTOS */}
                  {filteredProjects.map((p) => (
                      <ProjectCard
                        key={p.id} 
                        project={p}
                        lang={lang}
                        mode="normal"
                        dict={dict}
                        isMenuOpen={openMenuId === p.id}

                        onToggleMenu={() => {
                          setOpenMenuId((prev) => (prev === p.id ? null : p.id))
                        }}

                        onCloseMenu={() => setOpenMenuId(null)}

                        onEdit={(project) => {
                          setOpenMenuId(null);
                          setEditing(project);
                          setModalOpen(true);
                        }}

                        onDelete={(project) => {
                          setOpenMenuId(null);
                          setToDelete(project);
                        }}
                      />
                  ))}

                  {/* BOTÓN PAPELERA */}
                  <SpecialProjectCard
                    title={dict.trashproject}
                    onClick={() => router.push(`/${lang}/projects/recycled-bin`)}
                    iconName="trash"
                  />
                </div>
              </div>
            )}
          </SearchController>
        </div>
      </div>

      {/* MODAL CREAR / EDITAR */}
      {modalOpen && (
        <ProjectModal
          dict={dict}
          project={editing}
          onClose={() => setModalOpen(false)}
          onSave={async (data) => {
            // CASO 1: EDITAR
            if (editing) {
              // Optimistic UI: Actualizar visualmente rápido
              setProjects((ps) =>
                ps.map((p) => (p.id === editing.id ? { ...p, ...data } : p))
              );
              
              // Llamada al servidor
              const res = await updateProject(lang, editing.id, {
                  title: data.title,
                  description: data.description
              });

              if (res?.error) {
                  showToast(dict.error ?? "Error updating", "error");
                  router.refresh(); // Revertir si falla
              } else {
                  showToast(dict.projectupdated, "success");
                  router.refresh(); // Asegurar datos frescos
              }

            // CASO 2: CREAR
            } else {
              // Llamada al servidor primero (necesitamos ID real)
              const res = await createProject(lang, {
                  title: data.title,
                  description: data.description
              });

              if (res?.error) {
                   showToast(dict.error ?? "Error creating", "error");
              } else {
                   showToast(dict.projectcreated, "success");
                   setModalOpen(false); // Cerramos modal
                   router.refresh();    // Recargamos para ver el nuevo proyecto
              }
            }
            setModalOpen(false);
          }}
        />
      )}

      {/* MODAL CONFIRMAR BORRADO */}
      {toDelete && (
        <ConfirmModal
          title={dict.confirmdelete ?? "Delete project?"}
          description={dict.descriptiondelete ?? "You can restore it later from trash."}
          btncancel={dict.btncanceldelete}
          btnconfirm={dict.btnconfirmdelete}
          onCancel={() => setToDelete(null)}
          onConfirm={async () => {
            if (!toDelete) return;

            // Optimistic UI
            setProjects((ps) => ps.filter((x) => x.id !== toDelete.id));
            
            // Llamada al servidor
            const res = await softDeleteProject(lang, toDelete.id);

            if (res?.error) {
                 showToast("Error deleting project", "error");
                 router.refresh();
            } else {
                 showToast(dict.movedtrash, "success"); // Cambié a success/verde
                 router.refresh();
            }
            setToDelete(null);
          }}
        />
      )}
    </>
  );
}