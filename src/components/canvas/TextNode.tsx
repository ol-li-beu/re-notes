import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

// Este componente define cómo se ve CADA nodo
export default function TextNode({ data, isConnectable }: NodeProps) {
  
  // Leemos si el modo edición está activo desde la data del nodo
  const isEditing = data.isEditing as boolean;

  return (
    <div style={{ 
      padding: '10px', 
      border: '1px solid #777', 
      borderRadius: '5px', 
      background: 'white', 
      minWidth: '150px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
    }}>
      {/* Puntito de conexión superior (Entrada) */}
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      
      {/* ZONA DE TEXTO */}
      {isEditing ? (
        // Si estamos editando: mostramos un INPUT
        <input 
          className="nodrag" // "nodrag" es CLAVE: permite seleccionar texto sin arrastrar el nodo
          value={data.label as string} 
          onChange={(evt) => data.onChange && (data.onChange as any)(evt.target.value)}
          style={{ width: '100%', border: 'none', outline: 'none', fontSize: '14px' }}
          placeholder="Escribe algo..."
        />
      ) : (
        // Si es solo lectura: mostramos TEXTO normal
        <div style={{ fontSize: '14px', minHeight: '20px' }}>
          {data.label as string || "Sin texto"}
        </div>
      )}

      {/* Puntito de conexión inferior (Salida) */}
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  );
}