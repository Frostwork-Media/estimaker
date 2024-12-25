import { Handle, NodeProps, Position, useEdges } from "reactflow";
import { useTables } from "tinybase/debug/ui-react";

import { useUser } from "@/lib/hooks";
import { useSquiggleCode } from "@/lib/useSquiggleCode";

import { ValueRow } from "./ValueRow";
import { Wrapper } from "./Wrapper";

export function DerivativeNode(props: NodeProps) {
  const tables = useTables();
  const edges = useEdges();

  const { id: userId } = useUser();
  const code = useSquiggleCode(tables, edges, userId, props.data.variableName);

  return (
    <>
      <Handle type="target" position={Position.Top} className="!-top-3 !border-none !w-1 !h-1" />
      <Wrapper 
        label={props.data.label} 
        variableName={props.data.variableName} 
        selected={!!props.selected} 
        nodeType="derivative" 
        id={props.id}
      >
        <div className="grid gap-1 p-2 w-full">
          <ValueRow 
            value={props.data.value}
            variableName={props.data.variableName}
            bgColor="bg-emerald-50" 
            textColor="text-emerald-700"
            modalTitle="Formula"
            code={code}
          />
        </div>
      </Wrapper>
      <Handle type="source" position={Position.Bottom} className="!-bottom-3 !border-none !w-1 !h-1" />
    </>
  );
}