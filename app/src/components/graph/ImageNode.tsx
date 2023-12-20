import { NodeProps, NodeResizer } from "reactflow";

export function ImageNode(
  props: NodeProps<{ url: string; width: number; height: number }>
) {
  const { url, width, height } = props.data;

  // render it as a full background, size cover
  return (
    <>
      <NodeResizer keepAspectRatio={true} isVisible={props.selected} />
      <div
        className="bg-neutral-100 bg-cover bg-center z-[-2] rounded-md"
        style={{
          backgroundImage: `url(${url})`,
          width,
          height,
        }}
      />
    </>
  );
}
