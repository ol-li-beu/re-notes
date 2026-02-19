import { notFound } from "next/navigation";
import { getDictionary } from "@/utils/get-dictionary";
import { CanvasDictionaryContext } from "@/utils/CanvasDictionaryContext";
import CanvasClientWrapper from "./CanvasClientWrapper";


type Props = {
  params: { lang: string; projectId: string; nodeId: string }
}

export default async function NodePage({ params }: Props) {
    //BCK SUPABASE  OR IN STORE
  // validate nodeID belongs to the project

  // FETCH DATA GRAPH FROM NODEID
  // if not found use notFound

  const { lang, projectId, nodeId } = await params;

  // fetch canvas name from supas
  
  return (
    <CanvasClientWrapper
        lang= {lang}
        projectId = {projectId}
        nodeId = {nodeId}
        canvasName = "TODO"
    />
  )
}