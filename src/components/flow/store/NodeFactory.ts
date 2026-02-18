
import { NodeObj, NodeTypes } from "../types";
import {
  EXPANDED_DEFAULT_WIDTH,
  EXPANDED_DEFAULT_HEIGHT,
} from "../types";


export interface DefaultNodeString {
      // general
      label: string;
      description: string;

      // specific for SubNodeNode
      projectId: string;
}

export function createNode(
  type: NodeTypes,
  position: { x: number; y: number },
  strings: Partial<DefaultNodeString> = {}
): NodeObj {
  const id = crypto.randomUUID();
  const { label = "", description = "", projectId } = strings;

  if (type === "subnode" && !projectId) {
    throw new Error("subnode requires projectId");
  }

  switch (type) {
    case "note":
      return {
        id,
        type: "note",
        position,
        data: {
          type: "note",
          label,
          description,
          content: "",
          expanded: false,
          color: "",
          locked: false,

          // Expanded size 
          width: EXPANDED_DEFAULT_WIDTH,
          height: EXPANDED_DEFAULT_HEIGHT,
        },
      };

    case "subnode": {
      if (!projectId) {
        throw new Error("subnode requires projectId");
      }

      return {
        id,
        type: "subnode",
        position,
        data: {
          type: "subnode",
          label,
          targetCanvasId: "",
          targetCanvasName: "",
          linkId: "",
          description,
          projectId: projectId, 
          expanded: false,
          color: "",
          locked: false,
          width: EXPANDED_DEFAULT_WIDTH,
          height: EXPANDED_DEFAULT_HEIGHT,
        },
      };
    }
    
    default:
      throw new Error(`Unsupported node type: ${type}`);
  }
}