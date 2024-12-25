import { Handle, Position } from "reactflow";

import { useUser } from "@/lib/hooks";

import { EstimateNodeProps } from "../../lib/canvasTypes";
import { EstimateSlider } from "./EstimateSlider";
import { ValueRow } from './ValueRow';
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
        <div className="grid gap-1 p-2 w-full">
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