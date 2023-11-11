import type { Project as P } from "db";
import { Suspense } from "react";
import { Await, useLoaderData, useParams } from "react-router-dom";
import { ReactFlowProvider } from "reactflow";
import { useTables } from "tinybase/debug/ui-react";

import { Canvas } from "@/components/Canvas";
import { SquiggleProvider } from "@/components/SquiggleProvider";
import { StoreProvider } from "@/components/StoreProvider";
import { useUser } from "@/lib/hooks";
import { Tables } from "@/lib/store";
import { toNodesAndEdges } from "@/lib/toNodesAndEdges";
import { useSquiggleCode } from "@/lib/useSquiggleCode";

function Project() {
  const tables = useTables();
  const { nodes, edges } = toNodesAndEdges(tables as Tables);
  const user = useUser();
  const squiggleCode = useSquiggleCode(tables, edges, user.id);

  return (
    <SquiggleProvider code={squiggleCode}>
      <div className="w-screen h-screen">
        <Canvas nodes={nodes} edges={edges} />
      </div>
    </SquiggleProvider>
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
