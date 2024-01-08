import "reactflow/dist/style.css";

import usePartySocket from "partysocket/react";
import { useEffect, useRef } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  Node,
  NodeTypes,
  Panel,
  SelectionMode,
  useReactFlow,
} from "reactflow";
import { useStore } from "tinybase/debug/ui-react";

import { NODE_NAME_EDITOR_ID } from "@/lib/constants";
import { useUserPresence } from "@/lib/hooks";
import { useCanvasKeybinds } from "@/lib/useCanvasKeybinds";
import { removeUser, setUserPosition } from "@/lib/useCursorsStore";

import {
  useAddDerivativeNode,
  useAddEstimateNode,
  useConnectNodes,
  useDeleteNode,
  useMoveNode,
  useResizeImageNode,
} from "../lib/store";
import { useClientStore } from "../lib/useClientStore";
import { CursorNode } from "./graph/CursorNode";
import { DerivativeNode } from "./graph/DerivativeNode";
import { EstimateNode } from "./graph/EstimateNode";
import { ImageNode } from "./graph/ImageNode";
import { MetaforecastNode } from "./graph/MetaforecastNode";
import { MultiSelectToolbar } from "./MultiSelectToolbar";

const nodeTypes: NodeTypes = {
  estimate: EstimateNode,
  derivative: DerivativeNode,
  metaforecast: MetaforecastNode,
  image: ImageNode,
  cursor: CursorNode,
};

type CursorMessage =
  | {
      type: "move";
      position: { x: number; y: number };
      id: string;
    }
  | {
      type: "disconnect";
      id: string;
    };

export function Canvas({
  nodes,
  edges,
  id,
}: {
  nodes: Node[];
  edges: Edge[];
  id: string;
}) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useReactFlow();
  const presence = useUserPresence();

  const store = useStore();

  const addEstimateNode = useAddEstimateNode();
  const addDerivativeNode = useAddDerivativeNode();
  const moveNode = useMoveNode();
  const connectingNodeId = useRef<string | null>(null);
  const deleteNode = useDeleteNode();
  const resizeImageNode = useResizeImageNode();

  const connectNodes = useConnectNodes();

  useCanvasKeybinds();

  // This is a separate party just for cursors
  const socket = usePartySocket({
    host: import.meta.env.VITE_PARTYKIT_HOST,
    room: id,
    id: presence.id,
    party: "cursors",
    onMessage(event) {
      try {
        const message = JSON.parse(event.data) as CursorMessage;
        switch (message.type) {
          case "move": {
            if (message.id === presence.id) return;
            setUserPosition(message.id, message.position.x, message.position.y);
            break;
          }
          case "disconnect": {
            removeUser(message.id);
            break;
          }
        }
      } catch (error) {
        console.error("Error parsing cursor message", error);
      }
    },
  });

  // Bind to the mouse movement to capture the users cursor position
  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);

    function onMouseMove(event: MouseEvent) {
      if (!reactFlowInstance || !socket) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const m: CursorMessage = {
        type: "move",
        position,
        id: presence.id,
      };

      socket.send(JSON.stringify(m));
    }
  }, [presence.id, reactFlowInstance, socket]);

  return (
    <div className="w-full h-full bg-neutral-100" ref={reactFlowWrapper}>
      <ReactFlow
        fitView
        proOptions={{
          hideAttribution: true,
        }}
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        zoomOnDoubleClick={false}
        selectionMode={SelectionMode.Partial}
        onNodeDoubleClick={(event, node) => {
          event.stopPropagation();
          event.preventDefault();

          if (!node) return;

          useClientStore.setState({
            selectedNodes: [node.id],
          });

          requestAnimationFrame(() => {
            // focus the node name editor
            const nameEditor = document.getElementById(NODE_NAME_EDITOR_ID);
            if (!nameEditor) return;
            nameEditor.focus();
          });
        }}
        selectNodesOnDrag={false}
        nodesFocusable={false}
        selectionOnDrag={false}
        snapToGrid={true}
        snapGrid={[16, 16]}
        onNodesChange={(changes) => {
          for (const change of changes) {
            switch (change.type) {
              case "position": {
                if (change.position) {
                  moveNode({
                    id: change.id,
                    x: change.position.x,
                    y: change.position.y,
                  });
                }
                break;
              }
              case "select": {
                useClientStore.setState((state) => ({
                  ...state,
                  selectedNodes: change.selected
                    ? change.id in state.selectedNodes
                      ? state.selectedNodes
                      : [...state.selectedNodes, change.id]
                    : state.selectedNodes.filter((id) => id !== change.id),
                }));
                break;
              }
              case "dimensions": {
                if (!change.dimensions) break;
                resizeImageNode({
                  id: change.id,
                  width: change.dimensions.width,
                  height: change.dimensions.height,
                });
                break;
              }
              default: {
                console.log("Unhandled Change", change);
              }
            }
          }
        }}
        onPaneClick={() => {
          useClientStore.setState({ selectedNodes: [], sidebarTab: undefined });
        }}
        onDoubleClick={(event) => {
          const targetIsPane =
            event.currentTarget.classList.contains("react-flow");
          if (!targetIsPane) return;

          if (!reactFlowWrapper.current) return;

          const { top, left } =
            reactFlowWrapper.current.getBoundingClientRect();

          addEstimateNode(
            reactFlowInstance.project({
              x: event.clientX - left,
              y: event.clientY - top,
            })
          );

          requestAnimationFrame(() => {
            // focus the node name editor
            const nameEditor = document.getElementById(NODE_NAME_EDITOR_ID);
            if (!nameEditor) return;
            nameEditor.focus();
          });
        }}
        onConnectStart={(_, { nodeId }) => {
          connectingNodeId.current = nodeId;
        }}
        onConnect={(params) => {
          // Unset connecting node
          connectingNodeId.current = null;

          const { source, target } = params;
          if (!source || !target) return;

          connectNodes({
            source,
            target,
          });
        }}
        onConnectEnd={(event) => {
          if (!store) return;

          if (!event.target) return;

          const targetIsPane = (event.target as HTMLElement).classList.contains(
            "react-flow__pane"
          );

          if (!targetIsPane) return;

          const sourceId = connectingNodeId.current;
          if (!sourceId) return;

          if (!reactFlowWrapper.current) return;
          const { top, left } =
            reactFlowWrapper.current.getBoundingClientRect();

          const initialContent =
            store.getCell("nodes", sourceId, "variableName")?.toString() || "";

          let x, y;

          if (event instanceof MouseEvent) {
            x = event.clientX - left;
            y = event.clientY - top;
          } else {
            const touch = event.touches[0];
            x = touch.clientX - left;
            y = touch.clientY - top;
          }

          addDerivativeNode({
            initialContent,
            ...reactFlowInstance.project({ x, y }),
          });

          connectingNodeId.current = null;

          requestAnimationFrame(() => {
            // focus the node name editor
            const nameEditor = document.getElementById(NODE_NAME_EDITOR_ID);
            if (!nameEditor) return;
            nameEditor.focus();
          });
        }}
        onNodesDelete={(nodes) => {
          for (const node of nodes) {
            deleteNode(node.id);
          }
          useClientStore.setState({ selectedNodes: [] });
        }}
      >
        <Controls />
        <Background
          variant={BackgroundVariant.Lines}
          gap={16}
          color="#e8e9e9"
        />
        <MultiSelectToolbar />
        <Panel position="top-center" className="!pointer-events-none">
          <span className="text-neutral-300 select-none font-bold">
            Double-click to create a new node
          </span>
        </Panel>
      </ReactFlow>
    </div>
  );
}
