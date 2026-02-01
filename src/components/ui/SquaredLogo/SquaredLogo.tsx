"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./squaredlogo.module.css";

export default function SquaredLogo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  const containerSpeed = 360 / 7; // degrees per second
  const logoSpeed = 360 / 4;      // reverse

  const [hovering, setHovering] = useState(false);

  const containerAngleRef = useRef(0);
  const logoAngleRef = useRef(0);

  const containerLastTimeRef = useRef<number | null>(null);
  const logoLastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    let animationFrame: number;
    const maxDelta = 0.05; // seconds

    const updateRotation = (timestamp: number) => {
      if (hovering) {
        if (!containerLastTimeRef.current) containerLastTimeRef.current = timestamp;
        if (!logoLastTimeRef.current) logoLastTimeRef.current = timestamp;

        let deltaContainer = (timestamp - containerLastTimeRef.current) / 1000;
        let deltaLogo = (timestamp - logoLastTimeRef.current) / 1000;

        // prevent jumps
        deltaContainer = Math.min(deltaContainer, maxDelta);
        deltaLogo = Math.min(deltaLogo, maxDelta);

       
        containerAngleRef.current = (containerAngleRef.current + containerSpeed * deltaContainer + 360) % 360;
        logoAngleRef.current = (logoAngleRef.current - logoSpeed * deltaLogo + 360) % 360;

        if (containerRef.current) {
          containerRef.current.style.transform = `rotate(${containerAngleRef.current}deg)`;
        }
        if (logoRef.current) {
          logoRef.current.style.transform = `rotate(${logoAngleRef.current}deg)`;
        }

        containerLastTimeRef.current = timestamp;
        logoLastTimeRef.current = timestamp;
      } else {
        // persist last rotation
        if (containerRef.current) {
          containerRef.current.style.transform = `rotate(${containerAngleRef.current}deg)`;
        }
        if (logoRef.current) {
          logoRef.current.style.transform = `rotate(${logoAngleRef.current}deg)`;
        }

        // reset lastTime for next hover
        containerLastTimeRef.current = null;
        logoLastTimeRef.current = null;
      }

      animationFrame = requestAnimationFrame(updateRotation);
    };

    animationFrame = requestAnimationFrame(updateRotation);

    return () => cancelAnimationFrame(animationFrame);
  }, [hovering]);

  return (
    <div
      ref={containerRef}
      className={styles.container}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div ref={logoRef} className={styles.logoIcon} />
    </div>
  );
}