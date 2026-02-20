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
import GroupNode from "./nodes/GroupNode";

/* sizes for nodes in node canvas*/

// Collapsed (fixed)
export const COLLAPSED_WIDTH = 330;
export const COLLAPSED_HEIGHT = 230;

// Expanded state (on default)
export const EXPANDED_DEFAULT_WIDTH = 600;
export const EXPANDED_DEFAULT_HEIGHT = 540;

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

  setNodeParent: (nodeId: string, parentId: string | undefined, position: { x: number; y: number }) => void;
  resizeGroupToFitChildren: (groupId: string) => void;
}

export type FlowSnapshot = {
  nodes: NodeObj[];
  edges: Edge[];
};


export const NodeClasses = {
  note: NoteNode,
  subnode: SubNodeNode,
  group: GroupNode,
};

export type NodeTypes = "note" | "subnode" | "group";



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
  targetCanvasId: string | null;
  targetCanvasName: string | null;
  linkId: string | null;
  projectId: string;
};

export type GroupData = BaseNodeData & {
  type: "group";
};

export type NodeData = NoteNodeData | SubNodeData | GroupData;

export type NodeObj = Node<NodeData>;


/* Project Home page types */


export interface ProjectState {
  projectId: string | null;
  projectName: string;
  rootCanvasId: string | null;
  canvases: CanvasMeta[];
  links: CanvasLink[];

  // In case of project state, initialization
  initProject: (projectId: string, projectName: string, rootCanvasId: string, canvases: CanvasMeta[], links: CanvasLink[]) => void;

  // canvas CRUD
  addCanvas: (name: string, positionX?: number, positionY?: number) => string; // returns new id
  deleteCanvas: (id: string) => void;
  renameCanvas: (id: string, name: string) => void;
  updateCanvasPosition: (id: string, x: number, y: number) => void;

  // links
  addLink: (fromCanvasId: string, toCanvasId: string) => string; // returns new linkId
  removeLink: (linkId: string) => void;
  removeLinksByCanvas: (canvasId: string) => void;

  // helpers
  getStatus: (canvasId: string) => CanvasStatus;
  getCanvasStats: (canvasId: string) => { nodeCount: number; incomingCount: number; outgoingCount: number };

  
}


export type CanvasMeta = {
  id: string;
  projectId: string;
  name: string;
  positionX: number;
  positionY: number;
};

export type CanvasLink = {
  id: string;
  projectId: string;
  fromCanvasId: string;
  toCanvasId: string;
};

export type CanvasStatus = "root" | "linked" | "orphan";

export type GraphNodeData = {
  canvasId: string;
  name: string;         
  status: CanvasStatus;
  projectId: string;
  isRenaming?: boolean;
};
