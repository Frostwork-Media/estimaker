import { Handle, NodeProps, Position } from "reactflow";

import { Wrapper } from "./shared";

export function DerivativeNode(props: NodeProps) {
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <Wrapper
        label={props.data.label}
        variableName={props.data.variableName}
        selected={!!props.selected}
        nodeType="derivative"
      >
        <div className="mt-2 w-full">
          <p className="font-mono text-xs bg-emerald-200 text-emerald-700 w-full text-white p-1">
            {props.data.value}
          </p>
        </div>
      </Wrapper>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}
