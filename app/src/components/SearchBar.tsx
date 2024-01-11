import * as Tabs from "@radix-ui/react-tabs";
import { IconLoader2 } from "@tabler/icons-react";
import clsx from "clsx";
import { Search } from "lucide-react";
import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { useReactFlow } from "reactflow";

import {
  useEstimateSearch,
  useManifoldSearch,
  useMetaforecastSearch,
} from "@/lib/queries";
import {
  useAddMetaforecastNode,
  useCreateEstimateNodeWithLink,
} from "@/lib/store";
import { useDebounce } from "@/lib/useDebounce";

const xPad = "px-4 md:px-6";

export function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const searchTermDebounced = useDebounce(searchTerm, 500);
  const { id } = useParams<{ id: string }>();
  if (!id) throw new Error("No id");

  const metaforecast = useMetaforecastSearch(searchTermDebounced);
  const userEstimates = useEstimateSearch(searchTermDebounced, id);
  const { data: manifold } = useManifoldSearch(searchTermDebounced);

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
    <Tabs.Root
      defaultValue="metaforecast"
      className="grid h-full content-start grid-rows-[auto_minmax(0,1fr)]"
    >
      <header
        className={clsx(
          "grid gap-6 py-4 bg-background z-10 border-b shadow",
          xPad
        )}
      >
        <div className="flex items-center gap-2">
          <Search className="opacity-50" />
          <input
            type="text"
            placeholder="Search"
            className="border-b-2 bg-transparent focus:outline-none focus:border-neutral-500 w-full tracking-tight"
            onChange={(event) => setSearchTerm(event.target.value)}
            value={searchTerm}
          />
        </div>
        <Tabs.List className="flex gap-3 justify-center">
          <TabTrigger value="metaforecast" results={metaforecast.data}>
            Metaforecast
          </TabTrigger>
          <TabTrigger value="manifold" results={manifold}>
            Manifold Markets
          </TabTrigger>
          <TabTrigger value="user-library" results={userEstimates.data}>
            User Library
          </TabTrigger>
        </Tabs.List>
      </header>
      <Tab value="user-library">
        <SearchGroup isLoading={userEstimates.isLoading}>
          {userEstimates.data?.map((estimate) => (
            <SearchResult
              key={estimate.id}
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
              {estimate.description}
            </SearchResult>
          ))}
        </SearchGroup>
      </Tab>
      <Tab value="metaforecast">
        <SearchGroup isLoading={metaforecast.isLoading}>
          {metaforecast.data?.map((question) => (
            <SearchResult
              key={question.id}
              onClick={() => {
                handleMetaforecast(question.id);
              }}
            >
              {question.title}
            </SearchResult>
          ))}
        </SearchGroup>
      </Tab>
      <Tab value="manifold">
        <SearchGroup isLoading={false}>
          {manifold?.map((market) => (
            <SearchResult key={market.id}>{market.question}</SearchResult>
          ))}
        </SearchGroup>
      </Tab>
    </Tabs.Root>
  );
}

function NoResults() {
  return <span className="text-sm text-neutral-500">No results</span>;
}

function Loading() {
  return <IconLoader2 className="animate-spin w-3 h-3" />;
}

function SearchGroup({
  isLoading,
  children,
}: {
  isLoading: boolean;
  children: React.ReactNode[] | undefined;
}) {
  const isLoadingOrNoResults = isLoading || (children && !children.length);
  return (
    <div
      className={clsx("grid", {
        "place-items-center h-full": isLoadingOrNoResults,
      })}
    >
      {isLoading ? <Loading /> : null}
      {children ? children.length ? children : <NoResults /> : null}
    </div>
  );
}

type SearchResultProps = React.HTMLAttributes<HTMLButtonElement>;

function SearchResult({
  children,
  className = "",
  ...props
}: SearchResultProps) {
  return (
    <button
      className={clsx(
        "text-sm text-left w-full border-b p-4 opacity-70 hover:opacity-100 hover:bg-neutral-100",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function TabTrigger({
  children,
  value,
  results,
}: {
  children: React.ReactNode;
  value: string;
  results: unknown[] | undefined;
}) {
  return (
    <Tabs.Trigger
      value={value}
      className="group text-sm text-neutral-500 aria-[selected=true]:text-black"
    >
      <span className="group-aria-[selected=true]:font-bold">{children}</span>
      {results ? <span className="ml-1">({results.length})</span> : null}
    </Tabs.Trigger>
  );
}

function Tab({
  children,
  value,
}: {
  children: React.ReactNode;
  value: string;
}) {
  return (
    <Tabs.Content value={value} className="overflow-auto">
      {children}
    </Tabs.Content>
  );
}
