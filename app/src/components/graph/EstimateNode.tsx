import { Handle, Position } from "reactflow";

import { UserPresence } from "@/lib/hooks";

import { EstimateNodeProps } from "../../lib/canvasTypes";
import { Wrapper } from "./Wrapper";

export function EstimateNode(props: EstimateNodeProps) {
  return (
    <>
      <Wrapper
        label={props.data.label}
        variableName={props.data.variableName}
        selected={!!props.selected}
        nodeType="estimate"
        id={props.id}
      >
        <div className="mt-2 grid gap-1 p-1">
          {props.data.links.map((link) => (
            <div
              key={link.id}
              className="flex items-center justify-start text-xs text-left gap-2"
            >
              <Avatar
                presence={"presence" in link ? link.presence : undefined}
              />
              <span className="text-neutral-500">{link.value}</span>
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
