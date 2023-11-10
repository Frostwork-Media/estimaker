import { Suspense } from "react";
import { Await, useLoaderData, useParams } from "react-router-dom";

function Project(props) {
  console.log(props);
  return <div>hi there</div>;
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
          return <Project project={project} />;
          // return (
          //   <StoreProvider roomId={roomId} initialData={initialData}>
          //     <ReactFlowProvider>
          //       <LivingRoom />
          //     </ReactFlowProvider>
          //   </StoreProvider>
          // );
        }}
      </Await>
    </Suspense>
  );
}
