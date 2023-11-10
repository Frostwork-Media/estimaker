import { StoreProvider } from "@/components/StoreProvider";
import { Suspense } from "react";
import { Await, useLoaderData, useParams } from "react-router-dom";
import { ReactFlowProvider } from "reactflow";

function Project() {
  return <div>You made it!</div>;
}

export default function Page() {
  const data = useLoaderData() as { project: any };
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
