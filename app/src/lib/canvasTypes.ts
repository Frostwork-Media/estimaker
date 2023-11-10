import { NodeProps } from "reactflow";
import { Link } from "./tinybase-store";

export type EstimateNodeType = NodeProps<{
  label: string;
  variableName: string;
  links: Link[];
}>;
