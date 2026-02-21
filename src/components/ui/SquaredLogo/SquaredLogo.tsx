"use client";

import { useEffect, useRef, useCallback } from "react";
import styles from "./squaredlogo.module.css";

const CONTAINER_SPEED = 360 / 7;
const LOGO_SPEED = 360 / 4;
const SPIKE_SPEED = 360 * 3;
const SPIKE_DURATION = 0.4;
const DECEL_RATE = 60; 

export default function SquaredLogo() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  const ringAngleRef = useRef(0);
  const logoAngleRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);

  const hoveringRef = useRef(false);
  const spikeRef = useRef(0);
  const decelerationRef = useRef(0); 

  const handleMouseEnter = useCallback(() => {
    hoveringRef.current = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    hoveringRef.current = false;
  }, []);

  const handleClick = useCallback(() => {
    if (hoveringRef.current) {
      spikeRef.current = SPIKE_DURATION;
    }
  }, []);

  useEffect(() => {
    let animationFrame: number;

    const tick = (timestamp: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp;
      }

      const rawDelta = (timestamp - lastTimeRef.current) / 1000;
      const delta = Math.min(rawDelta, 0.05); 
      lastTimeRef.current = timestamp;

      const isHovering = hoveringRef.current;

      if (isHovering) {
        // ring goes clockwise
        ringAngleRef.current = (ringAngleRef.current + CONTAINER_SPEED * delta) % 360;

        // logo speed: base + spike
        let logoSpeedNow = LOGO_SPEED;

        if (spikeRef.current > 0) {
          spikeRef.current = Math.max(0, spikeRef.current - delta);
          const t = spikeRef.current / SPIKE_DURATION;
          logoSpeedNow += SPIKE_SPEED * t;
        }

        decelerationRef.current = logoSpeedNow;

        logoAngleRef.current = (logoAngleRef.current - logoSpeedNow * delta + 360) % 360;

      } else {
        if (decelerationRef.current > 0) {
          decelerationRef.current = Math.max(
          0,
          decelerationRef.current - DECEL_RATE * delta
          );
          logoAngleRef.current =
          (logoAngleRef.current - decelerationRef.current * delta + 360) % 360;
        }
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `rotate(${ringAngleRef.current}deg)`;
      }
      if (logoRef.current) {
        logoRef.current.style.transform = `rotate(${logoAngleRef.current}deg)`;
      }

      animationFrame = requestAnimationFrame(tick);
    };

    animationFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={styles.wrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <div ref={ringRef} className={styles.ring} />
      <div ref={logoRef} className={styles.logoIcon} />
    </div>
  );
}