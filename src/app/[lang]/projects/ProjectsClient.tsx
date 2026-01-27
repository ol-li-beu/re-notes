"use client";

import { useState, useContext } from "react";
import ProjectCard from "@/components/layout/ProjectCard/ProjectCard";
import CreateProjectCard from "@/components/layout/ProjectCard/CreateProjectCard";
import ProjectModal from "@/components/layout/ProjectCard/ProjectModal";
import SearchController from "@/components/ui/SearchBar/SearchBarController";
import { Project } from "@/utils/types";
import { ToastContext } from "@/hooks/ToastContext";
import styles from "./projects.module.css";

interface ProjectsProp {
  lang: string;
  dict: any;
  initialProjects: Project[];
}

export default function ProjectsClient({
  lang,
  dict,
  initialProjects,
}: ProjectsProp) {
  const { showToast } = useContext(ToastContext)!;

  const [projects, setProjects] = useState(initialProjects);
  const [editing, setEditing] = useState<Project | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <SearchController
        items={projects}
        placeholder="Search projects..."
        filterFn={(project, query) =>
          project.title.toLowerCase().includes(query.toLowerCase()) ||
          project.description.toLowerCase().includes(query.toLowerCase())
        }
      >
        {(filteredProjects) => (
        <div className={styles.wrapper}>
          <div className={styles.grid}>
            {filteredProjects.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                onEdit={(project) => {
                  setEditing(project);
                  setModalOpen(true);
                }}
                onDelete={(project) => {
                  setProjects((ps) =>
                    ps.filter((x) => x.id !== project.id)
                  );
                  showToast("Project deleted", "success");
                }}
                lang={lang}
              />
            ))}

            {/* Create card is not filtered */}
            <CreateProjectCard
              onCreate={() => {
                setEditing(null);
                setModalOpen(true);
              }}
            />
          </div>
          </div>
        )}
      </SearchController>

      {modalOpen && (
        <ProjectModal
          project={editing}
          onClose={() => setModalOpen(false)}
          onSave={(data) => {
            if (editing) {
              setProjects((ps) =>
                ps.map((p) =>
                  p.id === editing.id ? { ...p, ...data } : p
                )
              );
              showToast("Project updated", "success");
            } else {
              setProjects((ps) => [
                ...ps,
                { id: crypto.randomUUID(), ...data },
              ]);
              showToast("Project created", "success");
            }
            setModalOpen(false);
          }}
        />
      )}
    </>
  );
}