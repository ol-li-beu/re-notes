'use client' 

import { useState } from 'react'
import Link from 'next/link'
// 1. IMPORTAR deleteNode
import { createNode, updateNode, deleteNode, NodeData } from '@/utils/nodes'

export interface Node extends NodeData {} 

interface BlockEditorProps {
  projectId: string;
  initialNodes?: Node[];
}

export default function BlockEditor({ projectId, initialNodes = [] }: BlockEditorProps) {
  const [nodes, setNodes] = useState<Node[]>(initialNodes)
  const [loading, setLoading] = useState(false)
  const [saveStatus, setSaveStatus] = useState<string>('') 

  // ... (handleNewBlock se queda igual) ...
  const handleNewBlock = async () => {
    if (!projectId) return;
    setLoading(true)
    const newNode = await createNode(projectId, '', null, 'text')
    if (newNode) setNodes((prev) => [...prev, newNode])
    setLoading(false)
  }

  // ... (handleAddLink se queda igual) ...
  const handleAddLink = async () => {
    const targetId = prompt("Pegue aquí el ID del proyecto que quiere vincular:");
    if (!targetId) return;
    setLoading(true)
    const newNode = await createNode(projectId, targetId, null, 'project_link')
    if (newNode) setNodes((prev) => [...prev, newNode])
    setLoading(false)
  }

  // ... (handleChange y handleSave se quedan igual) ...
  const handleChange = (id: string, newContent: string) => {
    setSaveStatus('Escribiendo...')
    setNodes((prevNodes) => 
      prevNodes.map((node) => node.id === id ? { ...node, content: newContent } : node)
    )
  }

  const handleSave = async (id: string, content: string) => {
    setSaveStatus('Guardando...')
    await updateNode(id, content)
    setSaveStatus('Guardado ✅')
    setTimeout(() => setSaveStatus(''), 2000)
  }

  // 2. NUEVA FUNCIÓN PARA BORRAR DE VERDAD
  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que quieres borrar este bloque?')) return;

    // 1. Optimista: Lo borramos de la pantalla inmediatamente
    setNodes((prev) => prev.filter((n) => n.id !== id))

    // 2. Base de datos: Lo borramos de Supabase
    const success = await deleteNode(id)
    
    if (!success) {
      alert("Hubo un error al borrar el nodo")
      // Si falla, podrías recargar la página o volver a agregarlo al estado
    }
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-8 bg-white min-h-[500px] shadow-sm border border-gray-100 rounded-xl relative">
      
      <div className="absolute top-4 right-8 text-xs text-gray-400 font-mono h-4">
        {saveStatus}
      </div>

      <div className="space-y-3 mb-8">
        {nodes.length === 0 && (
          <p className="text-gray-300 italic">No hay notas. Agrega un bloque abajo.</p>
        )}

        {nodes.map((node) => (
          <div key={node.id} className="group flex items-center gap-2">
            
            {node.type === 'project_link' ? (
               // BLOQUE DE LINK
               <div className="w-full p-3 bg-blue-50 border border-blue-100 rounded flex items-center justify-between group-hover:border-blue-300 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🔗</span>
                    <Link 
                       href={`/es/projects/${node.content}`} 
                       className="text-blue-600 underline hover:text-blue-800 font-medium cursor-pointer"
                    >
                       Ir al Proyecto vinculado
                    </Link>
                    <span className="text-xs text-gray-400 font-mono ml-2">({node.content.slice(0,8)}...)</span>
                  </div>
                  
                  {/* 3. BOTÓN CONECTADO A handleDelete */}
                  <button 
                    onClick={() => handleDelete(node.id)}
                    className="text-xs text-red-400 hover:text-red-600 font-bold px-2 py-1 hover:bg-red-50 rounded"
                  >
                    Quitar
                  </button>
               </div>
            ) : (
               // BLOQUE DE TEXTO
               <div className="flex w-full items-center gap-2">
                 <input 
                    type="text"
                    value={node.content}
                    onChange={(e) => handleChange(node.id, e.target.value)}
                    onBlur={() => handleSave(node.id, node.content)}
                    placeholder="Escribe algo..."
                    className="w-full p-2 text-gray-800 bg-transparent hover:bg-gray-50 focus:bg-gray-50 focus:outline-none rounded transition-colors"
                 />
                 {/* Opcional: Botón borrar también para texto */}
                 <button 
                    onClick={() => handleDelete(node.id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-opacity"
                    title="Borrar bloque"
                 >
                   🗑️
                 </button>
               </div>
            )}

          </div>
        ))}
      </div>

      <div className="flex gap-3 border-t pt-4 border-gray-100">
        <button 
            onClick={handleNewBlock}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm transition-colors"
        >
            <span>+</span> Texto
        </button>

        <button 
            onClick={handleAddLink}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded text-sm transition-colors"
        >
            <span>🔗</span> Link a Proyecto
        </button>
      </div>

    </div>
  )
}