import { ReactNode } from "react";

import { cn } from "@/lib/utils";

const colors = {
  indigo: "text-blue-500",
  emerald: "text-emerald-500",
  metaforecast: "bg-orange-100 text-foreground",
};

const bgColors = {
  indigo: "bg-blue-600",
  emerald: "bg-emerald-600",
  metaforecast: "bg-orange-600",
};

export function Wrapper({
  children,
  color,
  variableName,
  label,
  selected,
  nodeType,
}: {
  children: ReactNode;
  color: keyof typeof colors;
  variableName?: string;
  label: string;
  selected: boolean;
  nodeType: "metaforecast" | "derivative" | "estimate";
}) {
  return (
    <div
      className={cn(
        `text-left bg-background grid p-2 w-48 ${
          colors[color]
        } justify-items-start ${selected ? "outline-4 outline" : ""}`,
        {
          "w-64": nodeType === "metaforecast",
          "w-48": nodeType !== "metaforecast",
        }
      )}
    >
      {variableName && (
        <span
          className={`text-[10px] text-white ${bgColors[color]} font-bold rounded-full w-5 h-5 flex leading-[20px] text-center justify-center absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2`}
        >
          {variableName}
        </span>
      )}
      <h2 className="font-bold leading-tight">{label}</h2>
      {children}
    </div>
  );
}
