"use client";

import { useState, useContext, useEffect } from "react";
import ProjectCard from "@/components/layout/ProjectCard/ProjectCard";
import SearchController from "@/components/ui/SearchBar/SearchBarController";
import ConfirmModal from "@/components/ui/ConfirmModal/ConfirmModal";
import { Project } from "@/utils/types";
import { ToastContext } from "@/hooks/ToastContext";
import Spinner from "@/components/ui/Spinner/Spinner";
import EmptyState from "@/components/ui/EmptyState/EmptyState";
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

  if (loading) {
    return (
      <div className={styles.center}>
        <Spinner />
      </div>
    );
  }

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
                  onRestore={(p) => {
                    setProjects((ps) => ps.filter((x) => x.id !== p.id));
                    showToast(dict.projectrestored, "success");
                  }}
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
          onConfirm={() => {
            if (deleting || cooldown > 0) return;

            setDeleting(true);
            setProjects((ps) => ps.filter((x) => x.id !== confirmDelete.id));
            showToast(dict.permadelete, "error");
            setConfirmDelete(null);
            setDeleting(false);
          }}
          disabled={deleting || cooldown > 0} 
        />
      )}
    </>
  );
}