import { Handle, NodeProps, Position } from "reactflow";

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
        <div className="mt-2 w-full p-1">
          <p className="font-mono text-[10px] bg-emerald-100 text-emerald-700 w-full p-1 rounded">
            {props.data.value}
          </p>
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
