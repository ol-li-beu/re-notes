
import { CanvasDictionaryContext } from "@/utils/CanvasDictionaryContext";
import { getDictionary } from "@/utils/get-dictionary";


type ProjectLayoutProps = {
  children: React.ReactNode
  params: { lang: string, projectId: string }
}

export default async function ProjectLayout({ children, params }: ProjectLayoutProps) {
  const { lang, projectId } = await params;

  const dict = await getDictionary(lang);

  // extra security so that not everything in middleware? separation of concerns

  // GET SESSION ACTUAL AND IF THERE IS NOT, redirect to login

  // check if user has permission in this project (owner or etc) In MVP only check owner. If not redirect to projects

  // supabase RLS and security
  
  // load data 

  // fetch canvases + links → initProject(...)

  return (
    <CanvasDictionaryContext dict={dict}> 
      <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
       {children}
      </div>
    </CanvasDictionaryContext>
  );
}