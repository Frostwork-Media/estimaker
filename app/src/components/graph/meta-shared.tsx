import { CSSProperties } from "react";

import { ProbabilityOption } from "@/lib/metaforecast-types";
import { cn } from "@/lib/utils";

const labelClasses = "text-left font-semibold text-[10px] text-neutral-600";

export function TwoOptions({ options }: { options: ProbabilityOption[] }) {
  return (
    <div className="flex items-center gap-2 mx-2">
      <span className={cn("text-left", labelClasses)}>{options[0].name}</span>
      <div
        className="bg-orange-200 inner flex-grow h-4 rounded text-[0px] relative overflow-hidden min-w-[50px]"
        style={{ "--probability": options[0].probability } as CSSProperties}
      >
        <div className="option-amount-fill rounded rounded-r-none" />
        {options[0].probability ? (
          <span className="rounded whitespace-nowrap text-[8px] font-bold absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-1/2">
            {Math.round(options[0].probability * 100)}%
          </span>
        ) : null}
      </div>
      <span className={labelClasses}>{options[1].name}</span>
    </div>
  );
}

export function MultiOption({
  options,
  hasLongOptionText,
}: {
  options: ProbabilityOption[];
  hasLongOptionText: boolean;
}) {
  return (
    <div
      className={cn("grid gap-y-3 px-2", {
        "grid-cols-[auto,minmax(0,1fr)]": !hasLongOptionText,
      })}
    >
      {options.map((option) => (
        <Option key={option.name} option={option} />
      ))}
    </div>
  );
}

export function Option({ option }: { option: ProbabilityOption }) {
  const optionProbability = option.probability ?? 0;
  return (
    <div className="grid gap-0.5">
      <span className={cn(labelClasses, "mr-2")}>{option.name}</span>
      <div
        className="bg-orange-200 mx-[1px] inner flex-grow h-4 rounded-sm text-[0px] relative overflow-hidden min-w-[50px]"
        style={{ "--probability": optionProbability } as CSSProperties}
      >
        <div className="option-amount-fill rounded-sm" />
      </div>
      {/* <span className="rounded p-1 min-w-[50px] text-center whitespace-nowrap text-xs">
        {Math.round(optionProbability * 100)}%
      </span> */}
    </div>
  );
}
