
import { NodeObj, NodeTypes } from "../types";
import { minheight, minwidth } from "../types";


export interface DefaultNodeString {
      // general
      label: string;
      description: string;

      // specific for SubNodeNode
      projectId: string;
}


export function createNode(type: NodeTypes, position: { x: number; y: number }, strings : Partial<DefaultNodeString> = {}): NodeObj {
  const id = crypto.randomUUID();
  const { label, description, projectId } = strings;


  if (type === "subnode" && !strings.projectId) {
    throw new Error("subnode requires projectId"); 
  }


  // defautl size
  

  switch (type) {
    // at first default fg color then switch possible
    case "note":
      return {
        id,
        type: "note",
        position,
        data: {
          type: "note",
          label: label,
          description: description,
          content: "",
          expanded: false,
          color: "",
          width: minwidth,
          height: minheight,
          collapsedHeight: minheight,
          locked: false,
        } 
      } as NodeObj; 

    case "subnode":
      return {
        id,
        type: "subnode",
        position,
        data: {
          type: "subnode",
          label: label,
          description: description,
          redirectId: id,
          expanded: false,
          projectId: projectId,
          color: "",
          width: minwidth,
          height: minheight,
          collapsedHeight: minheight,
          locked: false,
        },
      } as NodeObj;


    default:
      throw new Error(`Unsupported node type: ${type}`);
  }

  
}