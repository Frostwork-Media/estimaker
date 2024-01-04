import type { Project as P } from "db";
import { Suspense, useEffect, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Await, useLoaderData, useParams } from "react-router-dom";
import { ReactFlowProvider } from "reactflow";
import { useTables } from "tinybase/debug/ui-react";

import { Canvas } from "@/components/Canvas";
import { ProjectNav } from "@/components/ProjectNav";
import { Sidebar } from "@/components/Sidebar";
import { SquiggleContext } from "@/components/SquiggleProvider";
import { StoreProvider } from "@/components/StoreProvider";
import { createMedianStore, MedianStore } from "@/lib/createMedianStore";
import { useAvatar, useUser, useUserPresence } from "@/lib/hooks";
import { Tables } from "@/lib/store";
import {
  createEdges,
  createNodes,
  createVariableToNodeId,
} from "@/lib/toNodesAndEdges";
import { useClientStore } from "@/lib/useClientStore";
import { useSquiggleCode } from "@/lib/useSquiggleCode";
import { useSquiggleRunResult } from "@/lib/useSquiggleRunResult";

function Project({ id }: { id: string }) {
  const tables = useTables();

  // Stores the users avatar in the store
  useAvatar();

  const selectedNodes = useClientStore((state) => state.selectedNodes);

  const variableToNodeId = createVariableToNodeId(tables as Tables);
  const edges = createEdges(variableToNodeId, (tables as Tables).nodes);

  // const nodesAndEdges = toNodesAndEdges(tables as Tables, selectedNodes);

  const user = useUser();
  const code = useSquiggleCode(tables, edges, user.id);
  const sidebarTab = useClientStore((state) => state.sidebarTab);
  const showSidebar = !!sidebarTab || selectedNodes.length === 1;

  const runResult = useSquiggleRunResult(code);

  // Add Medians to Nodes, Temporary Solution
  // until we can get the median directly from single run
  const [medianStore, setMedianStore] = useState<MedianStore>({});
  const effectProps = JSON.stringify({ tables, edges });
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { tables, edges } = JSON.parse(effectProps);
    createMedianStore(tables as Tables, edges)
      .then(setMedianStore)
      .catch(console.error);
  }, [effectProps]);

  const nodes = createNodes({
    state: tables as Tables,
    selectedNodes,
    variableWithErrorName: runResult.variableWithErrorName,
    medianStore,
  });

  return (
    <SquiggleContext.Provider value={{ ...runResult, code }}>
      <div className="w-screen h-screen grid grid-rows-[auto_minmax(0,1fr)]">
        <ProjectNav id={id} />
        <PanelGroup direction="horizontal" autoSaveId="estimaker-size">
          <Panel defaultSize={80} order={1} id="canvas">
            <Canvas nodes={nodes} edges={edges} id={id} />
          </Panel>
          {showSidebar && (
            <>
              <PanelResizeHandle className="w-2 h-full bg-background border-x border-neutral-300" />
              <Panel className="bg-background" order={2} id="sidebar">
                <Sidebar />
              </Panel>
            </>
          )}
        </PanelGroup>
      </div>
    </SquiggleContext.Provider>
  );
}

export default function Page() {
  const data = useLoaderData() as { project: P };
  const { id } = useParams<{ id: string }>();
  if (!id) throw new Error("No ID provided");
  const presence = useUserPresence();

  return (
    <Suspense fallback={<div>Loading project...</div>}>
      <Await
        resolve={data.project}
        errorElement={<p>We had trouble finding your project.</p>}
      >
        {(project) => {
          console.log("Project", project);
          console.log("Id", id);
          return (
            <StoreProvider
              id={id}
              initial={JSON.stringify(project.state)}
              presence={presence}
            >
              <ReactFlowProvider>
                <Project key={project.id} id={project.id} />
              </ReactFlowProvider>
            </StoreProvider>
          );
        }}
      </Await>
    </Suspense>
  );
}
