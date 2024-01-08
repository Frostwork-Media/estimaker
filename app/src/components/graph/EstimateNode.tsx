import { Handle, Position } from "reactflow";

import { useUser } from "@/lib/hooks";

import { EstimateNodeProps } from "../../lib/canvasTypes";
import { Avatar } from "./Avatar";
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
          {link ? <EstimateSlider link={link} /> : null}
          {props.data.links.map((link) => {
            return (
              <div
                key={link.id}
                className="flex items-center justify-start text-xs text-left gap-2 bg-indigo-50 rounded-full"
              >
                <Avatar
                  avatar={"presence" in link ? link.presence.avatar : undefined}
                />
                <span className="text-indigo-700 font-mono tracking-tighter text-[11px] text-center grow pr-6">
                  {link.value}
                </span>
              </div>
            );
          })}
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
