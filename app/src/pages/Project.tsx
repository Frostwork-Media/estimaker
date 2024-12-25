import type { Project as P } from "db";
import { useEffect, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Await, useLoaderData, useParams } from "react-router-dom";
import { ReactFlowProvider } from "reactflow";
import { useTables } from "tinybase/debug/ui-react";

import { Canvas } from "@/components/Canvas";
import { ProjectProvider } from "@/components/ProjectContextProvider";
import { ProjectNav } from "@/components/ProjectNav";
import { Sidebar } from "@/components/Sidebar";
import { SquiggleContext } from "@/components/SquiggleProvider";
import { StoreProvider } from "@/components/StoreProvider";
import { VariablesTable } from "@/components/VariablesTable";
import { createMedianStore, MedianStore } from "@/lib/createMedianStore";
import { useAvatar, useUser, useUserPresence } from "@/lib/hooks";
import { Tables } from "@/lib/store";
import {
  createEdges,
  createNodes,
  createVariableToNodeId,
} from "@/lib/toNodesAndEdges";
import { useClientStore } from "@/lib/useClientStore";
import { useCursorsStore } from "@/lib/useCursorsStore";
import { useSelectedNodeType } from "@/lib/useSelectedNodeType";
import { useSquiggleCode } from "@/lib/useSquiggleCode";
import { useSquiggleRunResult } from "@/lib/useSquiggleRunResult";

function Project({ id }: { id: string }) {
  const tables = useTables();

  // Stores the users avatar in the store
  useAvatar();

  const selectedNodes = useClientStore((state) => state.selectedNodes);
  const nodeType = useSelectedNodeType(selectedNodes?.[0]);

  const variableToNodeId = createVariableToNodeId(tables as Tables);
  const edges = createEdges(variableToNodeId, (tables as Tables).nodes);

  // const nodesAndEdges = toNodesAndEdges(tables as Tables, selectedNodes);

  const user = useUser();
  const code = useSquiggleCode(tables, edges, user.id);
  const sidebarTab = useClientStore((state) => state.sidebarTab);
  const showSidebar =
    !!sidebarTab || (selectedNodes.length === 1 && nodeType !== "image");
  
  // If a node is selected, override the sidebar tab
  useEffect(() => {
    if (selectedNodes.length === 1 && nodeType !== "image") {
      useClientStore.setState({ sidebarTab: undefined });
    }
  }, [selectedNodes, nodeType]);

  const runResult = useSquiggleRunResult(code);

  // Add Medians to Nodes, Temporary Solution
  // until we can get the median directly from single run
  const [medianStore, setMedianStore] = useState<MedianStore>({});
  const effectProps = JSON.stringify({ tables, edges });
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { tables, _edges } = JSON.parse(effectProps);
    createMedianStore(tables as Tables)
      .then(setMedianStore)
      .catch(console.error);
  }, [effectProps]);

  const cursors = useCursorsStore((state) => state.cursors);

  const nodes = createNodes({
    state: tables as Tables,
    selectedNodes,
    variableWithErrorName: runResult.variableWithErrorName,
    medianStore,
    cursors,
  });

  const [showTable, setShowTable] = useState(false);

  return (
    <SquiggleContext.Provider value={{ ...runResult, code }}>
      <div className="w-screen h-screen grid grid-rows-[auto_minmax(0,1fr)]">        <ProjectNav id={id} setShowTable={setShowTable} showTable={showTable} />
        <PanelGroup direction="horizontal" autoSaveId="estimaker-size">
          <Panel defaultSize={80} order={1} id="canvas">
            <Canvas nodes={nodes} edges={edges} id={id} />
          </Panel>
          {showSidebar && (
            <>
              <PanelResizeHandle className="w-2 h-full bg-background border-x border-neutral-300" />
              <Panel className="bg-background" order={2} id="sidebar">
                {sidebarTab === "variables" ? <VariablesTable /> : <Sidebar />}
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
  const isReady = useClientStore((state) => state.isReady);

  return (
    <Await
      resolve={data.project}
      errorElement={<p>We had trouble finding your project.</p>}
    >
      {(project) => {
        if (!project)
          return <div>An error occurred loading project. Please refresh.</div>;

        return (
          <ProjectProvider initialProject={project}>
            <StoreProvider
              id={id}
              initial={JSON.stringify(project.state)}
              presence={presence}
            >
              {isReady && (
                <ReactFlowProvider>
                  <Project key={project.id} id={project.id} />
                </ReactFlowProvider>
              )}
            </StoreProvider>
          </ProjectProvider>
        );
      }}
    </Await>
  );
}
