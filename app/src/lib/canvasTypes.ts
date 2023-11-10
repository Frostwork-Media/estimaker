import { Node, NodeProps } from "reactflow";

import { Link } from "./store";

type Estimate = {
  label: string;
  variableName: string;
  links: Link[];
};

export type EstimateNodeProps = NodeProps<Estimate>;
export type EstimateNodeType = Node<Estimate>;
