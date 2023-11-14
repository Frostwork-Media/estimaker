import { Node, NodeProps } from "reactflow";

import { UserPresence } from "./hooks";
import { Link } from "./store";

type Estimate = {
  label: string;
  variableName: string;
  links: (Link | (Link & { presence: UserPresence }))[];
};

export type EstimateNodeProps = NodeProps<Estimate>;
export type EstimateNodeType = Node<Estimate>;
