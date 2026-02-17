// check if user has permission to the PROJECT. always hit, diff to page (depend on level as always)

// SUPABASE CREATE RLS AND POLICIES

import { redirect } from "next/navigation";

type ProjectLayoutProps = {
  children: React.ReactNode
  params: { projectId: string }
}

export default async function ProjectLayout({ children, params }: ProjectLayoutProps) {
  // extra security so that not everything in middleware? separation of concerns
  // BCK
  // GET SESSION ACTUAL AND IF THERE IS NOT, redirect to login

  // check if user has permission in this project (owner or etc) In MVP only check owner. If not redirect to projects
  


  return (
    <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
      {children}
    </div>
  );
}