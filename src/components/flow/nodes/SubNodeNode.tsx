import { NodeProps } from "@xyflow/react";
import { NodeObj } from "../types";
import BaseNode from "./BaseNode";

export default function SubNodeNode(
  props: NodeProps<NodeObj>
) {
  const { data } = props;

  if (data.type !== "subnode") return null;

  return (
    <BaseNode {...props}>
      <div>Redirect: {data.redirectId}</div>
    </BaseNode>
  );
}