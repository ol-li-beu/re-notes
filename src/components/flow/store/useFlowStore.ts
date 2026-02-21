import { create } from "zustand";
import {
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
  Connection,
  Edge,
} from "@xyflow/react";

import { createNode, DefaultNodeString } from "./NodeFactory";
import { FlowState, NodeObj, NodeTypes, COLLAPSED_HEIGHT, COLLAPSED_WIDTH, EXPANDED_MIN_WIDTH, EXPANDED_MIN_HEIGHT } from "../types";

export const useFlowStore = create<FlowState>((set, get) => ({
  nodes: [],
  edges: [],

  past: [],
  future: [],

  isBatching: false,

  /* HIstory logging */

  commitHistory: () => {
    const state = get();

    set({
      past: [
        ...state.past,
        {
          nodes: structuredClone(state.nodes),
          edges: structuredClone(state.edges),
        },
      ],
      future: [],
    });
  },

  startBatch: () => {
    const state = get();
    if (state.isBatching) return;

    state.commitHistory();
    set({ isBatching: true });
  },

  endBatch: () => {
    set({ isBatching: false });
  },

  
  draggingNodeId: null,

  setDraggingNodeId: (id) => set({ draggingNodeId: id }),



  undo: () => {
    const { past, nodes, edges, future } = get();
    if (past.length === 0) return;

    const previous = past[past.length - 1];
    if (!previous) return;

    set({
      nodes: structuredClone(previous.nodes),
      edges: structuredClone(previous.edges),
      past: past.slice(0, -1),
      future: [
        {
          nodes: structuredClone(nodes),
          edges: structuredClone(edges),
        },
        ...future,
      ],
    });
  },

  redo: () => {
    const { future, nodes, edges, past } = get();
    if (future.length === 0) return;

    const next = future[0];
    if (!next) return;

    set({
      nodes: structuredClone(next.nodes),
      edges: structuredClone(next.edges),
      future: future.slice(1),
      past: [
        ...past,
        {
          nodes: structuredClone(nodes),
          edges: structuredClone(edges),
        },
      ],
    });
  },


  /* initial load */

  setFlow: (nodes, edges) => {
    set({ nodes, edges });
  },

  /* React flow handlers */

  onNodesChange: (changes: NodeChange<NodeObj>[]) => {
    const state = get();

    const meaningfulChange = changes.some(change => {
      if (change.type === "dimensions") return false;
      if (change.type === "select") return false;
      if (change.type === "position") {
        const prevNode = state.nodes.find(n => n.id === change.id);
        if (
          prevNode &&
          prevNode.position.x === change.position?.x &&
          prevNode.position.y === change.position?.y
        ) {
          return false; // same position, not meaningful
        }
      }
      return true; // all other changes are meaningful
    });

    if (!state.isBatching && meaningfulChange) {
      state.commitHistory();
    }

    const newNodes = applyNodeChanges<NodeObj>(changes, state.nodes);
    set({ nodes: newNodes });


    // Resize goup when children move
    changes.forEach((change) => {
      if (change.type === "position") {
        const movedNode = state.nodes.find((n) => n.id === change.id);
        if (movedNode?.parentId) {
          get().resizeGroupToFitChildren(movedNode.parentId);
        }
      }
    });
  },

  onEdgesChange: (changes: EdgeChange<Edge>[]) => {
    const state = get();

    if (!state.isBatching) {
      state.commitHistory();
    }

    const newEdges = applyEdgeChanges<Edge>(changes, state.edges);
    set({ edges: newEdges });
  },

  onConnect: (connection: Connection) => {
    const state = get();

    if (!state.isBatching) {
      state.commitHistory();
    }

    const newEdge: Edge = {
      ...connection,
      id: crypto.randomUUID(),
      style: {
        stroke: "var(--fg)",
        strokeWidth: 3,
      },
      type: "default",
    };

    set({
      edges: [...state.edges, newEdge],
    });
  },

  /* Operation on nodes */

  addNodeAtPosition: (type, pos, strings) => {
    const state = get();
    if (!state.isBatching) state.commitHistory();

    const newNode = createNode(type, pos, strings);

    set({
      // groups go at start of array, others at end
      nodes: type === "group" 
        ? [newNode, ...state.nodes]
        : [...state.nodes, newNode],
    });
  },

  updateNodeData: (id, type, updates) => {
    const state = get();
    if (!state.isBatching) state.commitHistory();

    const isGroupExpandToggle = type === "group" && "expanded" in updates;
    const isExpanded = isGroupExpandToggle ? (updates.expanded as boolean) : false;

    set((s) => ({
      nodes: s.nodes.map((n) => {
        // update the target node
        if (n.id === id && n.data.type === type) {
    const updatedData = { ...n.data, ...updates };
    const updated = { ...n, data: updatedData };
    if (isGroupExpandToggle) {
      updated.style = isExpanded
        ? { width: updatedData.width ?? 600, height: updatedData.height ?? 500 } 
        : { width: COLLAPSED_WIDTH, height: COLLAPSED_HEIGHT };
    }
    return updated;
  }
      // hide/show children if group expand toggled
      if (isGroupExpandToggle && n.parentId === id) {
        return { ...n, hidden: !isExpanded };
      }
      return n;
    }),
  }));

  // resize parent group if inner node size changed
  if ("expanded" in updates || "width" in updates || "height" in updates) {
    const node = state.nodes.find((n) => n.id === id);
    if (node?.parentId) {
      setTimeout(() => get().resizeGroupToFitChildren(node.parentId!), 0);
    }
  }
},

  /* clipboard feature */

  clipboard: null,

  deleteNode: (id: string) => {
    const state = get();

    if (!state.isBatching) {
      state.commitHistory();
    }

    const newNodes = state.nodes.filter((node) => node.id !== id);
    const newEdges = state.edges.filter(
      (edge) => edge.source !== id && edge.target !== id
    );

    set({
      nodes: newNodes,
      edges: newEdges,
    });
  },

  duplicateNode: (id: string) => {
    const state = get();
    const nodeToDuplicate = state.nodes.find((n) => n.id === id);
    if (!nodeToDuplicate) return;

    if (!state.isBatching) {
      state.commitHistory();
    }

    const newNode: NodeObj = {
      ...structuredClone(nodeToDuplicate),
      id: crypto.randomUUID(),
      position: {
        x: nodeToDuplicate.position.x + 50,
        y: nodeToDuplicate.position.y + 50,
      },
      selected: false,
    };

    set({
      nodes: [...state.nodes, newNode],
    });
  },

  copyNode: (id: string) => {
    const state = get();
    const nodeToCopy = state.nodes.find((n) => n.id === id);
    if (!nodeToCopy) return;

    set({
      clipboard: structuredClone(nodeToCopy),
    });
  },

  cutNode: (id: string) => {
    const state = get();
    state.copyNode(id);
    state.deleteNode(id);
  },

  pasteNode: (position?: { x: number; y: number }) => {
    const state = get();
    if (!state.clipboard) return;

    if (!state.isBatching) {
      state.commitHistory();
    }

    let newPosition: { x: number; y: number };

    if (position) {
      newPosition = position;
    } else {
      const clipboardPosition = state.clipboard.position;

      const existingPastes = state.nodes.filter(
        (node) =>
          Math.abs(node.position.x - clipboardPosition.x) < 200 &&
          Math.abs(node.position.y - clipboardPosition.y) < 200
      );

      const offset = (existingPastes.length + 1) * 50;

      newPosition = {
        x: clipboardPosition.x + offset,
        y: clipboardPosition.y + offset,
      };
    }

    const newNode: NodeObj = {
      ...structuredClone(state.clipboard),
      id: crypto.randomUUID(),
      position: newPosition,
      selected: false,
    };

    set({
      nodes: [...state.nodes, newNode],
    });

    return newNode.id;
  },

  setNodeParent: (nodeId, parentId, position) => {
    const state = get();
    if (!state.isBatching) state.commitHistory();

    const oldParentId = state.nodes.find((n) => n.id === nodeId)?.parentId;

    const TOP_BAR_HEIGHT = 200;
    const PADDING = 60;

  // clamp position to inside the area content
    const clampedPosition = parentId ? {
      x: Math.max(position.x, PADDING),
      y: Math.max(position.y, TOP_BAR_HEIGHT + PADDING),
    } : position;

    const updatedNodes = state.nodes.map((n) =>
      n.id === nodeId
        ? {
            ...n,
            parentId,
            expandParent: false,
            extent: parentId ? ("parent" as const) : undefined,
            position: clampedPosition,
        } : n
    );

    if (parentId) {
      const parentIndex = updatedNodes.findIndex((n) => n.id === parentId);
      const childIndex = updatedNodes.findIndex((n) => n.id === nodeId);
      if (parentIndex > childIndex) {
        const [parent] = updatedNodes.splice(parentIndex, 1);
        if (parent) updatedNodes.splice(childIndex, 0, parent);
      }
    }

    set({ nodes: updatedNodes });

    setTimeout(() => {
      if (parentId) get().resizeGroupToFitChildren(parentId);
      if (oldParentId) get().resizeGroupToFitChildren(oldParentId);
    }, 0);
  },

  resizeGroupToFitChildren: (groupId) => {
    const state = get();
    const children = state.nodes.filter(
      (n) => n.parentId === groupId && !n.hidden
    );
  
    if (children.length === 0) {
      set((s) => ({
        nodes: s.nodes.map((n) =>
          n.id === groupId
            ? {
                ...n,
                style: { width: 600, height: 500 },
                data: { ...n.data, width: 600, height: 500 },
              }
            : n
        ),
      }));
      return;
    }

    const PADDING = 60;
    const TOP_BAR_HEIGHT = 220;

    const minX = Math.min(...children.map((n) => n.position.x));
    const minY = Math.min(...children.map((n) => n.position.y));

    const maxX = Math.max(
      ...children.map((n) => {
        const w = n.data.expanded ? (n.data.width ?? EXPANDED_MIN_WIDTH) : COLLAPSED_WIDTH;
        return n.position.x + w;
      })
    );
    const maxY = Math.max(
      ...children.map((n) => {
        const h = n.data.expanded ? (n.data.height ?? EXPANDED_MIN_HEIGHT) : COLLAPSED_HEIGHT;
        return n.position.y + h;
      })
    );

    const shiftX = minX < PADDING ? PADDING - minX : 0;
    const shiftY = minY < TOP_BAR_HEIGHT + PADDING ? (TOP_BAR_HEIGHT + PADDING) - minY : 0;

    set((s) => ({
      nodes: s.nodes.map((n) => {
        if (n.id === groupId) {
          const newWidth = Math.max(maxX + shiftX + PADDING, EXPANDED_MIN_WIDTH);
          const newHeight = Math.max(maxY + shiftY + PADDING, EXPANDED_MIN_HEIGHT);
          return {
            ...n,
            style: { width: newWidth, height: newHeight },
            data: { ...n.data, width: newWidth, height: newHeight },
          };
        }
        if (n.parentId === groupId && (shiftX > 0 || shiftY > 0)) {
          return {
            ...n,
            position: {
              x: n.position.x + shiftX,
              y: n.position.y + shiftY,
            },
          };
        }
        return n;
      }),
    }));
  },

}));
