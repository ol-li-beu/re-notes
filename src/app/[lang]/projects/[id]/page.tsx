import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import BlockEditor from "@/components/BlockEditor";

interface ProjectPageProps {
  params: Promise<{
    lang: string;
    id: string;
  }>;
}

export default async function ProjectEditorPage({ params }: ProjectPageProps) {
  const { lang, id } = await params;

  // 1. LIMPIEZA DEL ID (CRÍTICO)
  // Esto arregla el error de "UUID no válido" decodificando caracteres raros
  const cleanId = decodeURIComponent(id).trim();

  const supabase = await createClient();

  // 2. Verificar usuario
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/${lang}/login`);
  }

  // 3. Buscar el proyecto (Usando el ID limpio)
  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", cleanId)
    .single();

  if (error || !project) {
    console.error("Error cargando proyecto:", error);
    // Si falla, mostramos 404, pero solo si Supabase confirma que no existe
    return notFound();
  }

  // 4. Cargar los nodos iniciales
  const { data: initialNodesRaw } = await supabase
    .from("nodes")
    .select("*")
    .eq("project_id", project.id)
    .order("created_at", { ascending: true });

  const initialNodes = initialNodesRaw || [];

  return (
    <div className="min-h-screen bg-white">
      <header className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-white sticky top-0 z-10">
        <div>
           <div className="text-xs text-gray-400 font-mono mb-1">PROYECTO</div>
           <h1 className="text-xl font-bold text-gray-800">{project.name}</h1>
        </div>
        <div className="text-sm text-gray-400">
           {/* Aquí podrías poner indicadores de "Guardado..." */}
           {initialNodes.length} bloques
        </div>
      </header>

      <BlockEditor 
        projectId={project.id} 
        initialNodes={initialNodes} 
      />
    </div>
  );
}