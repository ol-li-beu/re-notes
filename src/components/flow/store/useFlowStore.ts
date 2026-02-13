import { create } from "zustand";
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  NodeChange,
  EdgeChange,
  Connection,
  Edge,
} from "@xyflow/react";
import { createNode } from "./NodeFactory";
import { FlowState, NodeObj } from "../types";



export const useFlowStore = create<FlowState>((set, get) => ({
  nodes: [],
  edges: [],

  isBatching: false,

  past: [],
  future: [],

  setFlow: (nodes, edges) => {
  set({ nodes, edges });
  },
  

  onNodesChange: (changes: NodeChange<NodeObj>[]) => {
  const newNodes = applyNodeChanges<NodeObj>(changes, get().nodes);
  get().setFlow(newNodes, get().edges);
  },

  onEdgesChange: (changes: EdgeChange<Edge>[]) => {
  const newEdges = applyEdgeChanges<Edge>(changes, get().edges);
  get().setFlow(get().nodes, newEdges);
  },

  onConnect: (connection: Connection) => {
    const newEdges = addEdge(connection, get().edges);
    get().setFlow(get().nodes, newEdges);
  },

  addNodeAtPosition: (type, pos) => {
    const newNode = createNode(type, pos);
    get().setFlow([...get().nodes, newNode], get().edges);
  },

  startBatch: () => {
  const state = get();
  set({
    isBatching: true,
    past: [...state.past, { nodes: state.nodes, edges: state.edges }],
    future: [],
  });
  },

  endBatch: () => {
  set({ isBatching: false });
  },

  undo: () => {
    const { past, nodes, edges, future } = get();
    if (past.length === 0) return;

    const previous = past[past.length - 1]!;

    set({
      nodes: previous.nodes,
      edges: previous.edges,
      past: past.slice(0, -1),
      future: [{ nodes, edges }, ...future],
    });
  },

  redo: () => {
    const { future, nodes, edges, past } = get();
    if (future.length === 0) return;

    const next = future[0]!;

    set({
      nodes: next.nodes,
      edges: next.edges,
      future: future.slice(1),
      past: [...past, { nodes, edges }],
    });
  },
}));