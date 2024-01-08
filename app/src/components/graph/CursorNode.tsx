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
