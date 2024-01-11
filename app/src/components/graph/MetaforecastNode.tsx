import { IconChevronRight, IconLoader2 } from "@tabler/icons-react";
import { useMemo } from "react";
import { NodeProps } from "reactflow";

import { useMetaforecastQuestion } from "@/lib/queries";

import { MultiOption, TwoOptions } from "./meta-shared";
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
