import { IconChevronRight } from "@tabler/icons-react";
import { CSSProperties, useMemo } from "react";
import { NodeProps } from "reactflow";

import { ProbabilityOption } from "@/lib/metaforecast-types";
import { useMetaforecastQuestion } from "@/lib/queries";
import { cn } from "@/lib/utils";

import { Wrapper } from "./shared";

export function MetaforecastNode(props: NodeProps) {
  const question = useMetaforecastQuestion(props.data.slug);
  /** We check if the option text is really long and move bars to the bottom if so */
  const hasLongOptionText = useMemo(() => {
    if (!question.data?.options.length) return false;
    return question.data.options.some(
      (option) => option.name && option.name.length > 20
    );
  }, [question.data?.options]);
  return (
    <Wrapper
      color="metaforecast"
      label={question.data?.title ?? ""}
      selected={props.selected}
      variableName={props.data.variableName}
      nodeType="metaforecast"
    >
      <div className="mt-4 grid gap-1 w-full">
        {question.data?.options.length ? (
          <div
            className={cn("grid gap-y-2", {
              "grid-cols-[auto,minmax(0,1fr)]": !hasLongOptionText,
            })}
          >
            {question.data.options.map((option) => (
              <Option key={option.name} option={option} />
            ))}
          </div>
        ) : null}
        <a
          href={question.data?.url}
          target="_blank"
          rel="noreferrer"
          className="hover:underline flex items-center mt-2 text-xs"
        >
          Open on {question.data?.platform.label}
          <IconChevronRight className="inline-block ml-1 w-4 h-4" />
        </a>
      </div>
    </Wrapper>
  );
}

function Option({ option }: { option: ProbabilityOption }) {
  if (option.__typename !== "ProbabilityOption") return null;
  const optionProbability = option.probability ?? 0;
  return (
    <>
      <span className={cn("text-left text-xs mr-2")}>{option.name}</span>
      <div
        className="bg-orange-200 inner flex-grow h-4 text-[0px] relative overflow-hidden min-w-[50px]"
        style={{ "--probability": optionProbability } as CSSProperties}
      >
        <div className="option-amount-fill" />
      </div>
      {/* <span className="rounded p-1 min-w-[50px] text-center whitespace-nowrap text-xs">
        {Math.round(optionProbability * 100)}%
      </span> */}
    </>
  );
}