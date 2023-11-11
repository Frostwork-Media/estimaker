import { useUser } from "@clerk/clerk-react";
import { useRow, useValue } from "tinybase/debug/ui-react";

import {
  AnyNode,
  DerivativeNode,
  EstimateNode,
  Link,
  useCreateEstimateLink,
  useNodeLinks,
  useRenameNode,
  useUpdateDerivativeValue,
  useUpdateEstimateLink,
  useUpdateProjectName,
} from "../lib/store";
import { useClientStore } from "../lib/useClientStore";
import { SquiggleSidebar } from "./SquiggleSidebar";

export function CanvasSidebar() {
  const selectedNodes = useClientStore((state) => state.selectedNodes);
  return (
    <aside className="w-[600px] overflow-auto grid gap-2 bg-white p-2 shadow-lg">
      {selectedNodes.length === 1 ? (
        <SingleNodeEditor key={selectedNodes[0]} id={selectedNodes[0]} />
      ) : (
        <ProjectEditor />
      )}
      <SquiggleSidebar />
    </aside>
  );
}

function ProjectEditor() {
  const projectName = useValue("name");
  const updateProjectName = useUpdateProjectName();
  return (
    <div className="grid gap-2 p-2">
      <input
        type="text"
        value={projectName as string}
        className="w-full p-2 border border-gray-300 rounded"
        onChange={(e) => {
          updateProjectName(e.target.value);
        }}
      />
    </div>
  );
}

function SingleNodeEditor({ id }: { id: string }) {
  const renameNode = useRenameNode();
  const node = useRow("nodes", id) as AnyNode;

  // you would check if the current user has a value for this node, and give them the option to set it

  return (
    <div className="p-2 grid gap-2">
      <textarea
        className="w-full p-2 border border-gray-300 rounded h-16 resize-none"
        value={node.name as string}
        onChange={(e) => {
          renameNode({ id, name: e.target.value });
        }}
      />
      {node.type === "estimate" && <EstimateForm node={node} id={id} />}
      {node.type === "derivative" && <DerivativeForm node={node} id={id} />}
    </div>
  );
}

function EstimateForm({ node: _, id }: { node: EstimateNode; id: string }) {
  const { user } = useUser();
  const clerkId = user?.id;
  const links = useNodeLinks(id) as [string, Link][];
  // check if the user has created an estimate yet
  const hasUserCreatedEstimate = links
    ? links.some(([_linkId, link]) => link.owner === clerkId)
    : true;

  // Creation
  const createEstimate = useCreateEstimateLink();
  return (
    <>
      {!hasUserCreatedEstimate && (
        <button
          className="py-2 px-5 bg-blue-500 text-white rounded"
          onClick={() => {
            if (clerkId) createEstimate({ nodeId: id, owner: clerkId });
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
  return (
    <input
      type="text"
      value={link.value}
      disabled={!isOwner}
      className="w-full p-2 border border-gray-300 rounded resize-none disabled:opacity-50"
      onChange={(e) => {
        update({ id, value: e.target.value });
      }}
    />
  );
}

// <img src={user?.imageUrl} className="w-8 h-8 rounded-full" />

function DerivativeForm({ node, id }: { node: DerivativeNode; id: string }) {
  const updateDerivativeValue = useUpdateDerivativeValue();
  return (
    <div>
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
