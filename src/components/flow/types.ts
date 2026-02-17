import { Node } from "@xyflow/react";
import type {
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
} from "@xyflow/react";

import { DefaultNodeString } from "./store/NodeFactory";
import NoteNode from "./nodes/NoteNode";
import SubNodeNode from "./nodes/SubNodeNode";

/* sizes */

// Collapsed (fixed)
export const COLLAPSED_WIDTH = 300;
export const COLLAPSED_HEIGHT = 220;

// Expanded state (on default)
export const EXPANDED_DEFAULT_WIDTH = 600;
export const EXPANDED_DEFAULT_HEIGHT = 500;

// Expanded resize limits
export const EXPANDED_MIN_WIDTH = 500;
export const EXPANDED_MIN_HEIGHT = 400;

export const EXPANDED_MAX_WIDTH = 1200;
export const EXPANDED_MAX_HEIGHT = 1000;


/* FLow store state */

export interface FlowState {
  nodes: NodeObj[];
  edges: Edge[];

  past: FlowSnapshot[];
  future: FlowSnapshot[];

  isBatching: boolean;

  commitHistory: () => void;
  startBatch: () => void;
  endBatch: () => void;

  setFlow: (nodes: NodeObj[], edges: Edge[]) => void;

  onNodesChange: (changes: NodeChange<NodeObj>[]) => void;
  onEdgesChange: (changes: EdgeChange<Edge>[]) => void;
  onConnect: (connection: Connection) => void;

  addNodeAtPosition: (
    type: NodeTypes,
    pos: { x: number; y: number },
    strings: DefaultNodeString,
  ) => void;

  updateNodeData: <T extends NodeData["type"]>(
    id: string,
    type: T,
    updates: Omit<Partial<Extract<NodeData, { type: T }>>, "type">
  ) => void;

  // drag handler for parent
  draggingNodeId: string | null;
  setDraggingNodeId: (id: string | null) => void;  

  undo: () => void;
  redo: () => void;

  deleteNode: (id: string) => void;
  duplicateNode: (id: string) => void;
  copyNode: (id: string) => void;
  pasteNode: (position?: { x: number; y: number }) => void;
  cutNode: (id: string) => void;

  clipboard: NodeObj | null;
}

export type FlowSnapshot = {
  nodes: NodeObj[];
  edges: Edge[];
};


export const NodeClasses = {
  note: NoteNode,
  subnode: SubNodeNode,
};

export type NodeTypes = "note" | "subnode";



export type BaseNodeData = {
  label: string;
  description?: string;
  color?: string;

  expanded?: boolean;

  // not expanded size is default, only stored expanded
  width?: number;
  height?: number;

  locked?: boolean;
};

export type NoteNodeData = BaseNodeData & {
  type: "note";
  content?: string;
};

export type SubNodeData = BaseNodeData & {
  type: "subnode";
  redirectId: string;
  projectId: string;
};

export type NodeData = NoteNodeData | SubNodeData;

export type NodeObj = Node<NodeData>;
