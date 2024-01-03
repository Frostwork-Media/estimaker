import { IconChevronRight, IconLoader2 } from "@tabler/icons-react";
import { CSSProperties, useMemo } from "react";
import { NodeProps } from "reactflow";

import { ProbabilityOption } from "@/lib/metaforecast-types";
import { useMetaforecastQuestion } from "@/lib/queries";
import { cn } from "@/lib/utils";

import { Wrapper } from "./Wrapper";

export function MetaforecastNode(props: NodeProps) {
  const question = useMetaforecastQuestion(props.data.slug);

  /** We check if the option text is really long and move bars to the bottom if so */
  const hasLongOptionText = useMemo(() => {
    if (!question.data?.options.length) return false;
    return question.data.options.some(
      (option) => option.name && option.name.length > 20
    );
  }, [question.data?.options]);

  const numOptions = question.data?.options.length ?? 0;

  if (question.isLoading)
    return (
      <div>
        <IconLoader2 className=" animate-spin" />
      </div>
    );

  const twoOptions = numOptions === 2 && !hasLongOptionText;

  return (
    <Wrapper
      label={question.data?.title ?? ""}
      selected={props.selected}
      variableName={props.data.variableName}
      nodeType="metaforecast"
      id={props.id}
    >
      <div className="mt-4 grid gap-1 w-full p-1">
        {twoOptions ? (
          <TwoOptions options={question.data?.options ?? []} />
        ) : (
          <MultiOption
            options={question.data?.options ?? []}
            hasLongOptionText={hasLongOptionText}
          />
        )}
        <a
          href={question.data?.url}
          target="_blank"
          rel="noreferrer"
          className="hover:bg-neutral-100 px-2 py-1 flex items-center mt-2 text-[10px] text-neutral-400 justify-self-center font-bold rounded-full"
        >
          Open on {question.data?.platform.label}
          <IconChevronRight className="inline-block ml-1 w-3 h-3" />
        </a>
      </div>
    </Wrapper>
  );
}

function TwoOptions({ options }: { options: ProbabilityOption[] }) {
  console.log(options);
  return (
    <div className="flex items-center gap-2">
      <span className={cn("text-left text-[10px] text-neutral-600")}>
        {options[0].name}
      </span>
      <div
        className="bg-orange-200 inner flex-grow h-4 rounded text-[0px] relative overflow-hidden min-w-[50px]"
        style={{ "--probability": options[0].probability } as CSSProperties}
      >
        <div className="option-amount-fill rounded" />
        {options[0].probability ? (
          <span className="rounded whitespace-nowrap text-[8px] font-bold absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-1/2">
            {Math.round(options[0].probability * 100)}%
          </span>
        ) : null}
      </div>
      <span className="text-[10px] text-neutral-600">{options[1].name}</span>
    </div>
  );
}

function MultiOption({
  options,
  hasLongOptionText,
}: {
  options: ProbabilityOption[];
  hasLongOptionText: boolean;
}) {
  return (
    <div
      className={cn("grid gap-y-2 px-2", {
        "grid-cols-[auto,minmax(0,1fr)]": !hasLongOptionText,
      })}
    >
      {options.map((option) => (
        <Option key={option.name} option={option} />
      ))}
    </div>
  );
}

function Option({ option }: { option: ProbabilityOption }) {
  if (option.__typename !== "ProbabilityOption") return null;
  const optionProbability = option.probability ?? 0;
  return (
    <>
      <span
        className={cn("text-left text-[10px] text-neutral-600 mr-2 rounded")}
      >
        {option.name}
      </span>
      <div
        className="bg-orange-200 inner flex-grow h-4 rounded text-[0px] relative overflow-hidden min-w-[50px]"
        style={{ "--probability": optionProbability } as CSSProperties}
      >
        <div className="option-amount-fill rounded" />
      </div>
      {/* <span className="rounded p-1 min-w-[50px] text-center whitespace-nowrap text-xs">
        {Math.round(optionProbability * 100)}%
      </span> */}
    </>
  );
}
