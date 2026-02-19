"use client";

import { useEffect, useCallback } from "react";
import { useReactFlow } from "@xyflow/react";
import styles from "./clickcursor.module.css";

const rippleClass = styles.ripple as string;

export default function ClickCursor() {
  const { screenToFlowPosition, getViewport } = useReactFlow();

  const handleClick = useCallback((e: MouseEvent) => {
    const flowPos = screenToFlowPosition({ x: e.clientX, y: e.clientY });
    const { zoom } = getViewport();

    const viewport = document.querySelector(".react-flow__viewport") as HTMLElement;
    if (!viewport) return;

    const RINGS = 2;

    for (let i = 0; i < RINGS; i++) {
      const ring = document.createElement("div");
      ring.setAttribute("class", rippleClass);

      ring.style.left = `${flowPos.x}px`;
      ring.style.top = `${flowPos.y}px`;
      ring.style.animationDelay = `${i * 250}ms`;
      ring.style.borderWidth = `${3 / zoom}px`;
      ring.style.borderStyle = "solid";
      ring.style.borderColor = "var(--fg)";
      ring.style.background = "transparent";
      ring.style.setProperty("--ring-size", `${90 / zoom}px`);
      ring.style.setProperty("--ring-start", `${15 / zoom}px`);

      viewport.appendChild(ring);

      ring.addEventListener("animationend", () => ring.remove(), { once: true });
    }
  }, [screenToFlowPosition, getViewport]);

  useEffect(() => {
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [handleClick]);

  return null;
}