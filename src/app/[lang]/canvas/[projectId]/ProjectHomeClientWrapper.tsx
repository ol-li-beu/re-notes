import { ReactFlowProvider } from "@xyflow/react";
import ProjectHomeClient, { ProjectHomeClientProps } from "./ProjectHomeClient";


export default function ProjectHomeClientWrapper(props: ProjectHomeClientProps) {
  return (
    <ReactFlowProvider>
      <ProjectHomeClient {...props} />
    </ReactFlowProvider>
  );
}