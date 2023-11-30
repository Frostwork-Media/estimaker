import { Node, NodeProps } from "reactflow";

import { UserPresence } from "./hooks";
import { LinkWithSelfId } from "./store";

type Estimate = {
  label: string;
  variableName: string;
  links: (LinkWithSelfId | (LinkWithSelfId & { presence: UserPresence }))[];
};

export type EstimateNodeProps = NodeProps<Estimate>;
export type EstimateNodeType = Node<Estimate>;
