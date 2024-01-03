import { useUser } from "@clerk/clerk-react";
import { useRow } from "tinybase/debug/ui-react";

import { NODE_NAME_EDITOR_ID } from "@/lib/constants";

import {
  AnyNode,
  DerivativeNode,
  EstimateNode,
  Link,
  useCreateEstimateLink,
  useDeleteEstimateLink,
  useNodeLinks,
  useRenameNode,
  useUpdateDerivativeValue,
  useUpdateEstimateLink,
} from "../lib/store";
import { useClientStore } from "../lib/useClientStore";
import { SearchBar } from "./SearchBar";
import { SquiggleSidebar } from "./SquiggleSidebar";
import { Button } from "./ui/button";

export function Sidebar() {
  const selectedNodes = useClientStore((state) => state.selectedNodes);
  const sidebarTab = useClientStore((state) => state.sidebarTab);

  return (
    <aside>
      {selectedNodes.length === 1 ? (
        <SingleNodeEditor key={selectedNodes[0]} id={selectedNodes[0]} />
      ) : sidebarTab === "search" ? (
        <SearchBar />
      ) : sidebarTab === "squiggle" ? (
        <SquiggleSidebar />
      ) : null}
    </aside>
  );
}

function SingleNodeEditor({ id }: { id: string }) {
  const node = useRow("nodes", id) as AnyNode;

  // you would check if the current user has a value for this node, and give them the option to set it

  return (
    <div className="p-2 grid gap-2">
      {node.type === "estimate" && <EstimateForm node={node} id={id} />}
      {node.type === "derivative" && <DerivativeForm node={node} id={id} />}
    </div>
  );
}

function EstimateForm({ node, id }: { node: EstimateNode; id: string }) {
  const { user } = useUser();
  const clerkId = user?.id;
  const links = useNodeLinks(id) as [string, Link][];
  // check if the user has created an estimate yet
  const hasUserCreatedEstimate = links
    ? links.some(([_linkId, link]) => link.owner === clerkId)
    : true;
  const renameNode = useRenameNode();

  // Creation
  const createEstimate = useCreateEstimateLink();
  return (
    <>
      <textarea
        className="w-full p-2 border border-gray-300 rounded h-16 resize-none"
        id={NODE_NAME_EDITOR_ID}
        value={node.name as string}
        onChange={(e) => {
          renameNode({ id, name: e.target.value });
        }}
      />
      {!hasUserCreatedEstimate && (
        <button
          className="py-2 px-5 bg-blue-500 text-white rounded"
          onClick={() => {
            if (clerkId) {
              createEstimate({ nodeId: id, owner: clerkId });
              // Focus the input when it appears
              requestAnimationFrame(() => {
                const input = document.querySelector(
                  `[data-estimate-id="${id}-${clerkId}"]`
                );
                if (input) {
                  (input as HTMLInputElement).focus();
                }
              });
            }
          }}
        >
          Create Estimate
        </button>
      )}
      {links.map(([linkId, link]) => {
        return (
          <EstimateLink
            key={linkId}
            link={link}
            id={linkId}
            clerkId={clerkId}
          />
        );
      })}
    </>
  );
}

function EstimateLink({
  link,
  id,
  clerkId,
}: {
  link: Link;
  id: string;
  clerkId: string | undefined;
}) {
  const isOwner = link.owner === clerkId;
  const update = useUpdateEstimateLink();
  const deleteEstimate = useDeleteEstimateLink();
  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={link.value}
        disabled={!isOwner}
        className="w-full p-2 border border-gray-300 rounded resize-none disabled:opacity-50"
        data-estimate-id={link.nodeId + "-" + link.owner}
        onChange={(e) => {
          update({ id, value: e.target.value });
        }}
      />
      {isOwner ? (
        <Button
          color="red"
          onClick={() => {
            deleteEstimate({ id });
          }}
        >
          Delete
        </Button>
      ) : null}
    </div>
  );
}

// <img src={user?.imageUrl} className="w-8 h-8 rounded-full" />

function DerivativeForm({ node, id }: { node: DerivativeNode; id: string }) {
  const updateDerivativeValue = useUpdateDerivativeValue();
  const renameNode = useRenameNode();

  return (
    <div>
      <textarea
        className="w-full p-2 border border-gray-300 rounded h-16 resize-none"
        id={NODE_NAME_EDITOR_ID}
        value={node.name as string}
        onChange={(e) => {
          renameNode({ id, name: e.target.value });
        }}
      />
      <input
        type="text"
        value={node.value}
        className="w-full p-2 border border-gray-300 rounded resize-none disabled:opacity-50"
        onChange={(e) => {
          updateDerivativeValue({ id, value: e.target.value });
        }}
      />
    </div>
  );
}
