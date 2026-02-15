"use client";

import { useState } from "react";
import { ICONSTYPE, IconName } from "@/utils/types";
import styles from "./iconbuttonwithhint.module.css";

import { createPortal } from "react-dom";

type Props = {
  iconName: IconName;
  description: string;
  size?: number;
  onClick?: () => void;
};

export default function IconButtonWithHint({iconName, description, size = 18, onClick, }: Props) {
  const IconComponent = ICONSTYPE[iconName];

  const [hover, setHover] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  return (
    <>
      <div
        className={styles.container}
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onMouseMove={(e) =>
          setPos({
            x: e.clientX,
            y: e.clientY,
          })
        }
      >
        <IconComponent
          size={size}
          className={styles.icon}
          aria-hidden="true"
        />
      </div>

      {hover &&
      
  createPortal(
    <div
      className={styles.tooltip}
      style={{
        top: pos.y + 4,
        left: pos.x + 4,
      }}
    >
      {description}
    </div>,
    document.body
    )}
    </>
  );
}
