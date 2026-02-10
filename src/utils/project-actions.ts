'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// Definimos el tipo de datos que esperamos recibir del Frontend
type ProjectData = {
  title: string;
  description: string;
}

// ------------------------------------------------------------------
// 1. CREAR PROYECTO
// ------------------------------------------------------------------
export async function createProject(lang: string, data: ProjectData) {
  const supabase = await createClient()

  // Verificar usuario
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Usuario no autenticado" }

  // Insertar en Supabase
  const { error } = await supabase.from('projects').insert({
    user_id: user.id,
    name: data.title,        // Mapeamos: 'title' del form -> 'name' de la BD
    description: data.description,
    is_favorite: false,
    is_in_trash: false
  })

  if (error) {
    console.error("Error creating project:", error)
    return { error: error.message }
  }

  // Recargar la página para mostrar el nuevo proyecto
  revalidatePath(`/${lang}/projects`)
  return { success: true }
}

// ------------------------------------------------------------------
// 2. ACTUALIZAR PROYECTO (EDITAR)
// ------------------------------------------------------------------
export async function updateProject(lang: string, projectId: string, data: ProjectData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Usuario no autenticado" }

  const { error } = await supabase.from('projects')
    .update({
      name: data.title,
      description: data.description,
      updated_at: new Date().toISOString()
    })
    .eq('id', projectId)
    .eq('user_id', user.id) // Seguridad: solo el dueño puede editar

  if (error) {
    console.error("Error updating project:", error)
    return { error: error.message }
  }

  revalidatePath(`/${lang}/projects`)
  return { success: true }
}

// ------------------------------------------------------------------
// 3. MOVER A PAPELERA (BORRAR)
// ------------------------------------------------------------------
export async function softDeleteProject(lang: string, projectId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Usuario no autenticado" }

  // Soft Delete: Solo marcamos is_in_trash como true
  const { error } = await supabase.from('projects')
    .update({ 
      is_in_trash: true,
      updated_at: new Date().toISOString()
    })
    .eq('id', projectId)
    .eq('user_id', user.id)

  if (error) {
    console.error("Error deleting project:", error)
    return { error: error.message }
  }

  revalidatePath(`/${lang}/projects`)
  return { success: true }
}

// ------------------------------------------------------------------
// 4. RESTAURAR PROYECTO (Sacar de papelera)
// ------------------------------------------------------------------
export async function restoreProject(lang: string, projectId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Usuario no autenticado" }

  const { error } = await supabase.from('projects')
    .update({ 
      is_in_trash: false, // Lo volvemos a poner visible
      updated_at: new Date().toISOString()
    })
    .eq('id', projectId)
    .eq('user_id', user.id)

  if (error) {
    console.error("Error restoring project:", error)
    return { error: error.message }
  }

  // Recargamos ambas rutas para que desaparezca de aquí y aparezca en la lista principal
  revalidatePath(`/${lang}/projects/recycled-bin`)
  revalidatePath(`/${lang}/projects`)
  return { success: true }
}

// ------------------------------------------------------------------
// 5. BORRAR PARA SIEMPRE (Hard Delete)
// ------------------------------------------------------------------
export async function deleteProjectForever(lang: string, projectId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Usuario no autenticado" }

  // DELETE real de SQL
  const { error } = await supabase.from('projects')
    .delete()
    .eq('id', projectId)
    .eq('user_id', user.id)

  if (error) {
    console.error("Error deleting forever:", error)
    return { error: error.message }
  }

  revalidatePath(`/${lang}/projects/recycled-bin`)
  return { success: true }
}