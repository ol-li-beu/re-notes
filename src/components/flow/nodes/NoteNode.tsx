import { useCallback, useEffect } from "react";
import { NodeProps } from "@xyflow/react";
import { NodeObj } from "../types";
import BaseNode from "./BaseNode";
import { useFlowStore } from "../store/useFlowStore";

export default function NoteNode(props: NodeProps<NodeObj>) {
  const { id, data } = props;

  const updateNodeData = useFlowStore((s) => s.updateNodeData);
  const startBatch = useFlowStore((s) => s.startBatch);
  const endBatch = useFlowStore((s) => s.endBatch);

  // CHeck typing union
  if (data.type !== "note") return null;
  
 useEffect(() => {
  return () => {
    
    endBatch(); 
  };
  }, [endBatch]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      updateNodeData(id, "note", {
        content: e.target.value,
      });
    },
    [id, updateNodeData]
  );

  return (
    <BaseNode {...props}>
      <textarea
        value={data.content ?? ""}
        onFocus={startBatch}
        onBlur={endBatch}
        onChange={handleChange}
        className="nodrag nowheel"
      />
    </BaseNode>
  );
}