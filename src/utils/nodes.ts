// Archivo: src/utils/nodes.ts
import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

// Exportamos esta interfaz para usarla en tus componentes
export interface NodeData {
  id: string;
  project_id: string;
  parent_id: string | null;
  content: string;
  type: string;
  created_at: string;
}

export const createNode = async (projectId: string, content: string = '', parentId: string | null = null, type: string = 'text') => {
  
  if (!projectId) {
    console.error('Error: Se requiere un projectId para crear un nodo')
    return null
  }

  const { data, error } = await supabase
    .from('nodes')
    .insert([
      { 
        project_id: projectId,
        content: content, 
        parent_id: parentId, 
        type: type 
      }
    ])
    .select() 
    .single()

  if (error) {
    console.error('Error creando nodo:', error)
    return null
  }

  // "as NodeData" ayuda a TypeScript a entender qué devuelve esto
  return data as NodeData
}

export const updateNode = async (nodeId: string, content: string) => {
  const { error } = await supabase
    .from('nodes')
    .update({ content: content })
    .eq('id', nodeId)

  if (error) {
    console.error('Error actualizando nodo:', error)
  }
}

export const deleteNode = async (nodeId: string) => {
  const { error } = await supabase
    .from('nodes')
    .delete()
    .eq('id', nodeId)

  if (error) {
    console.error('Error borrando nodo:', error)
    return false
  }
  return true
}