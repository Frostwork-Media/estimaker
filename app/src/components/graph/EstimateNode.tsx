import { Handle, Position } from "reactflow";
import { useTable } from "tinybase/debug/ui-react";

import { EstimateNodeProps } from "../../lib/canvasTypes";
import { User } from "../../lib/store";
import { Wrapper } from "./shared";

export function EstimateNode(props: EstimateNodeProps) {
  return (
    <>
      <Wrapper
        color="indigo"
        label={props.data.label}
        variableName={props.data.variableName}
        selected={!!props.selected}
      >
        <div className="mt-4 grid gap-1">
          {props.data.links.map((link) => (
            <div
              key={link.id}
              className="flex items-center justify-start text-slate-500 text-sm gap-2"
            >
              <Avatar userId={link.owner} />
              <span>{link.value}</span>
            </div>
          ))}
        </div>
      </Wrapper>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}

function Avatar({ userId }: { userId: string }) {
  const users = useTable("users") as Record<string, User>;
  const user = Object.values(users).find((u) => u.id === userId);
  return (
    <div
      style={
        user
          ? {
              backgroundImage: `url(${user.avatarUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center center",
              backgroundRepeat: "no-repeat",
            }
          : {}
      }
      className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center text-gray-500 text-sm font-semibold"
    />
  );
}
