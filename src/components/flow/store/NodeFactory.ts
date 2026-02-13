
import { NodeObj, NodeTypes } from "../types";



export function createNode(type: NodeTypes, position: { x: number; y: number }, ): NodeObj {
  const id = crypto.randomUUID();

  switch (type) {

    // at first default fg color then switch possible

    case "note":
      return {
        id,
        type: "note",
        position,
        data: {
          label: "New Note Node",
          content: "",
        } 
      } as NodeObj; 

    case "subnode":
      return {
        id,
        type: "subnode",
        position,
        data: {
          redirectId: id,
          label: "New Subspace Node"
        },
      } as NodeObj;
  }
}