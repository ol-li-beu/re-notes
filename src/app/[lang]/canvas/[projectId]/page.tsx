import ProjectHomeClientWrapper from "./ProjectHomeClientWrapper";

type Props = { params: { lang: string; projectId: string } };

export default async function ProjectHomePage({ params }: Props) {
  const { lang, projectId } = await params;

  
  // later: fetch canvases + links from Supabase, initProject in store
  return (
    <ProjectHomeClientWrapper lang={lang} projectId={projectId} />
  );
}