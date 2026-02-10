'use client'

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import Link from "next/link";
import { Project } from "@/utils/types";
import TextNode from './TextNode';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

interface CanvasClientProps {
  project: Project;
  lang: string;
}

export default function CanvasClient({ project, lang }: CanvasClientProps) {
  // Estado para controlar el MODO (Lectura vs Edición)
  const [isEditingMode, setIsEditingMode] = useState(false); // Empieza en modo lectura (seguro)

  // 2. Definimos los tipos de nodos (fuera del render o con useMemo)
  const nodeTypes = useMemo(() => ({ textNode: TextNode }), []);

  // 3. Función para actualizar el texto de un nodo
  const onNodeLabelChange = (nodeId: string, newLabel: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          // Actualizamos la data del nodo y mantenemos la función onChange
          return { 
            ...node, 
            data: { ...node.data, label: newLabel } 
          };
        }
        return node;
      })
    );
  };

  // Datos iniciales (Nota que ahora usamos type: 'textNode')
  const initialNodes = [
    { 
      id: '1', 
      type: 'textNode', // 👈 Importante
      position: { x: 100, y: 100 }, 
      data: { label: 'Click en Editar ↗️', isEditing: false, onChange: (val: string) => onNodeLabelChange('1', val) } 
    },
    { 
      id: '2', 
      type: 'textNode', 
      position: { x: 300, y: 200 }, 
      data: { label: 'Soy una nota', isEditing: false, onChange: (val: string) => onNodeLabelChange('2', val) } 
    },
  ];
  
  const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  // 4. Efecto Mágico: Cuando cambiamos el modo, actualizamos TODOS los nodos
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: { 
          ...node.data, 
          isEditing: isEditingMode, // Propagamos el estado a cada nodo
          // Re-inyectamos la función onChange por si se pierde al serializar (opcional pero seguro)
          onChange: (val: string) => onNodeLabelChange(node.id, val)
        }, 
      }))
    );
  }, [isEditingMode, setNodes]);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      
      {/* HEADER */}
      <header style={{ 
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "10px 20px", borderBottom: "1px solid #ccc", background: "white", zIndex: 10 
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
           <Link href={`/${lang}/projects`} style={{ textDecoration: "none", fontSize: "1.2rem" }}>←</Link>
           <h2 style={{ margin: 0, fontSize: "1rem" }}>{project.title || project.name}</h2>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
            {/* BOTÓN TOGGLE MODO */}
            <button 
                onClick={() => setIsEditingMode(!isEditingMode)}
                style={{ 
                    padding: "6px 15px", 
                    borderRadius: "5px", 
                    border: "1px solid #ccc", 
                    background: isEditingMode ? "#e0ffe0" : "#f0f0f0",
                    cursor: "pointer",
                    fontWeight: "bold"
                }}
            >
                {isEditingMode ? "🔓 Modo Edición" : "🔒 Modo Lectura"}
            </button>

            <button style={{ background: "black", color: "white", padding: "6px 15px", borderRadius: "5px", border: "none" }}>
                Guardar
            </button>
        </div>
      </header>

      {/* CANVAS */}
      <div style={{ flex: 1, background: isEditingMode ? "#fff" : "#fafafa" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes} // Registramos nuestro nodo
          
          // BLOQUEAMOS INTERACCIONES SI NO ESTAMOS EDITANDO
          nodesDraggable={isEditingMode}
          nodesConnectable={isEditingMode}
          elementsSelectable={isEditingMode}
          
          fitView
        >
          <Background color="#aaa" gap={16} />
          <Controls />
        </ReactFlow>
      </div>
      
    </div>
  );
}