import { ReactFlow } from "@xyflow/react"
import Navbar  from "@/components/layout/Navbar/Navbar"
import { Footer } from "@/components/layout/Footer/Footer"

<div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
  <Navbar dict="s" lang="s" user=""/>
  <div style={{ flex: 1, minHeight: 0 }}>
    <ReactFlow />
  </div>
  <Footer dict={""}/>
</div>