'use client'

import { NodeProps } from "@xyflow/react";
import { NodeObj } from "../types";
import { useParams, useRouter } from "next/navigation";
import BaseNode from "./BaseNode";
import { useDictionary } from "@/utils/CanvasDictionaryContext";

export default function SubNodeNode( props: NodeProps<NodeObj>) {
  const { data } = props;
  
  const dict = useDictionary();
  const router = useRouter();
  const params = useParams();

  if (data.type !== "subnode") return null;

  return (
    <BaseNode {...props} noEdit={true} onSpecialAction={() => router.push(`/${params.lang}/canvas/${params.projectId}/${data.targetCanvasId}`)} 
                         specialActionDescription={`REDIRECT TO: {data.targetCanvasName}`}>
      <div>Redirect: data.targetCanvasName</div>
    </BaseNode>
  );
}