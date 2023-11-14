import { IconLoader2 } from "@tabler/icons-react";
import debounce from "lodash.debounce";
import { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useReactFlow } from "reactflow";

import { useEstimateSearch, useMetaforecastSearch } from "@/lib/queries";
import {
  useAddMetaforecastNode,
  useCreateEstimateNodeWithLink,
} from "@/lib/store";

export function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const debounceSearchTerm = useMemo(() => debounce(setSearchTerm, 500), []);
  const { id } = useParams<{ id: string }>();
  if (!id) throw new Error("No id");

  const metaforecast = useMetaforecastSearch(searchTerm);
  const userEstimates = useEstimateSearch(searchTerm, id);

  const { project } = useReactFlow();
  const addMetaforecastNode = useAddMetaforecastNode();
  const handleMetaforecast = useCallback(
    (slug: string) => {
      let x = 0,
        y = 0;
      const pane = document.querySelector(".react-flow__pane");
      if (pane) {
        // find the center of it
        const rect = pane.getBoundingClientRect();
        const _x = rect.left + rect.width / 2;
        const _y = rect.top + rect.height / 2;
        const projection = project({ x: _x, y: _y });
        x = projection.x;
        y = projection.y;
      }

      // add the node
      addMetaforecastNode({ slug, x, y });
    },
    [addMetaforecastNode, project]
  );

  const createEstimateNodeWithLink = useCreateEstimateNodeWithLink();

  return (
    <div className="p-4 grid gap-2">
      <input
        type="text"
        placeholder="Search"
        className="border-b bg-transparent focus:outline-none focus:border-neutral-500 w-full"
        onChange={(event) => debounceSearchTerm(event.target.value)}
      />
      <div className="flex gap-2 items-center mt-4">
        <h3 className="font-bold ">Library</h3>
        {userEstimates.isLoading ? <Loading /> : null}
      </div>
      <div className="grid max-h-[400px] overflow-auto border rounded-md">
        {userEstimates.data?.length ? (
          userEstimates.data?.map((estimate) => (
            <button
              key={estimate.id}
              className="text-sm text-left w-full border-b p-2 opacity-70 hover:opacity-100 hover:bg-neutral-100"
              onClick={() => {
                createEstimateNodeWithLink({
                  description: estimate.description,
                  estimateId: estimate.id,
                  ownerId: estimate.ownerId,
                  value: estimate.value,
                  x: 0,
                  y: 0,
                });
              }}
            >
              <span>{estimate.description}</span>
            </button>
          ))
        ) : (
          <NoResults />
        )}
      </div>
      <div className="flex gap-2 items-center mt-4">
        <h3 className="font-bold ">Metaforecast</h3>
        {metaforecast.isLoading ? <Loading /> : null}
      </div>
      <div className="grid max-h-[400px] overflow-auto border rounded-md">
        {metaforecast.data?.length ? (
          metaforecast.data?.map((question) => (
            <button
              key={question.id}
              className="text-sm text-left w-full border-b p-2 opacity-70 hover:opacity-100 hover:bg-neutral-100"
              onClick={() => {
                handleMetaforecast(question.id);
              }}
            >
              <span>{question.title}</span>
            </button>
          ))
        ) : (
          <NoResults />
        )}
      </div>
    </div>
  );
}

function NoResults() {
  return <div className="text-neutral-300 font-bold p-2">No Results</div>;
}

function Loading() {
  return <IconLoader2 className="animate-spin w-3 h-3" />;
}
