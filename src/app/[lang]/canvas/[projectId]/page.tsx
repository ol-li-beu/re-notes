// This is hit after security check in middleware and layout.tsx, it is used only if user enters URL up to project ID and has perms.
// DEFAULT REDIRECT TO ROOT NODE 

import { redirect } from "next/navigation"


type Props = {
  params: { projectId: string }
}

export default async function ProjectRootPage({ params }: Props) {
  

  // INTERFAZ CONTROL DE CANVAS POR NOMBRE, deletion of nodes and also de change nombre. SHOW LINKS OR ORPHAN root
  // incoming outcoming root
  // LINKS OBJECT

  // get default Node, if it doesnt have for any reason, redirect to project


  // option
  //redirect(`/canvas/${params.projectId}/${node.id}`)

/*
  {
  projectId,
  rootCanvasId,
  canvases: Record<string, CanvasMeta>,
  links: CanvasLink[]
}



*/
  return (
  <>
    <h2> Project home page </h2>
  
  
  
  </>);
}