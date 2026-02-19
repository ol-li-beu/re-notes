import { ReactFlowProvider } from "@xyflow/react";
import { Suspense } from "react";

import CanvasClient, { CanvasClientProps } from "./CanvasClient";



export default function CanvasClientWrapper(props: CanvasClientProps) {
  return (
   <Suspense>
    <ReactFlowProvider>
      <CanvasClient {...props} />
    </ReactFlowProvider>
   </Suspense>
  );
}