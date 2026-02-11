import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ProjectsClient from "./ProjectsClient"; 
import { getDictionary } from "@/utils/get-dictionary"; // 1. Importar diccionario

// Importamos el tipo para que TypeScript no se queje del mapeo
import { Project } from "@/utils/types"; 

export default async function ProjectsDashboard({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const supabase = await createClient();

  // 2. Verificar usuario
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/${lang}/login`);
  }

  // 3. Obtener el diccionario (Porque ProjectsClient lo pide)
  const dict = await getDictionary(lang);

  // 4. Obtener proyectos de la base de datos
  const { data: rawProjects } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_in_trash', false)
    .order('created_at', { ascending: false });

  // 5. Mapear los datos (Adaptador DB -> Frontend)
  // Tu tipo Project espera 'title', pero la DB devuelve 'name'. Aquí lo arreglamos.
  const validProjects: Project[] = (rawProjects || []).map((p) => ({
    id: p.id,
    title: p.name,       // <-- Mapeo importante
    name: p.name,
    description: p.description || "",
  }));

  // 6. Renderizar enviando LO QUE PIDE LA INTERFAZ
  // Usamos 'initialProjects' y 'dict' en lugar de 'projects' y 'user'
  return (
      <ProjectsClient 
        lang={lang} 
        dict={dict.projects} 
        initialProjects={validProjects} 
      />
  );
}