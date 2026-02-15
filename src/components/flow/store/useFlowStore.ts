import { create } from "zustand";
import { applyNodeChanges, applyEdgeChanges, addEdge, NodeChange, EdgeChange, Connection, Edge,
} from "@xyflow/react";

import { createNode, DefaultNodeString } from "./NodeFactory";
import { FlowState, NodeObj } from "../types";
import { NodeData, NodeTypes } from "../types";



export const useFlowStore = create<FlowState>((set, get) => ({
  nodes: [],
  edges: [],

  past: [],
  future: [],

  isBatching: false,

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

    state.commitHistory(); // snapshot before the batches
    set({ isBatching: true });
  },

  endBatch: () => {
    set({ isBatching: false });
  },

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


  setFlow: (nodes, edges) => {
    const state = get();

    if (!state.isBatching) {
      state.commitHistory();
    }

    set({ nodes, edges });
  },

  // REACT flow handlers

  onNodesChange: (changes: NodeChange<NodeObj>[]) => {
    const state = get();

    if (!state.isBatching) {
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

    const newEdge = {
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


  // Node operations

  addNodeAtPosition: (
    type: NodeTypes,
    pos: { x: number; y: number },
    strings: DefaultNodeString,
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
  
}));