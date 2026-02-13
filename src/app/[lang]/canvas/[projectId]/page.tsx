// This is hit after security check in middleware and layout.tsx, it is used only if user enters URL up to project ID and has perms.
// DEFAULT REDIRECT TO ROOT NODE 

import { redirect } from "next/navigation"


type Props = {
  params: { projectId: string }
}

export default async function ProjectRootPage({ params }: Props) {
  

  // get default Node, if it doesnt have for any reason, redirect to project

  //redirect(`/canvas/${params.projectId}/${node.id}`)
}