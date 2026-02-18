import React from "react";

export default function CanvasLayout({ children, }: { children: React.ReactNode; }) {

  // load node data from supabase and store. props down to the client wrapper call set flow there to mount
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