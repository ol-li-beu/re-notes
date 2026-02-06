"use client";

import { useState, useContext, useEffect } from "react";


import ProjectCard from "@/components/layout/ProjectCard/ProjectCard";
import SearchController from "@/components/ui/SearchBar/SearchBarController";
import ConfirmModal from "@/components/ui/ConfirmModal/ConfirmModal";
import { Project } from "@/utils/types";
import Spinner from "@/components/ui/Spinner/Spinner";
import EmptyState from "@/components/ui/EmptyState/EmptyState";

import { ToastContext } from "@/hooks/ToastContext";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll"; 


import styles from "@/app/[lang]/projects/projects.module.css";

interface RecycledBinProps {
  dict: any;
  initialProjects: Project[];
}

export default function RecycledBinClient({ dict, initialProjects }: RecycledBinProps) {
  const { showToast } = useContext(ToastContext)!;

  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [confirmDelete, setConfirmDelete] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);

  const [deleting, setDeleting] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useLockBodyScroll(!!confirmDelete);

  // TODO SUPABSE HANDLERS need return obj { result or success? same pattern? }
  // PROJECT SOFT DELETE?

  const handleRestore = async (project : Project) => {
    //const result = await SiBackendless(project.id);

    /*
     if (result.error) {
      showToast(result.error, "error");
      return;   }
    */
      setProjects((ps) => ps.filter((x) => x.id !== project.id));
      showToast(dict.projectrestored, "success");
      //showToast(result.success!, "success");
  }

  const handlePermanentDelete = async () => {
    if (!confirmDelete || deleting || cooldown > 0) return;

    setDeleting(true); // here 30s cooldown occurs
    /*
    const result: ActionResult = await backend(confirmDelete.id);
    */
    setDeleting(false);
    /*
    if (result.error) {
      showToast(result.error, "error");
      return;
    } */

    setProjects((ps) => ps.filter((x) => x.id !== confirmDelete.id));
    //showToast(result.success!, "error"); // destructive success
    showToast(dict.permadelete, "error");
    setConfirmDelete(null);
  };


  // interval when open modal
  useEffect(() => {
    if (!confirmDelete) return;

    setCooldown(5); // 5-second cooldown

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

  

  // Projects Fetching time, state loading
  if (loading) {
    return (
      <div className={styles.center}>
        <Spinner />
      </div>
    );
  }

  // No Projects Found
  if (projects.length === 0) {
    return (
      <div className={styles.center}>
        <EmptyState title={dict.empty} />
      </div>
    );
  }

  return (
    <>
      <SearchController
        items={projects}
        placeholder={dict.searchbar ?? "Search ..."}
        filterFn={(project, query) =>
          project.title.toLowerCase().includes(query.toLowerCase()) ||
          project.description.toLowerCase().includes(query.toLowerCase())
        }
      >
        {(filteredProjects) => (
          <div className={styles.wrapper}>
            <div className={styles.grid}>
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  mode="trash"
                  dict={dict}
                  onRestore={handleRestore}
                  onPermanentDelete={(p) => setConfirmDelete(p)}
                />
              ))}
            </div>
          </div>
        )}
      </SearchController>

      {confirmDelete && (
        <ConfirmModal
          title={dict.confirmdelete ?? "Delete forever?"}
          description={dict.descriptiondelete ?? "This action cannot be undone."}
          btncancel={dict.btncanceldelete}
          btnconfirm={cooldown > 0 ? `${dict.deletein ?? "Delete in"} ${cooldown}s` : dict.btnconfirmdelete}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={handlePermanentDelete}
          disabled={deleting || cooldown > 0} 
        />
      )}
    </>
  );
}