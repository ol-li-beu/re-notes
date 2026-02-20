"use client";

import { NodeProps } from "@xyflow/react";
import { NodeObj, } from "../types";
import BaseNode from "./BaseNode";

export default function GroupNode(props: NodeProps<NodeObj>) {
  const { data, id } = props;
  if (data.type !== "group") return null;

  return (
    <BaseNode
      {...props}
      iconName="canvasgroup"
      resizable={false}
      noEdit={false}
      noLock={true}  
    >
      {null}
    </BaseNode>
  );
}