import { Node} from "@xyflow/react";

import type {
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
} from "@xyflow/react";
export interface FlowState {
  nodes: NodeObj[];
  edges: Edge[];

  past: { nodes: NodeObj[]; edges: Edge[] }[];
  future: { nodes: NodeObj[]; edges: Edge[] }[];

  isBatching: boolean;
  startBatch: () => void;
  endBatch: () => void;

  setFlow: (nodes: NodeObj[], edges: Edge[]) => void;

  onNodesChange: (changes: NodeChange<NodeObj>[]) => void;
  onEdgesChange: (changes: EdgeChange<Edge>[]) => void;
  onConnect: (connection: Connection) => void;

  addNodeAtPosition: (
    type: NodeTypes,
    pos: { x: number; y: number }
  ) => void;

  undo: () => void;
  redo: () => void;
}



export type NodeTypes = "note" | "subnode";

// data before creation (positions)
export type NoteNodeData = {
  label: string;
  content?: string;
  color?: string;
}


export type SubNodeData = {
    label: string;
    redirectId: string;
    color?: string;
}

// TODO 

export type TaskNodeData = {

}


export type NodeData = NoteNodeData | SubNodeData;

export type NodeObj = Node<NodeData>;