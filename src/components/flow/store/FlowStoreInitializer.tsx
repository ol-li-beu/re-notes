"use client";

import { useState, useLayoutEffect } from "react";
import { useFlowStore } from "./useFlowStore";
import { NodeObj } from "../types";
import { Edge } from "@xyflow/react";

export default function FlowStoreInitializer({nodes, edges, }: {
  nodes: NodeObj[];
  edges: Edge[]; }) {
    
  useLayoutEffect(() => {
    useFlowStore.getState().setFlow(nodes, edges);
  }, []);

  return null;
}