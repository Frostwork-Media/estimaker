import { ReactNode } from "react";

import { cn } from "@/lib/utils";

type NodeType = "metaforecast" | "derivative" | "estimate";
import * as Popover from "@radix-ui/react-popover";
import { IconTrash } from "@tabler/icons-react";

import { useDeleteNode } from "@/lib/store";

import { IconButton } from "../ui/button";

export function Wrapper({
  children,
  variableName,
  label,
  selected,
  nodeType,
  id,
  hasError = false,
}: {
  children: ReactNode;
  variableName?: string;
  label: string;
  selected: boolean;
  nodeType: NodeType;
  id: string;
  hasError?: boolean;
}) {
  const deleteNode = useDeleteNode();

  return (
    <Popover.Root open={selected}>
      <Popover.Content
        align="start"
        side="left"
        sideOffset={10}
        onOpenAutoFocus={(e) => {
          e.preventDefault();
        }}
        className="shadow rounded-md"
      >
        <IconButton
          color="red"
          size="sm"
          icon={IconTrash}
          onClick={() => {
            deleteNode(id);
          }}
        />
      </Popover.Content>
      <Popover.Anchor
        className={cn(
          `text-center bg-background w-48 rounded-md shadow-md justify-items-start overflow-hidden`,
          {
            "w-64": nodeType === "metaforecast",
            "w-48": nodeType !== "metaforecast",
            "outline-2 outline outline-foreground/50": selected,
            // give a red outline to the node if it has an error
            "outline-2 outline-red-500 outline": hasError,
          }
        )}
      >
        <div className="grid p-1">
          {variableName && (
            <span
              className={cn(
                "text-[11px] text-white font-bold font-mono rounded-full min-w-[20px] px-1 h-5 flex leading-[20px] text-center justify-center absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2",
                {
                  "bg-indigo-600": nodeType === "estimate",
                  "bg-emerald-600": nodeType === "derivative",
                  "bg-orange-600": nodeType === "metaforecast",
                }
              )}
            >
              {variableName}
            </span>
          )}
          <h2 className="font-bold leading-tight pt-2 text-wrap-balance">
            {label}
          </h2>
        </div>
        {children}
      </Popover.Anchor>
    </Popover.Root>
  );
}
