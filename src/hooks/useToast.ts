"use client";

import { useContext } from "react";
import { ToastContext } from "./ToastContext";

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast needs to be inside a ToastContext");
  }

  return context;
}