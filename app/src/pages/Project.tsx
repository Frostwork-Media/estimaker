import { Canvas } from "@/components/Canvas";
import { StoreProvider } from "@/components/StoreProvider";
import { Tables } from "@/lib/store";
import { toNodesAndEdges } from "@/lib/toNodesAndEdges";
import { Project as P } from "db/types";
import { Suspense } from "react";
import { Await, useLoaderData, useParams } from "react-router-dom";
import { ReactFlowProvider } from "reactflow";
import { useTables } from "tinybase/debug/ui-react";

function Project() {
  const tables = useTables();
  const { nodes, edges } = toNodesAndEdges(tables as Tables);
  return (
    <div className="w-screen h-screen">
      <Canvas nodes={nodes} edges={edges} />
    </div>
  );
}

export default function Page() {
  const data = useLoaderData() as { project: P };
  const { id } = useParams<{ id: string }>();
  if (!id) throw new Error("No ID provided");

  return (
    <Suspense fallback={<div>Loading project...</div>}>
      <Await
        resolve={data.project}
        errorElement={<p>We had trouble finding your project.</p>}
      >
        {(project) => {
          return (
            <StoreProvider id={id} initial={JSON.stringify(project.state)}>
              <ReactFlowProvider>
                <Project />
              </ReactFlowProvider>
            </StoreProvider>
          );
        }}
      </Await>
    </Suspense>
  );
}
