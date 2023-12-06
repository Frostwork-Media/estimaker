import { Handle, NodeProps, Position } from "reactflow";

import { MedianStoreMedian } from "@/lib/createMedianStore";

import { Avatar } from "./Avatar";
import { Wrapper } from "./Wrapper";

export function DerivativeNode(props: NodeProps) {
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="!-top-3 !border-none !w-1 !h-1"
      />
      <Wrapper
        label={props.data.label}
        variableName={props.data.variableName}
        selected={!!props.selected}
        nodeType="derivative"
        id={props.id}
      >
        <div className="mt-2 w-full p-2">
          <p className="font-mono text-[10px] bg-emerald-100 text-emerald-700 w-full p-1 rounded-full">
            {props.data.value}
          </p>
        </div>
        <div className="grid gap-1 p-2">
          {props.data.medians?.map((median: MedianStoreMedian) => (
            <div
              key={median.userId}
              className="flex items-center justify-start text-xs text-left gap-2 bg-emerald-50 rounded-full"
            >
              <Avatar avatar={median.avatar} />
              <span className="text-emerald-700 font-mono tracking-tighter text-[11px] text-center grow pr-6">
                {median.value.toFixed(2)}
              </span>
            </div>
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
