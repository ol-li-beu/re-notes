import React from "react";

export default function CanvasLayout({ children, }: { children: React.ReactNode; }) {
  return (
    <div
      style={{
              flex: 1,
              display: "flex",
              flexDirection: "column", 
              minHeight: 0,}}
    >
      {children}
    </div>
  );
}