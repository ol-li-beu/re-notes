
import ProjectStoreInitializer from "@/components/flow/store/ProjectStoreInitializer";
import { CanvasDictionaryContext } from "@/utils/CanvasDictionaryContext";
import { getDictionary } from "@/utils/get-dictionary";

type ProjectLayoutProps = {
  children: React.ReactNode
  params: { lang: string, projectId: string }
}

export default async function ProjectLayout({ children, params }: ProjectLayoutProps) {
  const { lang, projectId } = await params;

  const dict = await getDictionary(lang);

  // MOCK DATA
  const mockCanvases = [
  { id: "root-1", projectId, name: "Root", positionX: 400, positionY: 300 },
  { id: "canvas-2", projectId, name: "Ideas", positionX: 200, positionY: 500 },
  { id: "canvas-3", projectId, name: "Research", positionX: 600, positionY: 500 },
  { id: "canvas-4", projectId, name: "Design", positionX: 300, positionY: 400 },
  { id: "canvas-5", projectId, name: "Planning", positionX: 500, positionY: 400 },
  { id: "canvas-6", projectId, name: "Archive", positionX: 700, positionY: 300 },
  { id: "canvas-7", projectId, name: "Notes", positionX: 400, positionY: 600 },
];
  
  const mockLinks = [
    { id: "link-1", projectId: "proj-1", fromCanvasId: "root-1", toCanvasId: "canvas-2" },
    { id: "link-2", projectId: "proj-1", fromCanvasId: "root-1", toCanvasId: "canvas-3" },
  ];

  // extra security so that not everything in middleware? separation of concerns

  // GET SESSION ACTUAL AND IF THERE IS NOT, redirect to login

  // check if user has permission in this project (owner or etc) In MVP only check owner. If not redirect to projects

  // supabase RLS and security
  
  // load data 

  // fetch canvases + links → initProject(...)

  return (<>
    <ProjectStoreInitializer
      projectId={projectId}
      projectName="My Project"
      rootCanvasId="root-1"
      canvases={mockCanvases}
      links={mockLinks}
    />
    <CanvasDictionaryContext dict={dict}> 
      <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
       {children}
      </div>
    </CanvasDictionaryContext>
  </>);
}