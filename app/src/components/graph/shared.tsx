import { ReactNode } from "react";

import { cn } from "@/lib/utils";

type NodeType = "metaforecast" | "derivative" | "estimate";

export function Wrapper({
  children,
  variableName,
  label,
  selected,
  nodeType,
}: {
  children: ReactNode;
  variableName?: string;
  label: string;
  selected: boolean;
  nodeType: NodeType;
}) {
  return (
    <div
      className={cn(
        `text-center bg-background w-48 rounded-md shadow-md justify-items-start overflow-hidden`,
        {
          "w-64": nodeType === "metaforecast",
          "w-48": nodeType !== "metaforecast",
          "outline-2 outline outline-foreground/50": selected,
        }
      )}
    >
      <div className="grid p-1">
        {variableName && (
          <span
            className={cn(
              "text-[8px] text-white font-bold font-mono rounded-full w-5 h-5 flex leading-[20px] text-center justify-center absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2",
              {
                "bg-black": nodeType === "estimate",
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
    </div>
  );
}
