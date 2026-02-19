"use client";

import { useLayoutEffect } from "react";
import { useProjectStore } from "./useProjectStore";
import { CanvasMeta, CanvasLink } from "../types";

export default function ProjectStoreInitializer({ projectId, projectName, rootCanvasId, canvases, links, }: {
  projectId: string;
  projectName: string;
  rootCanvasId: string;
  canvases: CanvasMeta[];
  links: CanvasLink[]; }) {

  useLayoutEffect(() => {
    useProjectStore.getState().initProject(
      projectId, projectName, rootCanvasId, canvases, links
    );
  }, []);

  return null;
}