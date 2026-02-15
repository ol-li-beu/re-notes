import { notFound } from "next/navigation";
import CanvasClient from "./CanvasClient";
import { getDictionary } from "@/utils/get-dictionary";
import { CanvasDictionaryContext } from "@/utils/CanvasDictionaryContext";


type Props = {
  params: { lang: string; projectId: string; nodeId: string }
}

export default async function NodePage({ params }: Props) {
    //BCK SUPABASE  OR IN STORE
  // validate nodeID belongs to the project

  // FETCH DATA GRAPH FROM NODEID
  // if not found use notFound

  const { lang, projectId, nodeId } = await params;

  



  const dict = await getDictionary(lang);

  return (
    <CanvasDictionaryContext dict={dict}>
    <CanvasClient
        lang= {lang}
        dict= {dict.canvas}
        projectId = {projectId}
    />
    </CanvasDictionaryContext>
  )
}