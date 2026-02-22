// zustand store for project home page (graph)

import { create } from "zustand";
import { ProjectState, CanvasMeta, CanvasLink, CanvasStatus } from "../types";
import { useFlowStore } from "./useFlowStore";

export const useProjectStore = create<ProjectState>((set, get) => ({
  projectId: null,
  projectName: "",
  rootCanvasId: null,
  canvases: [],
  links: [],

  initProject: (projectId, projectName, rootCanvasId, canvases, links) => {
    set({ projectId, projectName, rootCanvasId, canvases, links });
  },

  addCanvas: (name, positionX = 0, positionY = 0) => {
    const id = crypto.randomUUID();
    const { projectId } = get();
    if (!projectId) throw new Error("No project loaded");

    const newCanvas: CanvasMeta = {
      id,
      projectId,
      name,
      positionX,
      positionY,
    };

    set((state) => ({ canvases: [...state.canvases, newCanvas] }));
    return id;
  },

  deleteCanvas: (id) => {
  // set statate so that no history spammed
   useFlowStore.setState((flowState) => ({
     nodes: flowState.nodes.map((node) => {
       if (node.data.type === "subnode" && node.data.targetCanvasId === id) {
        return {
          ...node,
          data: {
            ...node.data,
            targetCanvasId: null,
            targetCanvasName: null,
            linkId: null,
          },
        };
      }
      return node;
     }),
   }));

   set((state) => ({
     canvases: state.canvases.filter((c) => c.id !== id),
     links: state.links.filter(
       (l) => l.fromCanvasId !== id && l.toCanvasId !== id
     ),
   }));
   },

  renameCanvas: (id, name) => {
    const { canvases } = get();
    const exists = canvases.some(
      (c) => c.id !== id && c.name.toLowerCase() === name.toLowerCase()
    );
    if (exists) return false;

    const flowNodes = useFlowStore.getState().nodes;
    flowNodes.forEach((node) => {
      if (node.data.type === "subnode" && node.data.targetCanvasId === id) {
        useFlowStore.getState().updateNodeData(node.id, "subnode", {
          targetCanvasName: name,
        });
      }
      
    });

    set((state) => ({
      canvases: state.canvases.map((c) =>
        c.id === id ? { ...c, name } : c
      ),
    }));

    return true;

  },

  updateCanvasPosition: (id, x, y) => {
  set((state) => ({
    canvases: state.canvases.map((c) =>
      c.id === id ? { ...c, positionX: x, positionY: y } : c
    ),
  }));
  },

  addLink: (fromCanvasId, toCanvasId) => {
    const id = crypto.randomUUID();
    const { projectId } = get();
    if (!projectId) throw new Error("No project loaded");

    const newLink: CanvasLink = {
      id,
      projectId,
      fromCanvasId,
      toCanvasId,
    };

    set((state) => ({ links: [...state.links, newLink] }));
    return id;
  },

  removeLink: (linkId) => {
    set((state) => ({
      links: state.links.filter((l) => l.id !== linkId),
    }));
  },

  removeLinksByCanvas: (canvasId) => {
    set((state) => ({
      links: state.links.filter(
        (l) => l.fromCanvasId !== canvasId && l.toCanvasId !== canvasId
      ),
    }));
  },

  getStatus: (canvasId): CanvasStatus => {
    const { rootCanvasId, links } = get();
    if (canvasId === rootCanvasId) return "root";
    const hasIncoming = links.some((l) => l.toCanvasId === canvasId);
    return hasIncoming ? "linked" : "orphan";
  },

  getCanvasStats: (canvasId) => {
    const { links } = get();
    // nodeCount requires knowing which canvas is currently loaded in flowStore
    const flowState = useFlowStore.getState();
    const nodeCount = flowState.nodes.length; // accurate if only canvas is load

    return {
      nodeCount,
      incomingCount: links.filter((l) => l.toCanvasId === canvasId).length,
      outgoingCount: links.filter((l) => l.fromCanvasId === canvasId).length,
    };
  },
}));