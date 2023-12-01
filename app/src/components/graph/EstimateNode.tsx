import { Handle, Position } from "reactflow";

import { UserPresence, useUser } from "@/lib/hooks";

import { EstimateNodeProps } from "../../lib/canvasTypes";
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
          {props.data.links.map((link) => (
            <div
              key={link.id}
              className="flex items-center justify-start text-xs text-left gap-2 bg-indigo-50 rounded-full"
            >
              <Avatar
                presence={"presence" in link ? link.presence : undefined}
              />
              <span className="text-indigo-700 font-mono tracking-tighter text-[11px] text-center grow pr-6">
                {link.value}
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

function Avatar({ presence }: { presence?: UserPresence }) {
  return (
    <div
      style={
        presence
          ? {
              backgroundImage: `url(${presence.avatar})`,
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
