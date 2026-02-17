import { ReactFlowProvider } from "@xyflow/react";
import CanvasClient, { CanvasClientProps } from "./CanvasClient";


export default function CanvasClientWrapper(props: CanvasClientProps) {
  return (
    <ReactFlowProvider>
      <CanvasClient {...props} />
    </ReactFlowProvider>
  );
}