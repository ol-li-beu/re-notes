import { createClient } from "@/utils/supabase/server";
import { getDictionary } from "@/utils/get-dictionary";
import { Project, PageProps } from "@/utils/types"; 
import RecycledBinClient from "./RecycledBinClient"; 

export default async function RecycledBinPage({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const supabase = await createClient();

  // 1. Obtener Usuario
  const { data: { user } } = await supabase.auth.getUser();

  let trashProjects: any[] = [];
  
  if (user) {
    // 2. Pedir SOLO los que están en la papelera (is_in_trash: true)
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_in_trash", true) // FILTRO CLAVE
      .order("updated_at", { ascending: false }); // Mostrar los recién borrados primero
      
    if (data) trashProjects = data;
  }

  // 3. Adaptar datos (name -> title)
  const mappedProjects: Project[] = trashProjects.map((p) => ({
    id: p.id,
    title: p.name,
    name: p.name,
    description: p.description || "",
  }));

  return (
    <RecycledBinClient
      lang={lang}
      dict={dict.recycled} 
      initialProjects={mappedProjects} // Pasamos los datos REALES
    />
  );
}