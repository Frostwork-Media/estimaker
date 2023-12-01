import type { Project as P } from "db";
import { Suspense } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Await, useLoaderData, useParams } from "react-router-dom";
import { ReactFlowProvider } from "reactflow";
import { useTables } from "tinybase/debug/ui-react";

import { Canvas } from "@/components/Canvas";
import { ProjectNav } from "@/components/ProjectNav";
import { Sidebar } from "@/components/Sidebar";
import { SquiggleContext } from "@/components/SquiggleProvider";
import { StoreProvider } from "@/components/StoreProvider";
import { useAvatar, useUser, useUserPresence } from "@/lib/hooks";
import { Tables } from "@/lib/store";
import { toNodesAndEdges } from "@/lib/toNodesAndEdges";
import { useClientStore } from "@/lib/useClientStore";
import { useSquiggleCode } from "@/lib/useSquiggleCode";
import { useSquiggleRunResult } from "@/lib/useSquiggleRunResult";

function Project() {
  const tables = useTables();

  // Stores the users avatar in the store
  useAvatar();

  const selectedNodes = useClientStore((state) => state.selectedNodes);
  const nodesAndEdges = toNodesAndEdges(tables as Tables, selectedNodes);
  const { edges } = nodesAndEdges;
  const user = useUser();
  const code = useSquiggleCode(tables, edges, user.id);
  const sidebarTab = useClientStore((state) => state.sidebarTab);
  const showSidebar = !!sidebarTab || selectedNodes.length === 1;

  const runResult = useSquiggleRunResult(code);

  let { nodes } = nodesAndEdges;
  if (runResult.variableWithErrorName) {
    nodes = nodes.map((node) => {
      if (node.data.variableName === runResult.variableWithErrorName) {
        return {
          ...node,
          data: {
            ...node.data,
            hasError: true,
          },
        };
      }
      return node;
    });
  }

  return (
    <SquiggleContext.Provider value={{ ...runResult, code }}>
      <div className="w-screen h-screen grid grid-rows-[auto_minmax(0,1fr)]">
        <ProjectNav />
        <PanelGroup direction="horizontal" autoSaveId="estimaker-size">
          <Panel defaultSize={80} order={1}>
            <Canvas nodes={nodes} edges={edges} />
          </Panel>
          {showSidebar && (
            <>
              <PanelResizeHandle className="w-2 h-full bg-background border-x border-neutral-300" />
              <Panel className="bg-background" order={2}>
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
          return (
            <StoreProvider
              id={id}
              initial={JSON.stringify(project.state)}
              presence={presence}
            >
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
