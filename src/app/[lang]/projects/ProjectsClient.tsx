"use client";

import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";

import ProjectCard from "@/components/layout/ProjectCard/ProjectCard";
import SpecialProjectCard from "@/components/layout/ProjectCard/SpecialProjectCard";
import ProjectModal from "@/components/layout/ProjectCard/ProjectModal";
import SearchController from "@/components/ui/SearchBar/SearchBarController";
import ConfirmModal from "@/components/ui/ConfirmModal/ConfirmModal";
import Spinner from "@/components/ui/Spinner/Spinner";
import { Project } from "@/utils/types";

import { ToastContext } from "@/hooks/ToastContext";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

import styles from "./projects.module.css";
import { resumeToPipeableStream } from "react-dom/server";

interface ProjectsProp {
  lang: string;
  dict: any;
  initialProjects: Project[];
}

export default function ProjectsClient({lang, dict, initialProjects, }: ProjectsProp) {

  const router = useRouter();
  const { showToast } = useContext(ToastContext)!;
  

  const [projects, setProjects] = useState(initialProjects); // BCK cambiar a [] y eliminar initial projects como prop y en interfa<
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Project | null>(null);

  // close on outside click
  useEffect(() => {
    const close = () => setOpenMenuId(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  useLockBodyScroll(modalOpen);
  useLockBodyScroll(!!toDelete);

  // BCK GETTING PROJECTS
  // usar este formato 
  /* 
  useEffect(() => {
  setLoading(true);

  fetch  => {
    // const data = (function get projecto en base al usuario en sesion)
    setProjects(data);
    setLoading(false);
  });
  }, []); */


  const handleCreateProject = async (data: Partial<Project>) => { // Partial Just in Case need to add stuff like last updated or perms
    //setLoading(true);?

    //const result = await backend

    //setLoading(false);??
    /*
    if (result.error) {
      showToast(result.error, "error");
      return;
    } */

    //setProjects((ps) => [...ps, result.project]); // sets project and gives me back, truth in server
    showToast(dict.projectcreated, "success");
  };

  const handleEditProject = async (
    projectId: string,
    data: Partial<Project>) => {

    // set loading?
    //const result = await backend(projectId, data);

   

    /*if (result.error) {
      showToast(result.error, "error");
      return;
    }  */
    
    /*
    setProjects((ps) =>
      ps.map((p) =>
        p.id === projectId ? { ...p, ...result.project } : p
      )
    ); */

    showToast(dict.projectupdated, "success");
  };  



  
  const handleMoveToTrash = async () => {
    if (!toDelete) return;

  
  //const { result } await backend(toDelete)
    
  /*
  if (result.error) {
    showToast(result.error, "error");
    return;
  } */


    setProjects((ps) => ps.filter((p) => p.id !== toDelete.id));

 
    setToDelete(null);
    showToast("Project deleted", "success");
};

  
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
        project.title.toLowerCase().includes(query.toLowerCase()) ||
        project.description.toLowerCase().includes(query.toLowerCase())
      }
    >
      {(filteredProjects) => (
        <div className={styles.wrapper}>
          <div className={styles.grid}>

            <SpecialProjectCard
              title={dict.createproject}
              onClick={() => {
                setEditing(null);
                setModalOpen(true);
              }}
              iconName="create"/>

          
            {filteredProjects.map((p) => ( // TODO ORDER BY UPDATE TIME
              <ProjectCard
                key={p.id}
                project={p}
                lang={lang}
                mode="normal"
                dict={dict}
                isMenuOpen={openMenuId === p.id}
                onToggleMenu={() =>
                  setOpenMenuId((prev) =>
                    prev === p.id ? null : p.id
                  )
                }
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

      {/* MODAL */}
      {modalOpen && (
        <ProjectModal
          dict={dict}
          project={editing}
          onClose={() => setModalOpen(false)}
          onSave={(data) => {
            if (editing) {
              handleEditProject(editing.id, data);
            } else {
              handleCreateProject(data);
            }
            setModalOpen(false);
            }}
        />
      )}

      {/* CONFIRM DELETE */}
      {toDelete && (
        <ConfirmModal
          title={dict.confirmdelete ?? "Delete project?"}
          description={
            dict.descriptiondelete ??
            "You can restore it later from trash."}
          btncancel={dict.btncanceldelete}
          btnconfirm={dict.btnconfirmdelete}
          onCancel={() => setToDelete(null)}
          onConfirm={handleMoveToTrash}
        />
      )}
    </>
  );
}