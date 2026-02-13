import { notFound } from "next/navigation";
import CanvasClient from "./CanvasClient";
import { getDictionary } from "@/utils/get-dictionary";

// for testing only
  import { createNode } from "@/components/flow/store/NodeFactory";

type Props = {
  params: { lang: string; projectId: string; nodeId: string }
}

export default async function NodePage({ params }: Props) {
    //BCK SUPABASE  OR IN STORE
  // validate nodeID belongs to the project

  // FETCH DATA GRAPH FROM NODEID
  // if not found use notFound

  const { lang, projectId, nodeId } = await params;

  
// test only
  const initialNodes = [
    createNode("note", { x: 100, y: 100 }),
    createNode("subnode", { x: 400, y: 150 }),
    createNode("note", { x: 100, y: 300 }),
  ];


  const dict = await getDictionary(lang);

  return (
    <CanvasClient
        lang= {lang}
        dict= {dict.canvas}
    />
  )
}