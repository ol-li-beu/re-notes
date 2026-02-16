import { Node} from "@xyflow/react";

import type {
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
} from "@xyflow/react";

import { DefaultNodeString } from "./store/NodeFactory";
import NoteNode from "./nodes/NoteNode";
import SubNodeNode from "./nodes/SubNodeNode";

export const minwidth = 300;
export const minheight = 220;


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

// data before creation (positions)
export type BaseNodeData = {
  label: string;
  description?: string;
  color?: string;
  expanded?: boolean;
  width?: number;   
  height?: number;
  collapsedHeight?: number;
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
// TODO 

export type TaskNodeData = {

}


export type NodeObj = Node<NodeData>;