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
import { FlowState, NodeObj, NodeTypes } from "../types";

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

    const meaningfulChange = changes.some(change => { // in the cases of select or jitter moves
      if (change.type === "position") {
      const prevNode = state.nodes.find(n => n.id === change.id);
      if (
        prevNode &&
        prevNode.position.x === change.position?.x &&
        prevNode.position.y === change.position?.y
        ) {
        return false;
        }
      } 
      });

      if (!state.isBatching && meaningfulChange) {
        state.commitHistory();
      }

      const newNodes = applyNodeChanges<NodeObj>(changes, state.nodes);
      set({ nodes: newNodes });
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

  addNodeAtPosition: (
    type: NodeTypes,
    pos: { x: number; y: number },
    strings: DefaultNodeString
  ) => {
    const state = get();

    if (!state.isBatching) {
      state.commitHistory();
    }

    const newNode = createNode(type, pos, strings);

    set({
      nodes: [...state.nodes, newNode],
    });
  },

  updateNodeData: (id, type, updates) => {
    const state = get();

    if (!state.isBatching) {
      state.commitHistory();
    }

    const newNodes = state.nodes.map((node) => {
      if (node.id !== id) return node;
      if (node.data.type !== type) return node;

      return {
        ...node,
        data: {
          ...node.data,
          ...updates,
        },
      };
    });

    set({ nodes: newNodes });
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
}));
