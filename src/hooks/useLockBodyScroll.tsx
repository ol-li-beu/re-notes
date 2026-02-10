"use client"

import { useEffect } from "react";


// CUSTOM HOOK TO DISABLE SCROLL WITH A COUNTER

let lockCount = 0;

export function useLockBodyScroll(locked: boolean = false) {
  useEffect(() => {
    if (!locked) return;
    if (typeof document === "undefined") return;

    lockCount++;
    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      lockCount--;
      if (lockCount === 0) {
        document.body.style.overflow = originalOverflow;
      }
    };
  }, [locked]);
}