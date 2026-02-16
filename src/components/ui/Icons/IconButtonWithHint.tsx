"use client";

import { useState, useRef, useLayoutEffect } from "react";
import { ICONSTYPE, IconName } from "@/utils/types";
import styles from "./iconbuttonwithhint.module.css";

import { createPortal } from "react-dom";

type Props = {
  iconName: IconName;
  description: string;
  size?: number;
  onClick?: () => void;
  disabled?: boolean;
};

export default function IconButtonWithHint({iconName, description, size = 20, onClick, disabled = false }: Props) {
  const IconComponent = ICONSTYPE[iconName];

  const [hover, setHover] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [tooltipWidth, setTooltipWidth] = useState(0);
  

  // measure width
  useLayoutEffect(() => {
  if (hover && tooltipRef.current) {
    const rect = tooltipRef.current.getBoundingClientRect();
    setTooltipWidth(rect.width);
  }
 }, [hover]);

  // calculate ReactFlowProviderlet leftPosition = pos.x + 8;
  let leftPosition = pos.x + 8;

  if (tooltipWidth) {
    const spaceRight = window.innerWidth - pos.x;

    if (spaceRight < tooltipWidth + 12) {
      leftPosition = pos.x - tooltipWidth - 8;
   }
  }

  return (
    <>
      <div
        className={`${styles.container} ${disabled ? styles.disabled : ""}`}
        onClick={!disabled ? onClick : undefined}
        onMouseEnter={() => !disabled && setHover(true)}
        onMouseLeave={() => setHover(false)}
        onMouseMove={(e) =>
          setPos({
            x: e.clientX,
            y: e.clientY,
          })
        }
        aria-disabled={disabled}
      >
        <IconComponent
          size={size}
          className={styles.icon}
          aria-hidden="true"
        />
      </div>

      {hover &&
        !disabled &&
        createPortal(
          <div
            ref={tooltipRef}
            className={styles.tooltip}
            style={{
                top: pos.y + 12,
                left: leftPosition,
            }}>
              {description}
          </div>, document.body
        )}
    </>
  );
}
