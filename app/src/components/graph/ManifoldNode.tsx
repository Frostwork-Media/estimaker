import { IconChevronRight, IconLoader2 } from "@tabler/icons-react";
import { NodeProps } from "reactflow";

import { ApiAnswer, FullMarket, LiteMarket } from "@/lib/manifold-types";
import { ProbabilityOption } from "@/lib/metaforecast-types";
import { useManifoldMarket } from "@/lib/queries";

import { MultiOption, TwoOptions } from "./meta-shared";
import { Wrapper } from "./Wrapper";

export function ManifoldNode(props: NodeProps) {
  const market = useManifoldMarket(props.data.marketId);

  /** We check if the option text is really long and move bars to the bottom if so */
  // const hasLongOptionText = useMemo(() => {
  //   if (!question.data?.options.length) return false;
  //   return question.data.options.some(
  //     (option) => option.name && option.name.length > 20
  //   );
  // }, [question.data?.options]);

  // const numOptions = question.data?.options.length ?? 0;

  if (market.isLoading)
    return (
      <div>
        <IconLoader2 className=" animate-spin" />
      </div>
    );

  // const twoOptions = numOptions === 2 && !hasLongOptionText;

  if (!market.data) return null;

  const pool = market.data.pool;
  let options: ProbabilityOption[] = [];
  let display: "two" | "many" | "none" = "none";

  if (pool) {
    options = poolToProbabilityOptions(pool);
  } else if (isFullMarket(market.data)) {
    if (market.data.answers) {
      options = answersToProbabilityOptions(market.data.answers);
    } else if (market.data.options) {
      options = pollOptionsToProbabilityOptions(market.data.options);
    } else {
      console.log("full market; no answers");
      console.log(market.data);
    }
  } else {
    console.log("not pool; not full");
    console.log(market.data);
  }

  if (options.length === 2) {
    display = "two";
  } else {
    display = "many";
  }

  return (
    <Wrapper
      label={market.data.question}
      selected={props.selected}
      variableName={props.data.variableName}
      nodeType="manifold"
      id={props.id}
      coverImgUrl={
        isFullMarket(market.data) ? market.data.coverImageUrl : undefined
      }
    >
      <div className="mt-4 grid gap-1 w-full p-1">
        {display === "two" ? (
          <TwoOptions options={options} />
        ) : display === "many" ? (
          <MultiOption options={options} hasLongOptionText={true} />
        ) : null}
        <a
          href={market.data.url}
          target="_blank"
          rel="noreferrer"
          className="hover:bg-neutral-100 px-2 py-1 flex items-center mt-2 text-[10px] text-neutral-400 justify-self-center font-bold rounded-full"
        >
          Open on Manifold Markets
          <IconChevronRight className="inline-block ml-1 w-3 h-3" />
        </a>
      </div>
    </Wrapper>
  );
}

// function TwoOptions({ options }: { options: ProbabilityOption[] }) {
//   return (
//     <div className="flex items-center gap-2">
//       <span className={cn("text-left text-[10px] text-neutral-600")}>
//         {options[0].name}
//       </span>
//       <div
//         className="bg-orange-200 inner flex-grow h-4 rounded text-[0px] relative overflow-hidden min-w-[50px]"
//         style={{ "--probability": options[0].probability } as CSSProperties}
//       >
//         <div className="option-amount-fill rounded" />
//         {options[0].probability ? (
//           <span className="rounded whitespace-nowrap text-[8px] font-bold absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-1/2">
//             {Math.round(options[0].probability * 100)}%
//           </span>
//         ) : null}
//       </div>
//       <span className="text-[10px] text-neutral-600">{options[1].name}</span>
//     </div>
//   );
// }

// function MultiOption({
//   options,
//   hasLongOptionText,
// }: {
//   options: ProbabilityOption[];
//   hasLongOptionText: boolean;
// }) {
//   return (
//     <div
//       className={cn("grid gap-y-2 px-2", {
//         "grid-cols-[auto,minmax(0,1fr)]": !hasLongOptionText,
//       })}
//     >
//       {options.map((option) => (
//         <Option key={option.name} option={option} />
//       ))}
//     </div>
//   );
// }

// function Option({ option }: { option: ProbabilityOption }) {
//   if (option.__typename !== "ProbabilityOption") return null;
//   const optionProbability = option.probability ?? 0;
//   return (
//     <>
//       <span
//         className={cn("text-left text-[10px] text-neutral-600 mr-2 rounded")}
//       >
//         {option.name}
//       </span>
//       <div
//         className="bg-orange-200 inner flex-grow h-4 rounded text-[0px] relative overflow-hidden min-w-[50px]"
//         style={{ "--probability": optionProbability } as CSSProperties}
//       >
//         <div className="option-amount-fill rounded" />
//       </div>
//       {/* <span className="rounded p-1 min-w-[50px] text-center whitespace-nowrap text-xs">
//         {Math.round(optionProbability * 100)}%
//       </span> */}
//     </>
//   );
// }

function isFullMarket(market: LiteMarket | FullMarket): market is FullMarket {
  return "description" in market;
}

function poolToProbabilityOptions(
  pool: Record<string, number>
): ProbabilityOption[] {
  // get the total of all values
  const total = Object.values(pool).reduce((acc, cur) => acc + cur, 0);

  // return array of probability options for each entry in the pool
  return Object.entries(pool).map(([name, value]) => ({
    name,
    probability: value / total,
  }));
}

function answersToProbabilityOptions(
  answers: ApiAnswer[]
): ProbabilityOption[] {
  return answers.map((answer) => {
    return {
      name: answer.text,
      probability: answer.probability,
    };
  });
}

function pollOptionsToProbabilityOptions(
  options: NonNullable<FullMarket["options"]>
): ProbabilityOption[] {
  const total = options.reduce((acc, cur) => acc + cur.votes, 0);

  return options.map((option) => {
    return {
      name: option.text,
      probability: option.votes / total,
    };
  });
}
