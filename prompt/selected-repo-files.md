Directory Structure:

└── ./
    └── estimaker
        ├── app
        │   └── src
        │       ├── components
        │       │   ├── graph
        │       │   │   ├── Avatar.tsx
        │       │   │   ├── CursorNode.tsx
        │       │   │   ├── DerivativeNode.tsx
        │       │   │   ├── EstimateNode.tsx
        │       │   │   ├── EstimateRow.tsx
        │       │   │   ├── EstimateSlider.tsx
        │       │   │   ├── ImageNode.tsx
        │       │   │   ├── ManifoldNode.tsx
        │       │   │   ├── meta-shared.tsx
        │       │   │   ├── MetaforecastNode.tsx
        │       │   │   ├── ValueRow.tsx
        │       │   │   └── Wrapper.tsx
        │       │   ├── SquiggleProvider.tsx
        │       │   ├── SquiggleSidebar.tsx
        │       │   ├── StoreProvider.tsx
        │       │   ├── VariablesTable.spec.tsx
        │       │   └── VariablesTable.tsx
        │       └── lib
        │           ├── analytics.ts
        │           ├── canvasTypes.ts
        │           ├── constants.ts
        │           ├── createMedianStore.tsx
        │           ├── estimateSliderHelpers.spec.ts
        │           ├── estimateSliderHelpers.ts
        │           ├── hooks.ts
        │           ├── loaders.ts
        │           ├── logrocket.ts
        │           ├── manifold-types.ts
        │           ├── metaforecast-types.ts
        │           ├── mutations.ts
        │           ├── queries.ts
        │           ├── queryClient.ts
        │           ├── searchManifold.ts
        │           ├── searchMetaforecast.ts
        │           ├── socketContext.ts
        │           ├── squiggle-hooks.ts
        │           ├── store.ts
        │           ├── toNodesAndEdges.tsx
        │           ├── useCanvasKeybinds.ts
        │           ├── useClientStore.ts
        │           ├── useCursorsStore.ts
        │           ├── useDebounce.ts
        │           ├── useProject.ts
        │           ├── useSelectedNodeType.ts
        │           ├── useSquiggleCode.ts
        │           ├── useSquiggleRunResult.ts
        │           └── utils.ts
        └── db
            └── prisma
                ├── migrations
                │   ├── 20231109203104_initial
                │   │   └── migration.sql
                │   ├── 20231113162556_created_updated
                │   │   └── migration.sql
                │   ├── 20231113174438_cascade_delete
                │   │   └── migration.sql
                │   └── migration_lock.toml
                └── schema.prisma



---
File: /estimaker/app/src/components/graph/Avatar.tsx
---

export function Avatar({ avatar }: { avatar?: string }) {
  return (
    <div
      style={
        avatar
          ? {
              backgroundImage: `url(${avatar})`,
              backgroundSize: "cover",
              backgroundPosition: "center center",
              backgroundRepeat: "no-repeat",
            }
          : {}
      }
      className="w-5 h-5 bg-blue-600 rounded-full shrink-0 flex items-center justify-center text-gray-500 text-sm font-semibold"
    />
  );
}



---
File: /estimaker/app/src/components/graph/CursorNode.tsx
---

import { IconTriangleFilled } from "@tabler/icons-react";
import { NodeProps } from "reactflow";

export function CursorNode(props: NodeProps<{ avatar: string }>) {
  return (
    <div className="w-8 h-8 bg-transparent relative">
      <div
        style={{
          backgroundImage: `url(${props.data.avatar})`,
        }}
        className="w-5 h-5 rounded-full  bg-cover bg-center absolute bottom-0 right-0 shadow-lg drop-shadow-lg"
      />
      <IconTriangleFilled
        className="absolute top-0 left-0 text-neutral-800 rotate-[70deg] drop-shadow-md"
        size={14}
      />
    </div>
  );
}



---
File: /estimaker/app/src/components/graph/DerivativeNode.tsx
---

import { Handle, NodeProps, Position } from "reactflow";
import { useUser } from "@/lib/hooks";
import { Wrapper } from "./Wrapper";
import { ValueRow } from "./ValueRow";

export function DerivativeNode(props: NodeProps) {
  const links = props.data.links;
  const { id: userId } = useUser();
  const link = links.find((link) => link.owner === userId);

  return (
    <>
      <Handle type="target" position={Position.Top} className="!-top-3 !border-none !w-1 !h-1" />
      <Wrapper label={props.data.label} variableName={props.data.variableName} selected={!!props.selected} nodeType="derivative" id={props.id}>
        <div className="grid gap-1 p-2">
          {props.data.links.map((link) => (
            <ValueRow 
              key={link.id}
              value={link.value}
              variableName={props.data.variableName}
              avatar={"presence" in link ? link.presence.avatar : undefined}
              bgColor="bg-emerald-50"
              textColor="text-emerald-700"
            />
          ))}
        </div>
      </Wrapper>
      <Handle type="source" position={Position.Bottom} className="!-bottom-3 !border-none !w-1 !h-1" />
    </>
  );
}



---
File: /estimaker/app/src/components/graph/EstimateNode.tsx
---

import { Handle, Position } from "reactflow";
import { useUser } from "@/lib/hooks";
import { EstimateNodeProps } from "../../lib/canvasTypes";
import { ValueRow } from './ValueRow';
import { EstimateSlider } from "./EstimateSlider";
import { Wrapper } from "./Wrapper";

export function EstimateNode(props: EstimateNodeProps) {
  const links = props.data.links;
  const { id: userId } = useUser();
  const link = links.find((link) => link.owner === userId);
  
  return (
    <>
      <Wrapper
        label={props.data.label}
        variableName={props.data.variableName}
        selected={!!props.selected}
        nodeType="estimate"
        id={props.id}
        hasError={props.data.hasError}
      >
        <div className="grid gap-1 p-2">
          {/* Show slider for current user if they have a link */}
          {link ? <EstimateSlider link={link} /> : null}
          
          {/* Show all estimates with their graphs */}
          {props.data.links.map((link) => (
            <ValueRow 
              key={link.id}
              value={link.value}
              variableName={props.data.variableName}
              avatar={"presence" in link ? link.presence.avatar : undefined}
              bgColor="bg-indigo-50"
              textColor="text-indigo-700"
            />
          ))}
        </div>
      </Wrapper>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!-bottom-3 !border-none !w-1 !h-1"
      />
    </>
  );
}


---
File: /estimaker/app/src/components/graph/EstimateRow.tsx
---

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { SquiggleChart } from "@quri/squiggle-components";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar } from "./Avatar";

type EstimateRowProps = {
  link: {
    id: string;
    owner: string;
    value: string;
    presence?: {
      avatar?: string;
    };
  };
  variableName: string;
};

export function EstimateRow({ link, variableName }: EstimateRowProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-start text-xs text-left gap-2 bg-indigo-50 rounded-full">
        <Avatar avatar={"presence" in link ? link.presence.avatar : undefined} />
        <span className="text-indigo-700 font-mono tracking-tighter text-[11px] text-center grow">
          {link.value}
        </span>
        <button 
          onClick={() => setIsOpen(true)}
          className="p-1 hover:bg-indigo-100 rounded-full transition-colors"
        >
          <ChevronRight size={14} className="text-indigo-700" />
        </button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Distribution for {variableName}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <SquiggleChart
              code={`${variableName} = ${link.value}`}
              width={450}
              height={300}
              showSummary={true}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}


---
File: /estimaker/app/src/components/graph/EstimateSlider.tsx
---

import { useEffect, useReducer } from "react";

import { Slider } from "@/components/ui/slider";
import { parseLinkValue } from "@/lib/estimateSliderHelpers";
import { LinkWithSelfId, useUpdateEstimateLink } from "@/lib/store";

/** 
What I need to know:
- whether the slider is representing a range or a single number
- whether all of those numbers are between 0 and 1 or not
*/

// Define action types
type Action =
  | { type: "SET_LOCAL_VALUE"; payload: number[] }
  | { type: "SET_SLIDER_PROPS"; payload: ReturnType<typeof getSliderProps> };

// Define state type
type State = {
  localValue: number[];
  isPercentage: boolean;
  min: number;
  max: number;
  step: number;
};

const initialState: State = {
  localValue: [0.2, 0.5],
  isPercentage: false,
  min: 0,
  max: 1,
  step: 0.01,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_LOCAL_VALUE":
      return {
        ...state,
        localValue: action.payload,
      };
    case "SET_SLIDER_PROPS":
      return {
        ...state,
        ...action.payload,
      };
  }
}

export function EstimateSlider<T extends LinkWithSelfId>({
  link,
}: {
  link: T;
}) {
  const update = useUpdateEstimateLink();

  const [state, dispatch] = useReducer(reducer, initialState, () => {
    const sliderProps = getSliderProps(link.value);

    return { ...initialState, ...sliderProps };
  });

  // get the value
  // regex the value into an array of numbers
  // determine whether the numbers are between 0 and 1 inclusive
  // return the min, max and value props to the slider
  // when dragging, update the component value, and the value in the store, but don't listen for changes in the store
  // when the user stops dragging, re-process the value and min and max

  useEffect(() => {
    dispatch({
      type: "SET_SLIDER_PROPS",
      payload: getSliderProps(link.value),
    });
  }, [link.value]);

  return (
    <div className="nodrag py-2">
      <Slider
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        value={state.localValue}
        onValueChange={(value) => {
          dispatch({ type: "SET_LOCAL_VALUE", payload: value });
        }}
        onPointerUp={() => {
          const value = state.localValue;
          update({ id: link.selfId, value: numToStrValue(value) });
        }}
        min={state.min}
        max={state.max}
        step={state.step}
      />
    </div>
  );
}

function getSliderProps(value: string) {
  const localValue = parseLinkValue(value);

  // isPercentage is true if all numbers are between 0 and 1 inclusive
  const isPercentage = localValue.every((value) => value >= 0 && value <= 1);

  let min, max;

  if (isPercentage) {
    min = 0.01;
    max = 1;
  } else {
    const smallest = Math.min(...localValue);
    const largest = Math.max(...localValue);

    // if both numbers are positive, set min to 0
    if (smallest >= 0 && largest >= 0) {
      min = 0.01;
      max = closestPowerOfTen(largest);
      // if both numbers are negative, set max to 0
    } else if (smallest <= 0 && largest <= 0) {
      min = closestPowerOfTen(smallest);
      max = 0;
    } else {
      min = closestPowerOfTen(smallest);
      max = closestPowerOfTen(largest);
    }
  }

  // the step should divide the range into 100
  const step = Math.abs((max - min) / 99);
  return { min, max, isPercentage, step, localValue };
}

function numToStrValue(num: number[]): string {
  if (num.length === 1) {
    return num[0].toString();
  } else {
    return num.join(" to ");
  }
}

function closestPowerOfTen(n: number) {
  const sign = Math.sign(n);
  const power = Math.ceil(Math.log10(Math.abs(n)));
  return sign * Math.pow(10, power);
}



---
File: /estimaker/app/src/components/graph/ImageNode.tsx
---

import { NodeProps, NodeResizer } from "reactflow";

export function ImageNode(
  props: NodeProps<{ url: string; width: number; height: number }>
) {
  const { url, width, height } = props.data;

  // render it as a full background, size cover
  return (
    <>
      <NodeResizer keepAspectRatio={true} isVisible={props.selected} />
      <div
        className="bg-neutral-100 bg-cover bg-center z-[-2] rounded-md"
        style={{
          backgroundImage: `url(${url})`,
          width,
          height,
        }}
      />
    </>
  );
}



---
File: /estimaker/app/src/components/graph/ManifoldNode.tsx
---

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



---
File: /estimaker/app/src/components/graph/meta-shared.tsx
---

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



---
File: /estimaker/app/src/components/graph/MetaforecastNode.tsx
---

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



---
File: /estimaker/app/src/components/graph/ValueRow.tsx
---

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { SquiggleChart } from "@quri/squiggle-components";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar } from "./Avatar";

type ValueRowProps = {
  // Common props
  value: string;
  variableName: string;
  avatar?: string;
  // Style customization
  bgColor?: string;
  textColor?: string;
  // Optional title override
  modalTitle?: string;
};

export function ValueRow({ 
  value, 
  variableName, 
  avatar,
  bgColor = "bg-indigo-50",
  textColor = "text-indigo-700",
  modalTitle
}: ValueRowProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className={`flex items-center justify-start text-xs text-left gap-2 ${bgColor} rounded-full`}>
        {avatar !== undefined && <Avatar avatar={avatar} />}
        <span className={`font-mono tracking-tighter text-[11px] text-center grow ${textColor}`}>
          {value}
        </span>
        <button 
          onClick={() => setIsOpen(true)}
          className={`p-1 hover:bg-opacity-80 rounded-full transition-colors`}
        >
          <ChevronRight size={14} className={textColor} />
        </button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{modalTitle || `Distribution for ${variableName}`}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <SquiggleChart
              code={`${variableName} = ${value}`}
              width={450}
              height={300}
              showSummary={true}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}


---
File: /estimaker/app/src/components/graph/Wrapper.tsx
---

import { ReactNode } from "react";

import { cn } from "@/lib/utils";

type NodeType = "metaforecast" | "derivative" | "estimate" | "manifold";
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
  coverImgUrl,
}: {
  children: ReactNode;
  variableName?: string;
  label: string;
  selected: boolean;
  nodeType: NodeType;
  id: string;
  hasError?: boolean;
  coverImgUrl?: string;
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
            "w-64": ["metaforecast", "manifold"].includes(nodeType),
            "w-48": !["metaforecast", "manifold"].includes(nodeType),
            "outline-2 outline outline-foreground/50": selected,
            // give a red outline to the node if it has an error
            "outline-2 outline-red-500 outline": hasError,
          }
        )}
      >
        {coverImgUrl ? (
          <div
            className="w-full h-24 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${coverImgUrl})` }}
          />
        ) : null}
        <div className="grid p-1">
          {variableName && (
            <span
              className={cn(
                "text-[11px] text-white font-bold font-mono rounded-full min-w-[20px] px-1 h-5 flex leading-[20px] text-center justify-center absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2",
                {
                  "bg-indigo-600": nodeType === "estimate",
                  "bg-emerald-600": nodeType === "derivative",
                  "bg-orange-600":
                    nodeType === "metaforecast" || nodeType === "manifold",
                }
              )}
            >
              <span className="-mt-px">{variableName}</span>
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



---
File: /estimaker/app/src/components/SquiggleProvider.tsx
---

import { createContext } from "react";

import { useSquiggleRunResult } from "../lib/useSquiggleRunResult";

export const SquiggleContext = createContext<
  | (ReturnType<typeof useSquiggleRunResult> & {
      code: string;
    })
  | undefined
>(undefined);



---
File: /estimaker/app/src/components/SquiggleSidebar.tsx
---

import { SquiggleViewer } from "@quri/squiggle-components";
import { useContext } from "react";

import { SquiggleContext } from "./SquiggleProvider";

export function SquiggleSidebar() {
  const sq = useContext(SquiggleContext);
  if (!sq) return null;
  const { resultVariables, resultItem, code } = sq;
  return (
    <div className="p-4 grid gap-2">
      <h3 className="text-2xl font-bold text-gray-900">Code</h3>
      <pre className="p-2 rounded bg-neutral-900 text-white max-h-[250px] overflow-auto text-sm">
        <code>{code}</code>
      </pre>
      {resultVariables ? (
        <SquiggleViewer
          resultVariables={resultVariables}
          resultItem={resultItem}
          // Which variable to render???
        />
      ) : null}
    </div>
  );
}



---
File: /estimaker/app/src/components/StoreProvider.tsx
---

import PartySocket from "partysocket";
import { useEffect, useState } from "react";
import { initialState } from "shared";
import { createStore } from "tinybase/debug";
import {
  Provider,
  useCreatePersister,
  useCreateStore,
} from "tinybase/debug/ui-react";
import { createPartyKitPersister } from "tinybase/persisters/persister-partykit-client";

import { UserPresence } from "@/lib/hooks";
import { SocketContext } from "@/lib/socketContext";
import { setIsReady, useClientStore } from "@/lib/useClientStore";

export function StoreProvider({
  children,
  id,
  initial = JSON.stringify(initialState),
  presence: _,
}: {
  children: React.ReactNode;
  id: string;
  initial?: string;
  presence: UserPresence;
}) {
  if (!id) throw new Error("No room ID provided");

  const store = useCreateStore(() => createStore().setJson(initial));
  const isReady = useClientStore((state) => state.isReady);

  const [socket] = useState(() => {
    const socket = new PartySocket({
      host: import.meta.env.VITE_PARTYKIT_HOST,
      room: id,
      party: "main",
    });

    return socket;
  });

  const persister = useCreatePersister(
    store,
    (store) =>
      createPartyKitPersister(
        store,
        socket,
        location.protocol.slice(0, -1) as "http" | "https",
        console.error
      ),
    [id]
  );

  useEffect(() => {
    if (!persister || isReady) return;
    persister.startAutoLoad();
    setTimeout(() => {
      persister.startAutoSave();
      setIsReady();
    }, 1000);
  }, [persister, isReady]);

  return (
    <Provider store={store}>
      <SocketContext.Provider value={{ socket }}>
        {children}
      </SocketContext.Provider>
    </Provider>
  );
}



---
File: /estimaker/app/src/components/VariablesTable.spec.tsx
---

import { describe, expect, test } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { VariablesTable } from "./VariablesTable";
import { useTables } from "tinybase/debug/ui-react";
import { useRenameNode } from "@/lib/store";

// Mock the hooks
vi.mock("tinybase/debug/ui-react", () => ({
  useTables: vi.fn(),
}));

vi.mock("@/lib/store", () => ({
  useRenameNode: vi.fn(),
  useAddEstimateNode: vi.fn(),
}));

describe("VariablesTable", () => {
  test("appends pasted text to existing name", () => {
    const mockRenameNode = vi.fn();
    (useRenameNode as jest.Mock).mockReturnValue(mockRenameNode);
    (useTables as jest.Mock).mockReturnValue({
      nodes: {
        "1": {
          name: "existing",
          variableName: "a",
          type: "estimate"
        }
      }
    });

    const { getByDisplayValue } = render(<VariablesTable />);
    const textarea = getByDisplayValue("existing");

    // Create a paste event with clipboard data
    const pasteEvent = new Event("paste", { bubbles: true });
    Object.defineProperty(pasteEvent, 'clipboardData', {
      value: {
        getData: () => " appended"
      }
    });

    fireEvent(textarea, pasteEvent);

    expect(mockRenameNode).toHaveBeenCalledWith({
      id: "1",
      name: "existing appended"
    });
  });

  test("handles paste errors gracefully", () => {
    const mockRenameNode = vi.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    (useRenameNode as jest.Mock).mockReturnValue(mockRenameNode);
    (useTables as jest.Mock).mockReturnValue({
      nodes: {
        "1": {
          name: "existing",
          variableName: "a",
          type: "estimate"
        }
      }
    });

    const consoleSpy = vi.spyOn(console, 'error');
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    const { getByDisplayValue } = render(<VariablesTable />);
    const textarea = getByDisplayValue("existing");

    const pasteEvent = new Event("paste", { bubbles: true });
    Object.defineProperty(pasteEvent, 'clipboardData', {
      value: {
        getData: () => " appended"
      }
    });

    fireEvent(textarea, pasteEvent);

    expect(consoleSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith("Failed to paste text. Please try again.");
  });
});



---
File: /estimaker/app/src/components/VariablesTable.tsx
---

import { useState, useEffect } from "react";
import { useTables } from "tinybase/debug/ui-react";
import { useUserPresence } from "@/lib/hooks";
import { useBulkCreateEstimateNodesWithLinks} from "@/lib/store";

import { Tables } from "@/lib/store";
import { useAddEstimateNode, useCreateEstimateLink, useRenameNode, useDeleteNode } from "@/lib/store";

import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

export function VariablesTable() {
  const presence = useUserPresence();
  const [showPreview, setShowPreview] = useState(false);
  const [previewEntries, setPreviewEntries] = useState<Array<{name: string, value: string}>>([]);
  const tables = useTables() as Tables;
  const renameNode = useRenameNode();
  const addEstimateNode = useAddEstimateNode();
  const bulkCreateNodes = useBulkCreateEstimateNodesWithLinks();
  const deleteNode = useDeleteNode();
  
  if (!tables.nodes) return null;

  const variables = Object.entries(tables.nodes)
    .filter(([_, node]) => 'variableName' in node)
    .map(([id, node]) => {
      if (!('variableName' in node)) return null;
      
      return {
        id,
        name: node.name || node.variableName,
        variableName: node.variableName,
        code: 'value' in node ? node.value : '',
        source: '',  // To be implemented by user
        notes: ''    // To be implemented by user
      };
    })
    .filter(Boolean);

  const handleAddEntry = () => {
    try {
      addEstimateNode({ x: 100, y: 100 }); // Add at a fixed position initially
    } catch (error) {
      console.error("Error adding new entry:", error);
      alert("Failed to add new entry. Please try again.");
    }
  };

  const handleAcceptEntries = () => {
    try {
      bulkCreateNodes(previewEntries);
      setShowPreview(false);
      setPreviewEntries([]);
    } catch (error) {
      console.error("Error creating nodes:", error);
      alert("Failed to create entries. Please try again.");
    }
  };

  const handleCellPaste = (e: React.ClipboardEvent, id: string, field: string) => {
    e.preventDefault(); // Prevent default paste behavior
    const pastedText = e.clipboardData.getData('text');
    try {
      if (field === 'name') {
        const currentName = tables.nodes[id].name || tables.nodes[id].variableName;
        renameNode({ id, name: currentName + pastedText });
      } else if (field === 'code') {
        const currentValue = tables.nodes[id].value || '';
        tables.setCell("nodes", id, "value", currentValue + pastedText);
      }
    } catch (error) {
      console.error("Error handling paste:", error);
      alert("Failed to paste text. Please try again.");
    }
  };



  return (
    <div className="h-full overflow-auto">
      <div className="p-2">
        <div className="flex justify-end mb-4">
          <Button onClick={handleAddEntry} className="mr-2">New Entry</Button>
          <Button onClick={() => setShowPreview(true)} className="mr-2">Paste Entries</Button>
          <Button onClick={() => {
            // Get all unique owner IDs from links
            const owners = new Set<string>();
            Object.values(tables.links || {}).forEach(link => {
              owners.add(link.owner);
            });

            // Create CSV header
            const headers = ['Name', 'Variable', ...Array.from(owners)];
            
            // Create rows
            const rows = variables.map(variable => {
              const row: string[] = [variable.name, variable.variableName];
              owners.forEach(owner => {
                const link = Object.values(tables.links || {}).find(
                  link => link.nodeId === variable.id && link.owner === owner
                );
                row.push(link?.value || '');
              });
              return row;
            });

            // Convert to CSV
            const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
            
            // Download
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'estimates.csv';
            a.click();
            window.URL.revokeObjectURL(url);
          }}>
            Download CSV
          </Button>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Variable</th>
              <th className="text-left p-2">Code</th>
              <th className="text-left p-2">Source</th>
              <th className="text-left p-2">Notes</th>
            </tr>
          </thead>
          <tbody>
            {variables.map((variable) => (
              <tr key={variable.id} className="border-b">
                <td className="p-2">
                  <textarea
                    value={variable.name}
                    onChange={(e) => {
                      try {
                        renameNode({ id: variable.id, name: e.target.value });
                      } catch (error) {
                        console.error("Error renaming node:", error);
                        alert("Failed to rename node. Please try again.");
                      }
                    }}
                    onPaste={(e) => handleCellPaste(e, variable.id, 'name')}
                    className="w-full p-2 border border-gray-300 rounded resize-none"
                  />
                </td>
                <td className="p-2 font-mono">{variable.variableName}</td>
                <td className="p-2 font-mono">
                  <input
                    type="text"
                    value={variable.code || tables.nodes[variable.id].value}
                    onChange={(e) => {
                      try {
                        tables.setCell("nodes", variable.id, "value", e.target.value);
                      } catch (error) {
                        console.error("Error updating code:", error);
                        alert("Failed to update code. Please try again.");
                      }
                    }}
                    onPaste={(e) => handleCellPaste(e, variable.id, 'code')}
                    className="w-full p-1 border rounded font-mono"
                  />
                </td>
                <td className="p-2">{variable.source}</td>
                <td className="p-2">{variable.notes}</td>
                <td className="p-2">
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                      try {
                        deleteNode(variable.id);
                      } catch (error) {
                        console.error("Error deleting node:", error);
                        alert("Failed to delete node. Please try again.");
                      }
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog open={showPreview} onOpenChange={(open) => {
        if (!open) {
          setShowPreview(false);
          setPreviewEntries([]);
        }
      }}>
<Dialog open={showPreview} onOpenChange={setShowPreview}>
  <DialogContent className="max-w-4xl">
    <DialogHeader>
      <DialogTitle>Paste Variables</DialogTitle>
    </DialogHeader>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Names</label>
        <textarea
          className="w-full h-48 p-2 border rounded font-mono resize-none overflow-auto"
          placeholder="Paste names here..."
          onChange={(e) => {
            const names = e.target.value.split('\n').filter(name => name.trim());
            const values = previewEntries.map(entry => entry.value);
            const entries = names.map((name, i) => ({
              name,
              value: values[i] || ''
            }));
            setPreviewEntries(entries);
          }}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Values</label>
        <textarea
          className="w-full h-48 p-2 border rounded font-mono resize-none overflow-auto"
          placeholder="Paste values here..."
          onChange={(e) => {
            const values = e.target.value.split('\n').filter(value => value.trim());
            const names = previewEntries.map(entry => entry.name);
            const entries = names.map((name, i) => ({
              name: name || '',
              value: values[i] || ''
            }));
            setPreviewEntries(entries);
          }}
        />
      </div>
    </div>
    
    {previewEntries.length > 0 && (
      <div className="mt-4 max-h-48 overflow-auto border rounded">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="text-left p-2 border-b">Name</th>
              <th className="text-left p-2 border-b">Value</th>
            </tr>
          </thead>
          <tbody>
            {previewEntries.map((entry, i) => (
              <tr key={i} className="border-b">
                <td className="p-2">{entry.name}</td>
                <td className="p-2">{entry.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
    
    <div className="mt-4 flex justify-end space-x-2">
      <Button variant="outline" onClick={() => setShowPreview(false)}>Cancel</Button>
      <Button onClick={handleAcceptEntries}>Add Entries</Button>
    </div>
  </DialogContent>
</Dialog>
      </Dialog>
    </div>
  );
}



---
File: /estimaker/app/src/lib/analytics.ts
---

import * as amplitude from "@amplitude/analytics-browser";
import { useEffect } from "react";

export function useAmplitude() {
  useEffect(() => {
    if (import.meta.env.VITE_AMPLITUDE_KEY) {
      amplitude.init(import.meta.env.VITE_AMPLITUDE_KEY);
    }
  }, []);
}

export function amplitudeRegisterUser(userId: string) {
  amplitude.setUserId(userId);
}

export { amplitude };



---
File: /estimaker/app/src/lib/canvasTypes.ts
---

import { Node, NodeProps } from "reactflow";

import { UserPresence } from "./hooks";
import { LinkWithSelfId } from "./store";

type Estimate = {
  label: string;
  variableName: string;
  links: (LinkWithSelfId | (LinkWithSelfId & { presence: UserPresence }))[];
  hasError: boolean;
};

export type EstimateNodeProps = NodeProps<Estimate>;
export type EstimateNodeType = Node<Estimate>;



---
File: /estimaker/app/src/lib/constants.ts
---

/** Select this ID to jump to the node name editor */
export const NODE_NAME_EDITOR_ID = "node-name-editor";



---
File: /estimaker/app/src/lib/createMedianStore.tsx
---

import { run } from "@quri/squiggle-lang";
import { Edge } from "reactflow";

import type { Tables } from "@/lib/store";
import { createSquiggleCode } from "@/lib/useSquiggleCode";

export type MedianStore = Record<
  string,
  { avatar: string; value: string; userId: string }[]
>;
export type MedianStoreMedian = MedianStore[keyof MedianStore][number];

export async function createMedianStore(tables: Tables, edges: Edge[]) {
  const medianStore: MedianStore = {};
  const { users, nodes } = tables;
  
  const derivativeNodes = nodes
    ? Object.values(nodes).filter((node) => node.type === "derivative")
    : [];
    
  if (!derivativeNodes.length) return medianStore;

  for (const node of derivativeNodes) {
    if (!("variableName" in node)) continue;
    
    medianStore[node.variableName] = Object.values(users || {}).map(user => ({
      userId: user.id,
      avatar: user.avatar,
      value: node.value
    }));
  }

  return medianStore;
}



---
File: /estimaker/app/src/lib/estimateSliderHelpers.spec.ts
---

import { describe, expect, test } from "vitest";

import { parseLinkValue } from "./estimateSliderHelpers";

describe("parseLinkValue", () => {
  test("returns a single number", () => {
    expect(parseLinkValue("1")).toEqual([1]);
  });

  test("returns a digit number", () => {
    expect(parseLinkValue("0.01")).toEqual([0.01]);
  });

  test("returns multiple numbers", () => {
    expect(parseLinkValue("1 to 2")).toEqual([1, 2]);
  });

  test("returns multiple digit numbers", () => {
    expect(parseLinkValue("0.01 to 0.02")).toEqual([0.01, 0.02]);
  });
});



---
File: /estimaker/app/src/lib/estimateSliderHelpers.ts
---

/**
 * Given a value in the form of a number,
 * or a `number to number`, parse an array
 * of numbers
 *
 * Use a regex to extract numbers
 */
export function parseLinkValue(value: string): number[] {
  const numbers = value.match(/[\d.]+/g);

  if (numbers === null) {
    return [];
  }

  return numbers.map((number) => parseFloat(number));
}



---
File: /estimaker/app/src/lib/hooks.ts
---

import { useClerk } from "@clerk/clerk-react";
import { useCallback, useEffect } from "react";
import { useReactFlow } from "reactflow";
import { useStore, useTable } from "tinybase/debug/ui-react";

/**
 * Gets the user when we know they are logged in.
 */
export function useUser() {
  const { user } = useClerk();
  if (!user) {
    throw new Error("You must be logged in to use this.");
  }

  return user;
}

export function useUserPresence() {
  const { user } = useClerk();
  if (!user) {
    throw new Error("You must be logged in to use this.");
  }

  const avatar = user.imageUrl;
  const name = user.firstName || user.fullName || "Anonymous";
  const id = user.id;

  return { avatar, name, id };
}

export type UserPresence = ReturnType<typeof useUserPresence>;

export function useAvatar() {
  const users = useTable("users");
  const presence = useUserPresence();
  const store = useStore();
  useEffect(() => {
    // Writes the user into storage so avatar is available later
    if (!store) return;
    if (!presence) return;
    if (Object.values(users).some((u) => u.id === presence.id)) return;
    store.addRow("users", presence);
  }, [users, presence, store]);
}

/**
 * Gets the center of the react flow pane, in react flow coordinates.
 */
export function useGetFlowCenter() {
  const { screenToFlowPosition } = useReactFlow();
  return useCallback(() => {
    const element = document.querySelector(".react-flow__pane");
    if (!element) return screenToFlowPosition({ x: 200, y: 200 });

    const rect = element.getBoundingClientRect();
    return screenToFlowPosition({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
  }, [screenToFlowPosition]);
}



---
File: /estimaker/app/src/lib/loaders.ts
---

import { defer, LoaderFunction } from "react-router-dom";

async function getProject(id: string) {
  const response = await fetch(`/api/projects/get?id=${id}`);
  if (!response.ok) throw new Error("Failed to project.");
  const { project, error } = await response.json();
  if (error) throw new Error(error);
  return project;
}

export const project: LoaderFunction = async ({ params }) => {
  const id = params.id;
  if (!id) throw new Error("No room ID provided!");
  return defer({ project: getProject(id) });
};



---
File: /estimaker/app/src/lib/logrocket.ts
---

import LogRocket from "logrocket";

export { LogRocket };



---
File: /estimaker/app/src/lib/manifold-types.ts
---

// Borrowed from manifold market repo
// https://raw.githubusercontent.com/manifoldmarkets/manifold/main/common/src/api/market-types.ts

export type LiteMarket = {
  // Unique identifier for this market
  id: string;

  // Attributes about the creator
  creatorId: string;
  creatorUsername: string;
  creatorName: string;
  createdTime: number;
  creatorAvatarUrl?: string;

  // Market attributes. All times are in milliseconds since epoch
  closeTime?: number;
  question: string;
  slug: string;
  url: string;
  outcomeType: string; // BINARY, FREE_RESPONSE, MULTIPLE_CHOICE, NUMERIC, PSEUDO_NUMERIC, BOUNTIED_QUESTION, POLL
  mechanism: string;

  pool?: { [outcome: string]: number };
  probability?: number;
  p?: number;
  totalLiquidity?: number;
  // For pseudo-numeric
  value?: number;
  min?: number;
  max?: number;

  volume: number;
  volume24Hours: number;

  isResolved: boolean;
  resolution?: string;
  resolutionTime?: number;
  resolutionProbability?: number;

  uniqueBettorCount: number;
  lastUpdatedTime?: number;
  lastBetTime?: number;
};

export type ApiAnswer =
  | (DpmAnswer & {
      probability: number;
    })
  | Omit<
      Answer & {
        probability: number;
        pool: { YES: number; NO: number };
      },
      "prob" | "poolYes" | "poolNo"
    >;

export type FullMarket = LiteMarket & {
  // bets?: Bet[]
  // comments?: Comment[]

  // multi markets only
  answers?: ApiAnswer[];
  shouldAnswersSumToOne?: boolean;
  addAnswersMode?: "ANYONE" | "ONLY_CREATOR" | "DISABLED";

  // poll only
  options?: { text: string; votes: number }[];

  // bounty only
  totalBounty?: number;
  bountyLeft?: number;

  description: string | JSON;
  textDescription: string; // string version of description
  coverImageUrl?: string;
  groupSlugs?: string[];
};

export type Answer = {
  id: string;
  index: number; // Order of the answer in the list
  contractId: string;
  userId: string;
  text: string;
  createdTime: number;

  // Mechanism props
  poolYes: number; // YES shares
  poolNo: number; // NO shares
  prob: number; // Computed from poolYes and poolNo.
  totalLiquidity: number; // for historical reasons, this the total subsidy amount added in M
  subsidyPool: number; // current value of subsidy pool in M

  // Is this 'Other', the answer that represents all other answers, including answers added in the future.
  isOther?: boolean;

  resolution?: resolution;
  resolutionTime?: number;
  resolutionProbability?: number;
  resolverId?: string;

  probChanges: {
    day: number;
    week: number;
    month: number;
  };
};

export type DpmAnswer = {
  id: string;
  number: number;
  contractId: string;
  createdTime: number;

  userId: string;
  username: string;
  name: string;
  avatarUrl?: string;

  text: string;
};

export type resolution = "YES" | "NO" | "MKT" | "CANCEL";



---
File: /estimaker/app/src/lib/metaforecast-types.ts
---

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
};

export type CreateDashboardInput = {
  /** The creator of the dashboard, e.g. "Peter Parker" */
  creator?: InputMaybe<Scalars['String']['input']>;
  /** The longer description of the dashboard */
  description?: InputMaybe<Scalars['String']['input']>;
  /** List of question ids */
  ids: Array<Scalars['ID']['input']>;
  /** The title of the dashboard */
  title: Scalars['String']['input'];
};

export type CreateDashboardResult = {
  __typename?: 'CreateDashboardResult';
  dashboard: Dashboard;
};

export type Dashboard = {
  __typename?: 'Dashboard';
  /** The creator of the dashboard, e.g. "Peter Parker" */
  creator: Scalars['String']['output'];
  /** The longer description of the dashboard */
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** The list of questions on the dashboard */
  questions: Array<Question>;
  /** The title of the dashboard */
  title: Scalars['String']['output'];
};

export type History = QuestionShape & {
  __typename?: 'History';
  description: Scalars['String']['output'];
  /** Last timestamp at which metaforecast fetched the question */
  fetched: Scalars['Date']['output'];
  /** Last timestamp at which metaforecast fetched the question, in ISO 8601 format */
  fetchedStr: Scalars['String']['output'];
  /** History items are identified by their integer ids */
  id: Scalars['ID']['output'];
  options: Array<ProbabilityOption>;
  platform: Platform;
  qualityIndicators: QualityIndicators;
  /** Unique string which identifies the question */
  questionId: Scalars['ID']['output'];
  /**
   * Last timestamp at which metaforecast fetched the question
   * @deprecated Renamed to `fetched`
   */
  timestamp: Scalars['Date']['output'];
  title: Scalars['String']['output'];
  /** Non-unique, a very small number of platforms have a page for more than one prediction */
  url: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Create a new dashboard; if the dashboard with given ids already exists then it will be returned instead. */
  createDashboard: CreateDashboardResult;
};


export type MutationCreateDashboardArgs = {
  input: CreateDashboardInput;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

/** Forecasting platform supported by Metaforecast */
export type Platform = {
  __typename?: 'Platform';
  /** Short unique platform name, e.g. "xrisk" */
  id: Scalars['ID']['output'];
  /** Platform name for displaying on frontend etc., e.g. "X-risk estimates" */
  label: Scalars['String']['output'];
  lastUpdated?: Maybe<Scalars['Date']['output']>;
};

export type ProbabilityOption = {
  __typename?: 'ProbabilityOption';
  name?: Maybe<Scalars['String']['output']>;
  /** 0 to 1 */
  probability?: Maybe<Scalars['Float']['output']>;
};

/** Various indicators of the question's quality */
export type QualityIndicators = {
  __typename?: 'QualityIndicators';
  liquidity?: Maybe<Scalars['Float']['output']>;
  numForecasters?: Maybe<Scalars['Int']['output']>;
  numForecasts?: Maybe<Scalars['Int']['output']>;
  openInterest?: Maybe<Scalars['Float']['output']>;
  sharesVolume?: Maybe<Scalars['Float']['output']>;
  spread?: Maybe<Scalars['Float']['output']>;
  /** 0 to 5 */
  stars: Scalars['Int']['output'];
  tradeVolume?: Maybe<Scalars['Float']['output']>;
  volume?: Maybe<Scalars['Float']['output']>;
};

export type Query = {
  __typename?: 'Query';
  /** Look up a single dashboard by its id */
  dashboard?: Maybe<Dashboard>;
  /** Get a list of questions that are currently on the frontpage */
  frontpage: Array<Question>;
  platforms: Array<Platform>;
  /** Look up a single question by its id */
  question?: Maybe<Question>;
  questions: QueryQuestionsConnection;
  /** Search for questions; uses Algolia instead of the primary metaforecast database */
  searchQuestions: Array<Question>;
};


export type QueryDashboardArgs = {
  id: Scalars['ID']['input'];
};


export type QueryQuestionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryQuestionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<QuestionsOrderBy>;
};


export type QuerySearchQuestionsArgs = {
  input: SearchInput;
};

export type QueryQuestionsConnection = {
  __typename?: 'QueryQuestionsConnection';
  edges: Array<Maybe<QueryQuestionsConnectionEdge>>;
  pageInfo: PageInfo;
};

export type QueryQuestionsConnectionEdge = {
  __typename?: 'QueryQuestionsConnectionEdge';
  cursor: Scalars['String']['output'];
  node: Question;
};

export type Question = QuestionShape & {
  __typename?: 'Question';
  description: Scalars['String']['output'];
  /** Last timestamp at which metaforecast fetched the question */
  fetched: Scalars['Date']['output'];
  /** Last timestamp at which metaforecast fetched the question, in ISO 8601 format */
  fetchedStr: Scalars['String']['output'];
  /** First timestamp at which metaforecast fetched the question */
  firstSeen: Scalars['Date']['output'];
  /** First timestamp at which metaforecast fetched the question, in ISO 8601 format */
  firstSeenStr: Scalars['String']['output'];
  history: Array<History>;
  /** Unique string which identifies the question */
  id: Scalars['ID']['output'];
  options: Array<ProbabilityOption>;
  platform: Platform;
  qualityIndicators: QualityIndicators;
  /**
   * Last timestamp at which metaforecast fetched the question
   * @deprecated Renamed to `fetched`
   */
  timestamp: Scalars['Date']['output'];
  title: Scalars['String']['output'];
  /** Non-unique, a very small number of platforms have a page for more than one prediction */
  url: Scalars['String']['output'];
  visualization?: Maybe<Scalars['String']['output']>;
};

export type QuestionShape = {
  description: Scalars['String']['output'];
  /** Last timestamp at which metaforecast fetched the question */
  fetched: Scalars['Date']['output'];
  /** Last timestamp at which metaforecast fetched the question, in ISO 8601 format */
  fetchedStr: Scalars['String']['output'];
  options: Array<ProbabilityOption>;
  platform: Platform;
  qualityIndicators: QualityIndicators;
  /**
   * Last timestamp at which metaforecast fetched the question
   * @deprecated Renamed to `fetched`
   */
  timestamp: Scalars['Date']['output'];
  title: Scalars['String']['output'];
  /** Non-unique, a very small number of platforms have a page for more than one prediction */
  url: Scalars['String']['output'];
};

export enum QuestionsOrderBy {
  FirstSeenDesc = 'FIRST_SEEN_DESC'
}

export type SearchInput = {
  /** List of platform ids to filter by */
  forecastingPlatforms?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Minimum number of forecasts on a question */
  forecastsThreshold?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  query: Scalars['String']['input'];
  /** Minimum number of stars on a question */
  starsThreshold?: InputMaybe<Scalars['Int']['input']>;
};



---
File: /estimaker/app/src/lib/mutations.ts
---

import { useMutation } from "@tanstack/react-query";
import { Project } from "db";
import { useNavigate } from "react-router-dom";
import { State } from "shared";
import { useStore } from "tinybase/debug/ui-react";

import { queryClient } from "./queryClient";
import { useClientStore } from "./useClientStore";
import { useSetProject } from "./useProject";

export function useCreateProject() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/projects/create");
      if (!res.ok) {
        throw new Error("Failed to create project");
      }

      const { project } = (await res.json()) as { project: Project };

      return project;
    },
    onSuccess: (project) => {
      // navigate to the new project
      navigate(`/projects/${project.id}`);

      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });
}

export function useDeleteProject() {
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/projects/delete?id=${id}`);
      if (!res.ok) {
        throw new Error("Failed to delete project");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
    // optimistically remove this id from the ["projects"] query
    onMutate: async (id: string) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["projects"] });

      // Snapshot the previous value
      const previousProjects = queryClient.getQueryData(["projects"]);

      // Optimistically update to the new value
      queryClient.setQueryData(["projects"], (old: Project[]) => {
        return old.filter((project) => project.id !== id);
      });

      // Return a context object with the snapshotted value
      return { previousProjects };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (_err, _variables, context) => {
      if (context)
        queryClient.setQueryData(["projects"], context.previousProjects);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });
}

/** Creates a new project using only the selected nodes */
export function useCreateProjectFromSelection() {
  const getSelectedState = useGetSelectedState();
  return useMutation({
    mutationFn: async () => {
      const [tables] = getSelectedState();

      const res = await fetch("/api/projects/create", {
        method: "POST",
        body: JSON.stringify({ state: [tables, { name: "New Project" }] }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error("Failed to create project");
      }

      const { project } = (await res.json()) as { project: Project };

      return project;
    },
    onSuccess: (project) => {
      // navigate to the new project with a refresh
      window.location.href = `/projects/${project.id}`;
    },
  });
}

/**
 * This function returns the subset of the state that is selected
 */
export function useGetSelectedState() {
  const store = useStore();
  return () => {
    if (!store) throw new Error("Store is not defined");
    const selectedNodes = useClientStore.getState().selectedNodes;
    const [tables, values]: State = JSON.parse(store.getJson());

    // remove any nodes from the nodes table that aren't selected
    if (tables.nodes) {
      for (const id in tables.nodes) {
        if (!selectedNodes.includes(id)) {
          delete tables.nodes[id];
        }
      }
    }

    // remove any links that no longer have nodes
    if (tables.links) {
      for (const id in tables.links) {
        const link = tables.links[id];
        if (!selectedNodes.includes(link.nodeId)) {
          delete tables.links[id];
        }
      }
    }

    return [tables, values];
  };
}

function updateProjectNameInDB(name: string, id: string) {
  return fetch("/api/projects/update-name", {
    method: "POST",
    body: JSON.stringify({ name, id }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function useUpdateProjectNameInDB() {
  return useMutation({
    mutationKey: ["updateProjectNameInDB"],
    mutationFn: async ({ name, id }: { name: string; id: string }) => {
      const res = await updateProjectNameInDB(name, id);
      if (!res.ok) {
        throw new Error("Failed to update project name");
      }

      return res.json() as Promise<{ success: boolean }>;
    },
  });
}

export function useSaveProject() {
  const setProject = useSetProject();
  return useMutation({
    mutationFn: async ({ id, state }: { id: string; state: State }) => {
      const res = await fetch("/api/projects/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, state }),
      });

      if (!res.ok) {
        throw new Error("Failed to save project");
      }

      return res.json() as Promise<
        { success: true } | { success: false; error: string }
      >;
    },
    onError: (error) => {
      console.error("Error saving project:", error);
    },
    onSuccess: (_, { state }) => {
      setProject((prev) => ({ ...prev, state }));
    },
  });
}



---
File: /estimaker/app/src/lib/queries.ts
---

import { useQuery } from "@tanstack/react-query";
import type { Estimate, Project } from "db";

import { getManifoldMarket, searchManifold } from "./searchManifold";
import { getMetaforecast, searchMetaforecast } from "./searchMetaforecast";

/**
 * List the users projects
 */
export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await fetch("/api/projects/list");
      const { projects, error } = await res.json();
      if (error) {
        throw new Error(error);
      }
      return projects as Project[];
    },
    staleTime: 1000 * 60 * 60 * 24,
  });
}

/**
 * Searches metaforecast for a market
 */
export function useMetaforecastSearch(search: string) {
  return useQuery({
    queryKey: ["metaforecast", search],
    queryFn: () => searchMetaforecast(search),
    staleTime: Infinity,
    enabled: !!search,
    retry: true,
  });
}

/**
 * Searches manifold markets
 */
export function useManifoldSearch(search: string) {
  return useQuery({
    queryKey: ["manifold", search],
    queryFn: () => searchManifold(search),
    staleTime: Infinity,
    enabled: !!search,
    retry: true,
  });
}

/**
 * Searches user estimates at the /api/estimates/search endpoint
 */
export function useEstimateSearch(search: string, projectId: string) {
  return useQuery({
    queryKey: ["estimates", projectId, search],
    queryFn: async () => {
      const res = await fetch(
        `/api/estimates/search?term=${search}&id=${projectId}`
      );
      const { estimates, error } = await res.json();
      if (error) {
        throw new Error(error);
      }
      return estimates as Estimate[];
    },
    // Stale time of 5 minutes
    staleTime: 5 * 60 * 1000,
    enabled: !!search,
  });
}

/**
 * Returns metaforecast question details based on the slug
 */
export function useMetaforecastQuestion(slug: string) {
  return useQuery({
    queryKey: ["metaforecast", slug],
    queryFn: () => getMetaforecast(slug),
    staleTime: 30 * 1000,
    // Refetch every 30 seconds
    refetchInterval: 30 * 1000,
  });
}

/**
 * Returns the manifold market for a given id
 */
export function useManifoldMarket(id: string) {
  return useQuery({
    queryKey: ["manifold", id],
    queryFn: () => getManifoldMarket(id),
    staleTime: 30 * 1000,
    // Refetch every 30 seconds
    refetchInterval: 30 * 1000,
  });
}



---
File: /estimaker/app/src/lib/queryClient.ts
---

import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});



---
File: /estimaker/app/src/lib/searchManifold.ts
---

import { FullMarket, LiteMarket } from "./manifold-types";

export interface Market {
  id: string;
  creatorId: string;
  creatorUsername: string;
  creatorName: string;
  createdTime: number;
  creatorAvatarUrl: string;
  closeTime?: number;
  question: string;
  slug: string;
  url: string;
  pool?: Pool;
  probability?: number;
  p?: number;
  totalLiquidity?: number;
  outcomeType: string;
  mechanism: string;
  volume: number;
  volume24Hours: number;
  isResolved: boolean;
  resolution?: string;
  resolutionTime?: number;
  resolutionProbability?: number;
  uniqueBettorCount: number;
  lastUpdatedTime: number;
  lastBetTime?: number;
  lastCommentTime?: number;
  resolverId?: string;
}

export interface Pool {
  NO: number;
  YES: number;
}

export async function searchManifold(term: string) {
  const searchParams = new URLSearchParams();
  searchParams.append("term", term);

  const response = await fetch(
    `https://api.manifold.markets/v0/search-markets?${searchParams.toString()}`
  );

  const result = (await handleErrors(response).json()) as Market[];

  return result;
}

const handleErrors = (response: Response) => {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
};

export async function getManifoldMarket(id: string) {
  const response = await fetch(`https://api.manifold.markets/v0/market/${id}`);

  const result = (await handleErrors(response).json()) as
    | LiteMarket
    | FullMarket;

  return result;
}



---
File: /estimaker/app/src/lib/searchMetaforecast.ts
---

import { Question } from "./metaforecast-types";

const questionFragment = `fragment Question on Question {
  id
  url
  title
  description
  fetched
  options {
    name
    probability
    __typename
  }
  platform {
    id
    label
    __typename
  }
  qualityIndicators {
    stars
    numForecasts
    numForecasters
    volume
    spread
    sharesVolume
    openInterest
    liquidity
    tradeVolume
    __typename
  }
  visualization
}`;

const query = `query Search($input: SearchInput!) {
  result: searchQuestions(input: $input) {
    ...Question
    __typename
  }
}

${questionFragment}
`;

const singleQuestionQuery = `query Question($id: ID!){
  question(id: $id){
    ...Question
    __typename
  }
}

${questionFragment}`;

/**
 * Given a query, uses graphql to search metaforecast api
 * for a market
 *
 * Endpoint: https://metaforecast.org/api/graphql
 */
export async function searchMetaforecast(search: string) {
  const variables = getVariables(search);
  const response = await fetch("https://metaforecast.org/api/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables, operationName: "Search" }),
  });

  const { data } = await response.json();

  return data.result.filter(
    (q: Question) => q.id !== "not-found"
  ) as Question[];
}

export async function getMetaforecast(id: string) {
  const response = await fetch("https://metaforecast.org/api/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: singleQuestionQuery,
      variables: {
        id,
      },
      operationName: "Question",
    }),
  });

  const { data } = await response.json();
  return data.question as Question;
}

function getVariables(query: string) {
  return {
    input: {
      query,
      starsThreshold: 2,
      forecastsThreshold: 0,
      forecastingPlatforms: [
        "betfair",
        "fantasyscotus",
        "foretold",
        "givewellopenphil",
        "goodjudgment",
        "goodjudgmentopen",
        "guesstimate",
        "infer",
        "insight",
        "kalshi",
        "manifold",
        "metaculus",
        "polymarket",
        "predictit",
        "rootclaim",
        "smarkets",
        "wildeford",
        "xrisk",
      ],
      limit: 71,
    },
  };
}



---
File: /estimaker/app/src/lib/socketContext.ts
---

import PartySocket from "partysocket";
import { createContext } from "react";

type SocketContextType = {
  socket: null | PartySocket;
};

export const SocketContext = createContext<SocketContextType>({
  socket: null,
});



---
File: /estimaker/app/src/lib/squiggle-hooks.ts
---

import {
  Env,
  result,
  SqDict,
  SqError,
  SqProject,
  SqValue,
} from "@quri/squiggle-lang";
import { useEffect, useMemo, useReducer, useState } from "react";

// Props needed for a standalone execution.
type StandaloneExecutionProps = {
  project?: undefined;
  environment?: Env;
  continues?: undefined;
};

// Props needed when executing inside a project.
type ProjectExecutionProps = {
  /** The project that this execution is part of */
  project: SqProject;
  environment?: undefined;
  /** What other squiggle sources from the project to continue. Default [] */
  continues?: string[];
};

type SquiggleArgs = {
  code: string;
  sourceId?: string;
  executionId?: number;
} & (StandaloneExecutionProps | ProjectExecutionProps);

type SquiggleOutput = {
  output: result<
    {
      result: SqValue;
      bindings: SqDict;
    },
    SqError
  >;
  code: string;
  executionId: number;
  executionTime: number;
};

type UseSquiggleOutput = [
  SquiggleOutput | undefined,
  {
    project: SqProject;
    isRunning: boolean;
    sourceId: string;
  },
];

// this array's identity must be constant because it's used in useEffect below
const defaultContinues: string[] = [];

export function useSquiggle(args: SquiggleArgs): UseSquiggleOutput {
  // random; https://stackoverflow.com/a/12502559
  // TODO - React.useId?
  const sourceId = useMemo(() => {
    return args.sourceId ?? Math.random().toString(36).slice(2);
  }, [args.sourceId]);

  const projectArg = "project" in args ? args.project : undefined;
  const environment = "environment" in args ? args.environment : undefined;
  const continues =
    "continues" in args ? args.continues ?? defaultContinues : defaultContinues;

  const project = useMemo(() => {
    if (projectArg) {
      return projectArg;
    } else {
      const p = SqProject.create();
      if (environment) {
        p.setEnvironment(environment);
      }
      return p;
    }
  }, [projectArg, environment]);

  const [isRunning, setIsRunning] = useState(false);

  const [squiggleOutput, setSquiggleOutput] = useState<
    SquiggleOutput | undefined
  >(undefined);

  const { executionId = 1 } = args;

  useEffect(
    () => {
      // TODO - cancel previous run if already running
      setIsRunning(true);

      const act = async () => {
        const startTime = Date.now();
        project.setSource(sourceId, args.code);
        project.setContinues(sourceId, continues);
        await project.run(sourceId);
        const output = project.getOutput(sourceId);
        setSquiggleOutput({
          output,
          code: args.code,
          executionId,
          executionTime: Date.now() - startTime,
        });
        setIsRunning(false);
      };

      if (typeof MessageChannel === "undefined") {
        setTimeout(act, 10);
      } else {
        // trick from https://stackoverflow.com/a/56727837
        const channel = new MessageChannel();
        channel.port1.onmessage = act;
        requestAnimationFrame(function () {
          channel.port2.postMessage(undefined);
        });
      }
    },
    // This complains about executionId not being used inside the function body.
    // This is on purpose, as executionId simply allows you to run the squiggle
    // code again
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [args.code, executionId, sourceId, continues, project]
  );

  useEffect(() => {
    return () => {
      project.removeSource(sourceId);
    };
  }, [project, sourceId]);

  return [
    squiggleOutput,
    {
      project,
      isRunning,
      sourceId,
    },
  ];
}

type InternalState = {
  autorunMode: boolean;
  renderedCode: string;
  executionId: number;
};

const buildInitialState = (): InternalState => ({
  autorunMode: true,
  renderedCode: "",
  executionId: 0,
});

type Action =
  | {
      type: "SET_AUTORUN_MODE";
      value: boolean;
      code: string;
    }
  | {
      type: "RUN";
      code: string;
    };

const reducer = (state: InternalState, action: Action): InternalState => {
  switch (action.type) {
    case "SET_AUTORUN_MODE":
      return {
        ...state,
        autorunMode: action.value,
      };
    case "RUN":
      return {
        ...state,
        renderedCode: action.code,
        executionId: state.executionId + 1,
      };
  }
};

type RunnerState = {
  run: () => void;
  autorunMode: boolean;
  code: string;
  renderedCode: string;
  executionId: number;
  setAutorunMode: (newValue: boolean) => void;
};

export function useRunnerState(code: string): RunnerState {
  const [state, dispatch] = useReducer(reducer, undefined, buildInitialState);

  const run = () => {
    dispatch({ type: "RUN", code });
  };

  if (state.autorunMode && state.renderedCode !== code) {
    run();
  }

  return {
    run,
    autorunMode: state.autorunMode,
    code,
    renderedCode: state.renderedCode,
    executionId: state.executionId,
    setAutorunMode: (newValue: boolean) => {
      dispatch({ type: "SET_AUTORUN_MODE", value: newValue, code });
    },
  };
}



---
File: /estimaker/app/src/lib/store.ts
---

import { nanoid } from "nanoid";
import { useCallback } from "react";
import { useStore } from "tinybase/debug/ui-react";
import { useUserPresence } from "./hooks";

import { useClientStore } from "./useClientStore";

type Node = {
  /** A concatenation of the [type]:[id] */
  uid: string;
  /** X Position */
  x: number;
  /** Y Position */
  y: number;
};

export type EstimateNode = Node & {
  /** Base Type */
  type: "estimate";
  /** This is the variable name, or a nice name given to it. Changing this changes all linked estimates on the backend */
  name: string;
  /** Variable Name */
  variableName: string;
  // /** A record which contains owner id to estimate id links */
  // links: Record<string, string>;
};

export type DerivativeNode = Node & {
  /** Base Type */
  type: "derivative";
  /** The semantic meaning */
  name: string;
  /** Variable Name */
  variableName: string;
  /** The squiggle content */
  value: string;
};

export type MetaforecastNode = Node & {
  type: "metaforecast";
  /** The metaforecast slug */
  slug: string;
  /** A variable name, currently unused but maybe in the future */
  variableName: string;
};

export type ManifoldNode = Node & {
  type: "manifold";
  /** The manifold market id */
  marketId: string;
  /** A variable name, currently unused but maybe in the future */
  variableName: string;
};

export type ImageNode = Node & {
  type: "image";
  /** The image url */
  url: string;
  /** The rendered width */
  width: number;
  /** The rendered height */
  height: number;
};

/**
 * This represents a row from the estimates table in the db
 */
export type Link = {
  /** The ID of the estimate in the database */
  id: string;
  /** The ID of the node to which this link belongs */
  nodeId: string;
  /** Owner ID */
  owner: string;
  /** The squiggle content */
  value: string;
};

export type LinkWithSelfId = Link & {
  selfId: string;
};

/**
 * This represents a user of the project
 */
export type User = {
  /** The ID of the user */
  id: string;
  /** The avatar url of the user */
  avatar: string;
  /** Full Name */
  name: string;
};

export type AnyNode =
  | EstimateNode
  | DerivativeNode
  | MetaforecastNode
  | ManifoldNode
  | ImageNode;

export type Tables = {
  /**
   * Stores graph related data
   */
  nodes?: Record<string, AnyNode>;
  /**
   * The database estimates that estimate nodes are linked to
   */
  links?: Record<string, Link>;
  /**
   * Users and their avatar urls
   */
  users?: Record<string, User>;
};

export type Values = {
  /**
   * The name of the project
   */
  name: string;
};

function createEstimate({
  uid,
  x,
  y,
  variableName,
  name = "",
}: {
  uid: string;
  x: number;
  y: number;
  variableName: string;
  name?: string;
}): EstimateNode {
  const estimate: EstimateNode = {
    type: "estimate",
    uid,
    x,
    y,
    name,
    variableName,
  };

  return estimate;
}

/**
 * Bulk create nodes
 */
export function useBulkCreateNodes() {
  const store = useStore();
  
  return useCallback((entries: { name: string }[]) => {
    if (!store) return;
    
    store.transaction(() => {
      entries.forEach(({ name }) => {
        const uid = nanoid();
        
        store.addRow("nodes", {
          type: "estimate",
          uid,
          x: 100,
          y: 100,
          name,
          variableName: getVariableName(store.getTable("nodes") as Tables["nodes"])
        });
      });
    });
  }, [store]);
}

/**
 * Bulk create nodes with links
 */
export function useBulkCreateEstimateNodesWithLinks() {
  const store = useStore();
  const presence = useUserPresence();
  
  return useCallback((entries: { name: string; value?: string }[]) => {
    if (!store) return;
    
    // Calculate grid layout with offset
    const GRID_SIZE = 200; // Space between nodes
    const NODES_PER_ROW = 5;
    const RANDOM_OFFSET = 20; // Maximum random offset
    
    store.transaction(() => {
      entries.forEach(({ name, value }, index) => {
        // Calculate grid position with random offset
        const row = Math.floor(index / NODES_PER_ROW);
        const col = index % NODES_PER_ROW;
        const baseX = 100 + (col * GRID_SIZE);
        const baseY = 100 + (row * GRID_SIZE);
        
        // Add small random offset to prevent perfect alignment
        const x = baseX + (Math.random() * RANDOM_OFFSET - RANDOM_OFFSET/2);
        const y = baseY + (Math.random() * RANDOM_OFFSET - RANDOM_OFFSET/2);
        
        const uid = nanoid();
        
        // Create the node
        store.addRow("nodes", {
          type: "estimate",
          uid,
          x,
          y,
          name,
          variableName: getVariableName(store.getTable("nodes") as Tables["nodes"])
        });

        // If a value was provided, create the link
        if (value) {
          // Get the node's ID
          const nodeId = Object.entries(store.getTable("nodes"))
            .find(([_, node]) => node.uid === uid)?.[0];

          if (!nodeId) throw new Error("Node ID not found");

          // Create link with the value
          store.addRow("links", {
            id: nanoid(),
            nodeId,
            owner: presence.id,
            value
          });
        }
      });
    });
  }, [store, presence]);
}

function createDerivative({
  uid,
  x,
  y,
  variableName,
  value,
}: {
  uid: string;
  x: number;
  y: number;
  variableName: string;
  value: string;
}): DerivativeNode {
  const derivative: DerivativeNode = {
    type: "derivative",
    uid,
    x,
    y,
    variableName,
    name: "",
    value,
  };

  return derivative;
}

/**
 * Helper to add Estimate and Node to Store
 */
export function useAddEstimateNode() {
  const store = useStore();
  return useCallback(
    ({ x, y }: { x: number; y: number }) => {
      if (!store) return;
      const uid = nanoid();
      const nodeId = store.addRow(
        "nodes",
        createEstimate({
          uid,
          x: x - 96,
          y,
          variableName: getVariableName(
            store.getTable("nodes") as Tables["nodes"]
          ),
        })
      );

      if (nodeId)
        useClientStore.setState({
          selectedNodes: [nodeId],
        });

      return uid;
    },
    [store]
  );
}



/**
 * Add a Derivative Node to the store
 */
export function useAddDerivativeNode() {
  const store = useStore();
  return useCallback(
    ({
      x,
      y,
      initialContent,
    }: {
      x: number;
      y: number;
      initialContent: string;
    }) => {
      if (!store) return;
      const uid = nanoid();

      const nodeId = store.addRow(
        "nodes",
        createDerivative({
          uid,
          x: x - 96,
          y,
          variableName: getVariableName(
            store.getTable("nodes") as Tables["nodes"]
          ),
          value: initialContent,
        })
      );

      requestAnimationFrame(() => {
        if (nodeId)
          useClientStore.setState({
            selectedNodes: [nodeId],
          });
      });
    },
    [store]
  );
}

/**
 * Adds a metaforecast node to the store
 */
export function useAddMetaforecastNode() {
  const store = useStore();
  return useCallback(
    ({ x, y, slug }: { x: number; y: number; slug: string }) => {
      if (!store) return;
      const uid = nanoid();

      store.addRow("nodes", {
        type: "metaforecast",
        uid,
        x: x - 112,
        y: y - 96,
        variableName: getVariableName(
          store.getTable("nodes") as Tables["nodes"]
        ),
        slug,
      });
    },
    [store]
  );
}

/**
 * Adds a manifold node to the store at the passed in location
 */
export function useAddManifoldNode() {
  const store = useStore();
  return useCallback(
    ({ x, y, marketId }: { x: number; y: number; marketId: string }) => {
      if (!store) return;
      const uid = nanoid();

      store.addRow("nodes", {
        type: "manifold",
        uid,
        x,
        y,
        variableName: getVariableName(
          store.getTable("nodes") as Tables["nodes"]
        ),
        marketId,
      });
    },
    [store]
  );
}

/**
 * Adds an image node to the store
 */
export function useAddImageNode() {
  const store = useStore();
  return useCallback(
    ({ x, y, url, width, height }: Omit<ImageNode, "uid" | "type">) => {
      if (!store) return;
      const uid = nanoid();

      store.addRow("nodes", {
        type: "image",
        uid,
        x,
        y,
        variableName: getVariableName(
          store.getTable("nodes") as Tables["nodes"]
        ),
        url,
        width,
        height,
      });
    },
    [store]
  );
}

/**
 * Resizes an image node
 */
export function useResizeImageNode() {
  const store = useStore();
  return useCallback(
    ({ id, width, height }: { id: string; width: number; height: number }) => {
      if (!store) return;
      // if the node is not an image node, return
      const node = store.getRow("nodes", id) as ImageNode;
      if (!node) return;
      if (node.type !== "image") return;
      store.setCell("nodes", id, "width", width);
      store.setCell("nodes", id, "height", height);
    },
    [store]
  );
}

/**
 * Moves a node of a given id
 */
export function useMoveNode() {
  const store = useStore();
  return useCallback(
    ({ id, x, y }: { id: string; x: number; y: number }) => {
      if (!store) return;
      store.transaction(() => {
        store.setCell("nodes", id, "x", x);
        store.setCell("nodes", id, "y", y);
      });
    },
    [store]
  );
}

/**
 * Deletes a node of a given id
 */
export function useDeleteNode() {
  const store = useStore();
  return useCallback(
    (nodeIdx: string) => {
      if (!store) return;
      const node = store.getRow("nodes", nodeIdx) as Node;
      if (!node) return;

      const links = store.getTable("links");
      const linksForNode = Object.entries(links).filter(([_, link]) => {
        return link.nodeId === nodeIdx;
      });

      store.delRow("nodes", nodeIdx);

      // Delete all links for this node
      linksForNode.forEach(([linkIdx]) => {
        store.delRow("links", linkIdx);
      });
    },
    [store]
  );
}

// function getRowIdByInnerId(store: Store, table: string, innerId: string) {
//   if (!store) return;
//   const rows = store.getTable(table);
//   const idx = Object.entries(rows).find(([_, row]) => {
//     return row.id === innerId;
//   })?.[0];
//   return idx;
// }

/**
 * Rename a node of a given id
 */
export function useRenameNode() {
  const store = useStore();
  return useCallback(
    ({ id, name }: { id: string; name: string }) => {
      if (!store) return;
      store.setCell("nodes", id, "name", name);
    },
    [store]
  );
}

/**
 * Get row from links table rows for a given estimate node
 */
export function useNodeLinks(id: string) {
  const store = useStore();
  if (!store) return;
  const links = store.getTable("links");
  const linksForNode = Object.entries(links).filter(([_, link]) => {
    return link.nodeId === id;
  });

  return linksForNode;
}

/**
 * Creates an estimate link given a user id and a node id
 */
export function useCreateEstimateLink() {
  const store = useStore();
  return useCallback(
    ({ nodeId, owner }: { nodeId: string; owner: string }) => {
      if (!store) return;
      const id = nanoid();
      store.addRow("links", {
        id,
        nodeId,
        owner,
        value: "",
      });
    },
    [store]
  );
}

/**
 * Deletes an estimate link
 */
export function useDeleteEstimateLink() {
  const store = useStore();
  return useCallback(
    ({ id }: { id: string }) => {
      if (!store) return;
      store.delRow("links", id);
    },
    [store]
  );
}

/**
 * Updates an estimate link
 */
export function useUpdateEstimateLink() {
  const store = useStore();
  return useCallback(
    ({ id, value }: { id: string; value: string }) => {
      if (!store) return;
      store.setCell("links", id, "value", value);
    },
    [store]
  );
}

/**
 * Updates a derivative node value
 */
export function useUpdateDerivativeValue() {
  const store = useStore();
  return useCallback(
    ({ id, value }: { id: string; value: string }) => {
      if (!store) return;
      store.setCell("nodes", id, "value", value);
    },
    [store]
  );
}

/**
 * Update the project name
 */
export function useUpdateProjectName() {
  const store = useStore();

  return useCallback(
    (name: string) => {
      if (!store) return;
      store.setValue("name", name);
    },
    [store]
  );
}

/** this function returns a string for a number following these rules
 * 1 returns "a"
 * 2 returns "b"
 * 27 returns "aa"
 * 28 returns "ab"
 */
function getLetterForNumber(num: number): string {
  const charCode = 96 + (num % 26 || 26); // adjust for 26%26=0 case
  const letter = String.fromCharCode(charCode);
  const remaining = Math.floor((num - 1) / 26); // subtract 1 before division
  if (remaining === 0) {
    return letter;
  } else {
    return getLetterForNumber(remaining) + letter; // reverse the order of concatenation
  }
}

function getVariableName(nodes?: Record<number, AnyNode>) {
  let count = 1;
  let name = getLetterForNumber(count);
  if (!nodes) {
    return name;
  }

  // Only nodes with variable names
  const nodesWithVariableNames = Object.values(nodes).filter(
    (node): node is EstimateNode | DerivativeNode | MetaforecastNode =>
      "variableName" in node
  );

  while (nodesWithVariableNames.some((node) => node.variableName === name)) {
    count++;
    name = getLetterForNumber(count);
  }
  return name;
}

/**
 * This creates an estimate node, and automatically links an existing estimate,
 * with it's value, to the node
 */
export function useCreateEstimateNodeWithLink() {
  const store = useStore();

  return useCallback(
    ({
      x,
      y,
      description,
      estimateId,
      value,
      ownerId,
    }: {
      x: number;
      y: number;
      description: string;
      estimateId: string;
      value: string;
      ownerId: string;
    }) => {
      if (!store) return;
      const uid = nanoid();

      store.transaction(() => {
        store.addRow(
          "nodes",

          // Create the node to add the estimate
          createEstimate({
            uid,
            x,
            y,
            name: description,
            variableName: getVariableName(
              store.getTable("nodes") as Tables["nodes"]
            ),
          })
        );

        //  Get the id of the node we just created
        const nodeId = Object.entries(store.getTable("nodes")).find(
          ([_, node]) => node.uid === uid
        )?.[0];

        if (!nodeId) throw new Error("Node ID not found");

        const link: Link = {
          id: estimateId,
          nodeId,
          owner: ownerId,
          value,
        };

        store.addRow("links", link);
      });
    },
    [store]
  );
}

export function useConnectNodes() {
  const store = useStore();

  return useCallback(
    ({ source, target }: { source: string; target: string }) => {
      if (!store) return;
      // we get the variable of the source
      const sourceVariable = store.getCell("nodes", source, "variableName");

      if (!sourceVariable) return;

      // get the value of the target
      const targetValue = store.getCell("nodes", target, "value");

      if (!targetValue) return;

      // Naive version: Wrap existing value in parens and multiply
      const newValue = `${targetValue} + ${sourceVariable}`;

      // Update the target node with the new value
      store.setCell("nodes", target, "value", newValue);
    },
    [store]
  );
}



---
File: /estimaker/app/src/lib/toNodesAndEdges.tsx
---

import { Edge, Node } from "reactflow";

import { EstimateNodeType } from "./canvasTypes";
import { MedianStore } from "./createMedianStore";
import { AnyNode, LinkWithSelfId, Tables } from "./store";

const squiggleReservedWords = ["to"];

/**
 * Finds variables in a value
 */
function getVariables(value: string) {
  const matches = value.matchAll(/([a-z]\w*)/gi);
  const safeMatches: string[] = [];
  for (const match of matches) {
    const variableName = match[1];
    if (squiggleReservedWords.includes(variableName)) continue;
    safeMatches.push(variableName);
  }
  return safeMatches;
}

export function createEdges(
  variableToNodeId: Record<string, string>,
  nodes?: Record<string, AnyNode>
) {
  const edges: Edge[] = [];

  if (!nodes) return edges;

  // loop only over derivative nodes
  for (const id in nodes) {
    const node = nodes[id];
    if (node.type !== "derivative") continue;

    const variables = getVariables(node.value);
    for (const variable of variables) {
      const nodeId = variableToNodeId[variable];
      if (!nodeId) continue;

      edges.push({
        id: `${id}-${nodeId}`,
        source: nodeId,
        target: id,
        style: { stroke: "#000" },
      });
    }
  }

  return edges;
}

export function createVariableToNodeId(state: Tables) {
  const variableToNodeId: Record<string, string> = {};
  if (state.nodes) {
    for (const id in state.nodes) {
      const node = state.nodes[id];
      if (!("variableName" in node)) continue;
      variableToNodeId[node.variableName] = id;
    }
  }
  return variableToNodeId;
}

export function createNodes({
  state,
  selectedNodes,
  variableWithErrorName,
  medianStore,
  cursors,
}: {
  state: Tables;
  selectedNodes: string[];
  variableWithErrorName?: string | null;
  medianStore: MedianStore;
  cursors: Record<string, { x: number; y: number }>;
}): Node[] {
  const nodes: Node[] = [];
  if (!state.nodes) return nodes;

  let userIdToAvatar: Record<string, string> = {};
  if (state.users) {
    userIdToAvatar = Object.fromEntries(
      Object.values(state.users).map((user) => [user.id, user.avatar])
    );
  }

  for (const id in state.nodes) {
    const node = state.nodes[id];

    switch (node.type) {
      case "estimate": {
        // get links and add to node
        let links: LinkWithSelfId[] = [];
        if (state.links) {
          links = Object.entries(state.links)
            .filter(([_selfId, link]) => link.nodeId === id)
            .map(([selfId, link]) => {
              const { owner } = link;
              if (state.users) {
                const presence = Object.values(state.users).find(
                  (user) => user.id === owner
                );
                if (presence) return { ...link, selfId, presence };
              }
              return { ...link, selfId };
            });
        }

        const n: EstimateNodeType = {
          id,
          position: { x: node.x, y: node.y },
          type: "estimate",
          selected: selectedNodes.includes(id),
          data: {
            label: node.name,
            variableName: node.variableName,
            links,
            hasError: node.variableName === variableWithErrorName,
          },
        };

        nodes.push(n);

        break;
      }
      case "derivative": {
        nodes.push({
          id,
          position: { x: node.x, y: node.y },
          type: "derivative",
          selected: selectedNodes.includes(id),
          data: {
            label: node.name,
            value: node.value,
            variableName: node.variableName,
            medians: medianStore[node.variableName],
          },
        });

        break;
      }
      case "metaforecast": {
        nodes.push({
          id,
          position: { x: node.x, y: node.y },
          type: "metaforecast",
          selected: selectedNodes.includes(id),
          data: {
            slug: node.slug,
          },
        });

        break;
      }
      case "manifold": {
        nodes.push({
          id,
          position: { x: node.x, y: node.y },
          type: "manifold",
          selected: selectedNodes.includes(id),
          data: {
            marketId: node.marketId,
          },
        });

        break;
      }

      case "image": {
        nodes.push({
          id,
          position: { x: node.x, y: node.y },
          type: "image",
          selected: selectedNodes.includes(id),
          data: {
            url: node.url,
            width: node.width,
            height: node.height,
          },
        });
        break;
      }
    }
  }

  // add cursors
  for (const id in cursors) {
    const cursor = cursors[id];
    if (state.users) {
      state.users[id];
    }
    nodes.push({
      id,
      position: { x: cursor.x, y: cursor.y },
      type: "cursor",
      selected: false,
      selectable: false,
      draggable: false,
      data: {
        avatar: userIdToAvatar[id],
      },
    });
  }

  // move all image nodes to the beginning
  nodes.sort((a, b) => {
    if (a.type === "image" && b.type !== "image") return -1;
    if (a.type !== "image" && b.type === "image") return 1;
    return 0;
  });

  return nodes;
}



---
File: /estimaker/app/src/lib/useCanvasKeybinds.ts
---

import { useCallback, useEffect } from "react";
import { useReactFlow } from "reactflow";

import { useToast } from "@/components/ui/use-toast";

import { useAddImageNode } from "./store";

/**
 * This captures key events on the window when the canvas
 * is on the screen.
 */
export function useCanvasKeybinds() {
  const { toast } = useToast();
  const addImageNode = useAddImageNode();
  const { getViewport } = useReactFlow();

  // upload image
  const uploadImage = useCallback(
    async (file: File) => {
      toast({
        title: "Uploading...",
        variant: "default",
        duration: 3000,
        description: "Your image is uploading.",
      });

      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`/api/upload?filename=${file.name}`, {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      const url = json.url;

      // Get the dimensions of the image
      const img = new Image();
      img.src = url;
      await img.decode();
      const width = img.width;
      const height = img.height;

      // Get center of viewport
      const viewport = getViewport();

      // Add the image node
      addImageNode({
        url,
        width,
        height,
        x: viewport.x,
        y: viewport.y,
      });
    },
    [addImageNode, getViewport, toast]
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Only prevent paste if we're not in an input or textarea
      if ((e.ctrlKey || e.metaKey) && e.key === "v") {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          void (async () => {
            // Check if what is on the clipboard is an image.
            const clipboardItems = await navigator.clipboard.read();
            const image = clipboardItems.find((item) => {
              return item.types.includes("image/png");
            });
            // Log it
            if (image) {
              const blob = await image.getType("image/png");
              const file = new File([blob], "image.png", {
                type: "image/png",
              });
              const url = await uploadImage(file);
              console.log(url);
            }

            // If it is an image, convert it to a blob and then to a file.
          })();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [uploadImage]);
}



---
File: /estimaker/app/src/lib/useClientStore.ts
---

import { create } from "zustand";

type ClientStore = {
  selectedNodes: string[];
  sidebarTab?: "search" | "squiggle";
  isReady: boolean;
};

export const useClientStore = create<ClientStore>()((_set) => ({
  selectedNodes: [],
  isReady: false,
}));

export function setIsReady() {
  useClientStore.setState({ isReady: true });
}



---
File: /estimaker/app/src/lib/useCursorsStore.ts
---

import { create } from "zustand";

type CursorsStore = { cursors: Record<string, { x: number; y: number }> };

export const useCursorsStore = create<CursorsStore>(() => ({
  cursors: {},
}));

export function setUserPosition(id: string, x: number, y: number) {
  useCursorsStore.setState((state) => {
    return {
      cursors: {
        ...state.cursors,
        [id]: { x, y },
      },
    };
  });
}

export function removeUser(id: string) {
  useCursorsStore.setState((state) => {
    const cursors = { ...state.cursors };
    delete cursors[id];
    return { cursors };
  });
}



---
File: /estimaker/app/src/lib/useDebounce.ts
---

import { useEffect, useState } from "react";

/**
 * Debounce a value
 */
export function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  // Update debounced value after delay
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel the timeout if value changes
    // This is how we prevent debounced value from updating if value is changed within the delay period
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}



---
File: /estimaker/app/src/lib/useProject.ts
---

import { useContext } from "react";

import { ProjectContext } from "@/components/ProjectContextProvider";

/**
 * Custom hook to use the project context, which
 * is the project that is in the database.
 *
 * @returns The project
 */
export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context.project;
}

/**
 * Get the setProject function from the project context.
 *
 * @returns The setProject function
 */
export function useSetProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useSetProject must be used within a ProjectProvider");
  }
  return context.setProject;
}



---
File: /estimaker/app/src/lib/useSelectedNodeType.ts
---

import { useStore } from "tinybase/debug/ui-react";

export function useSelectedNodeType(id?: string) {
  const store = useStore();
  if (!id) return null;
  return store?.getRow("nodes", id)?.type;
}



---
File: /estimaker/app/src/lib/useSquiggleCode.ts
---

import { Edge } from "reactflow";
import t from "toposort";

import { Tables } from "./store";

export function useSquiggleCode(tables: Tables, edges: Edge[], userId: string) {
  return createSquiggleCode(tables, edges, userId);
}

/** Here we create the squiggle code */
export function createSquiggleCode(
  tables: Tables,
  edges: Edge[],
  userId: string
) {
  const { nodes, links } = tables;
  if (!nodes) return "";
  const deps = edges.map((e) => [e.source, e.target] as [string, string]);
  const sorted = t.array(Object.keys(nodes), deps);
  const squiggleCode = sorted
    .map((id) => {
      const node = nodes[id];
      if (!("variableName" in node)) return "";

      let value = "1"; // default value
      if (node.type === "derivative") {
        value = node.value;
      } else if (node.type === "estimate") {
        if (links) {
          // find the links for this node
          const nodeLinks = Object.values(links).filter(
            (link) => link.nodeId === id
          );

          if (nodeLinks.length > 0) {
            // find the link for this user
            const userLink = nodeLinks.find((link) => link.owner === userId);

            // if there is a link for this user, use that value
            if (userLink) {
              value = userLink.value;
            }

            // if there is no link for this user, use the first value
            else {
              value = nodeLinks[0].value;
            }
          }
        }
      }
      return `${node.variableName} = ${value}`;
    })
    .join("\n");

  // now put a colon at the end of every line except the last one
  // this is because squiggle requires a colon at the end of every line
  // except the last one
  const lines = squiggleCode.split("\n");
  const lastLine = lines.pop();
  const newLines = lines.map((line) => line + ";");
  if (lastLine) newLines.push(lastLine);
  return newLines.join("\n");
}



---
File: /estimaker/app/src/lib/useSquiggleRunResult.ts
---

import {
  result,
  resultMap,
  SqDict,
  SqDictValue,
  SqError,
  SqValue,
} from "@quri/squiggle-lang";

import { useRunnerState, useSquiggle } from "../lib/squiggle-hooks";

type SquiggleOutput = {
  output: result<
    {
      result: SqValue;
      bindings: SqDict;
    },
    SqError
  >;
  code: string;
  executionId: number;
  executionTime: number;
};

function getResultVariables({
  output,
}: SquiggleOutput): result<SqDictValue, SqError> {
  return resultMap(output, (value) => value.bindings.asValue());
}

function getResultValue({
  output,
}: SquiggleOutput): result<SqValue, SqError> | undefined {
  if (output.ok) {
    const isResult = output.value.result.tag !== "Void";
    return isResult ? { ok: true, value: output.value.result } : undefined;
  } else {
    return output;
  }
}

export function useSquiggleRunResult(code: string) {
  const runnerState = useRunnerState(code);

  const [squiggleOutput, { isRunning }] = useSquiggle({
    code: runnerState.renderedCode,
    executionId: runnerState.executionId,
  });

  let resultVariables: result<SqDictValue, SqError> | undefined = undefined,
    resultItem: result<SqValue, SqError> | undefined = undefined;
  if (squiggleOutput) {
    resultVariables = getResultVariables(squiggleOutput);
    resultItem = getResultValue(squiggleOutput);
  }

  let variableWithErrorName: string | null = null;
  if (squiggleOutput?.output.ok === false) {
    variableWithErrorName = variableWithError(squiggleOutput, code);
  }

  return {
    squiggleOutput,
    resultVariables,
    resultItem,
    isRunning,
    variableWithErrorName,
  };
}

function variableWithError(
  output?: SquiggleOutput,
  code?: string
): string | null {
  if (!output) return null;
  if (!code) return null;
  if (output.output.ok) return null;
  if (output.output.value.tag === "compile") {
    const line = output.output.value.location().start.line;
    const lines = code.split("\n");
    if (lines.length < line) return null;
    const variableLine = lines[line - 1];
    const variable = variableLine.split(" ")[0];
    return variable;
  }

  return null;
}



---
File: /estimaker/app/src/lib/utils.ts
---

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



---
File: /estimaker/db/prisma/migrations/20231109203104_initial/migration.sql
---

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "state" JSONB NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Estimate" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "Estimate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectEstimate" (
    "projectId" TEXT NOT NULL,
    "estimateId" TEXT NOT NULL,

    CONSTRAINT "ProjectEstimate_pkey" PRIMARY KEY ("projectId","estimateId")
);

-- AddForeignKey
ALTER TABLE "ProjectEstimate" ADD CONSTRAINT "ProjectEstimate_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectEstimate" ADD CONSTRAINT "ProjectEstimate_estimateId_fkey" FOREIGN KEY ("estimateId") REFERENCES "Estimate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;



---
File: /estimaker/db/prisma/migrations/20231113162556_created_updated/migration.sql
---

-- AlterTable
ALTER TABLE "Estimate" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ProjectEstimate" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;



---
File: /estimaker/db/prisma/migrations/20231113174438_cascade_delete/migration.sql
---

-- DropForeignKey
ALTER TABLE "ProjectEstimate" DROP CONSTRAINT "ProjectEstimate_estimateId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectEstimate" DROP CONSTRAINT "ProjectEstimate_projectId_fkey";

-- AddForeignKey
ALTER TABLE "ProjectEstimate" ADD CONSTRAINT "ProjectEstimate_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectEstimate" ADD CONSTRAINT "ProjectEstimate_estimateId_fkey" FOREIGN KEY ("estimateId") REFERENCES "Estimate"("id") ON DELETE CASCADE ON UPDATE CASCADE;



---
File: /estimaker/db/prisma/migrations/migration_lock.toml
---

# Please do not edit this file manually
# It should be added in your version-control system (i.e. Git)
provider = "postgresql"


---
File: /estimaker/db/prisma/schema.prisma
---

// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Project {
  id              String            @id @default(uuid())
  ownerId         String
  name            String
  projectEstimate ProjectEstimate[]
  state           Json
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @default(now()) @updatedAt
}

model Estimate {
  id              String            @id @default(uuid())
  ownerId         String
  description     String
  value           String
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @default(now()) @updatedAt
  projectEstimate ProjectEstimate[]
}

model ProjectEstimate {
  project    Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  projectId  String
  estimate   Estimate @relation(fields: [estimateId], references: [id], onDelete: Cascade)
  estimateId String
  createdAt  DateTime @default(now())
  updatedAt  DateTime @default(now()) @updatedAt

  @@id([projectId, estimateId])
}
