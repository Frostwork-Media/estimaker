import { nanoid } from "nanoid";
import { useCallback } from "react";
import { useStore } from "tinybase/debug/ui-react";

import { useClientStore } from "./useClientStore";

type Node = {
  /** A concatenation of the [type]:[id] */
  uid: string;
  /** X Position */
  x: number;
  /** Y Position */
  y: number;
};

export type EstimateNode = Node & {
  /** Base Type */
  type: "estimate";
  /** This is the variable name, or a nice name given to it. Changing this changes all linked estimates on the backend */
  name: string;
  /** Variable Name */
  variableName: string;
  // /** A record which contains owner id to estimate id links */
  // links: Record<string, string>;
};

export type DerivativeNode = Node & {
  /** Base Type */
  type: "derivative";
  /** The semantic meaning */
  name: string;
  /** Variable Name */
  variableName: string;
  /** The squiggle content */
  value: string;
};

export type MetaforecastNode = Node & {
  type: "metaforecast";
  /** The metaforecast slug */
  slug: string;
  /** A variable name, currently unused but maybe in the future */
  variableName: string;
};

export type ImageNode = Node & {
  type: "image";
  /** The image url */
  url: string;
  /** The rendered width */
  width: number;
  /** The rendered height */
  height: number;
};

/**
 * This represents a row from the estimates table in the db
 */
export type Link = {
  /** The ID of the estimate in the database */
  id: string;
  /** The ID of the node to which this link belongs */
  nodeId: string;
  /** Owner ID */
  owner: string;
  /** The squiggle content */
  value: string;
};

export type LinkWithSelfId = Link & {
  selfId: string;
};

/**
 * This represents a user of the project
 */
export type User = {
  /** The ID of the user */
  id: string;
  /** The avatar url of the user */
  avatar: string;
  /** Full Name */
  name: string;
};

export type AnyNode =
  | EstimateNode
  | DerivativeNode
  | MetaforecastNode
  | ImageNode;

export type Tables = {
  /**
   * Stores graph related data
   */
  nodes?: Record<string, AnyNode>;
  /**
   * The database estimates that estimate nodes are linked to
   */
  links?: Record<string, Link>;
  /**
   * Users and their avatar urls
   */
  users?: Record<string, User>;
};

export type Values = {
  /**
   * The name of the project
   */
  name: string;
};

function createEstimate({
  uid,
  x,
  y,
  variableName,
  name = "",
}: {
  uid: string;
  x: number;
  y: number;
  variableName: string;
  name?: string;
}): EstimateNode {
  const estimate: EstimateNode = {
    type: "estimate",
    uid,
    x,
    y,
    name,
    variableName,
  };

  return estimate;
}

function createDerivative({
  uid,
  x,
  y,
  variableName,
  value,
}: {
  uid: string;
  x: number;
  y: number;
  variableName: string;
  value: string;
}): DerivativeNode {
  const derivative: DerivativeNode = {
    type: "derivative",
    uid,
    x,
    y,
    variableName,
    name: "",
    value,
  };

  return derivative;
}

/**
 * Helper to add Estimate and Node to Store
 */
export function useAddEstimateNode() {
  const store = useStore();
  return useCallback(
    ({ x, y }: { x: number; y: number }) => {
      if (!store) return;
      const uid = nanoid();
      const nodeId = store.addRow(
        "nodes",
        createEstimate({
          uid,
          x: x - 96,
          y,
          variableName: getVariableName(
            store.getTable("nodes") as Tables["nodes"]
          ),
        })
      );

      if (nodeId)
        useClientStore.setState({
          selectedNodes: [nodeId],
        });

      return uid;
    },
    [store]
  );
}

/**
 * Add a Derivative Node to the store
 */
export function useAddDerivativeNode() {
  const store = useStore();
  return useCallback(
    ({
      x,
      y,
      initialContent,
    }: {
      x: number;
      y: number;
      initialContent: string;
    }) => {
      if (!store) return;
      const uid = nanoid();

      const nodeId = store.addRow(
        "nodes",
        createDerivative({
          uid,
          x: x - 96,
          y,
          variableName: getVariableName(
            store.getTable("nodes") as Tables["nodes"]
          ),
          value: initialContent,
        })
      );

      requestAnimationFrame(() => {
        if (nodeId)
          useClientStore.setState({
            selectedNodes: [nodeId],
          });
      });
    },
    [store]
  );
}

/**
 * Adds a metaforecast node to the store
 */
export function useAddMetaforecastNode() {
  const store = useStore();
  return useCallback(
    ({ x, y, slug }: { x: number; y: number; slug: string }) => {
      if (!store) return;
      const uid = nanoid();

      store.addRow("nodes", {
        type: "metaforecast",
        uid,
        x: x - 112,
        y: y - 96,
        variableName: getVariableName(
          store.getTable("nodes") as Tables["nodes"]
        ),
        slug,
      });
    },
    [store]
  );
}

/**
 * Adds an image node to the store
 */
export function useAddImageNode() {
  const store = useStore();
  return useCallback(
    ({ x, y, url, width, height }: Omit<ImageNode, "uid" | "type">) => {
      if (!store) return;
      const uid = nanoid();

      store.addRow("nodes", {
        type: "image",
        uid,
        x,
        y,
        variableName: getVariableName(
          store.getTable("nodes") as Tables["nodes"]
        ),
        url,
        width,
        height,
      });
    },
    [store]
  );
}

/**
 * Moves a node of a given id
 */
export function useMoveNode() {
  const store = useStore();
  return useCallback(
    ({ id, x, y }: { id: string; x: number; y: number }) => {
      if (!store) return;
      store.transaction(() => {
        store.setCell("nodes", id, "x", x);
        store.setCell("nodes", id, "y", y);
      });
    },
    [store]
  );
}

/**
 * Deletes a node of a given id
 */
export function useDeleteNode() {
  const store = useStore();
  return useCallback(
    (nodeIdx: string) => {
      if (!store) return;
      const node = store.getRow("nodes", nodeIdx) as Node;
      if (!node) return;

      const links = store.getTable("links");
      const linksForNode = Object.entries(links).filter(([_, link]) => {
        return link.nodeId === nodeIdx;
      });

      store.delRow("nodes", nodeIdx);

      // Delete all links for this node
      linksForNode.forEach(([linkIdx]) => {
        store.delRow("links", linkIdx);
      });
    },
    [store]
  );
}

// function getRowIdByInnerId(store: Store, table: string, innerId: string) {
//   if (!store) return;
//   const rows = store.getTable(table);
//   const idx = Object.entries(rows).find(([_, row]) => {
//     return row.id === innerId;
//   })?.[0];
//   return idx;
// }

/**
 * Rename a node of a given id
 */
export function useRenameNode() {
  const store = useStore();
  return useCallback(
    ({ id, name }: { id: string; name: string }) => {
      if (!store) return;
      store.setCell("nodes", id, "name", name);
    },
    [store]
  );
}

/**
 * Get row from links table rows for a given estimate node
 */
export function useNodeLinks(id: string) {
  const store = useStore();
  if (!store) return;
  const links = store.getTable("links");
  const linksForNode = Object.entries(links).filter(([_, link]) => {
    return link.nodeId === id;
  });

  return linksForNode;
}

/**
 * Creates an estimate link given a user id and a node id
 */
export function useCreateEstimateLink() {
  const store = useStore();
  return useCallback(
    ({ nodeId, owner }: { nodeId: string; owner: string }) => {
      if (!store) return;
      const id = nanoid();
      store.addRow("links", {
        id,
        nodeId,
        owner,
        value: ".2 to .5",
      });
    },
    [store]
  );
}

/**
 * Deletes an estimate link
 */
export function useDeleteEstimateLink() {
  const store = useStore();
  return useCallback(
    ({ id }: { id: string }) => {
      if (!store) return;
      store.delRow("links", id);
    },
    [store]
  );
}

/**
 * Updates an estimate link
 */
export function useUpdateEstimateLink() {
  const store = useStore();
  return useCallback(
    ({ id, value }: { id: string; value: string }) => {
      if (!store) return;
      store.setCell("links", id, "value", value);
    },
    [store]
  );
}

/**
 * Updates a derivative node value
 */
export function useUpdateDerivativeValue() {
  const store = useStore();
  return useCallback(
    ({ id, value }: { id: string; value: string }) => {
      if (!store) return;
      store.setCell("nodes", id, "value", value);
    },
    [store]
  );
}

/**
 * Update the project name
 */
export function useUpdateProjectName() {
  const store = useStore();

  return useCallback(
    (name: string) => {
      if (!store) return;
      store.setValue("name", name);
    },
    [store]
  );
}

/** this function returns a string for a number following these rules
 * 1 returns "a"
 * 2 returns "b"
 * 27 returns "aa"
 * 28 returns "ab"
 */
function getLetterForNumber(num: number): string {
  const charCode = 96 + (num % 26 || 26); // adjust for 26%26=0 case
  const letter = String.fromCharCode(charCode);
  const remaining = Math.floor((num - 1) / 26); // subtract 1 before division
  if (remaining === 0) {
    return letter;
  } else {
    return getLetterForNumber(remaining) + letter; // reverse the order of concatenation
  }
}

function getVariableName(nodes?: Record<number, AnyNode>) {
  let count = 1;
  let name = getLetterForNumber(count);
  if (!nodes) {
    return name;
  }

  // Only nodes with variable names
  const nodesWithVariableNames = Object.values(nodes).filter(
    (node): node is EstimateNode | DerivativeNode | MetaforecastNode =>
      "variableName" in node
  );

  while (nodesWithVariableNames.some((node) => node.variableName === name)) {
    count++;
    name = getLetterForNumber(count);
  }
  return name;
}

/**
 * This creates an estimate node, and automatically links an existing estimate,
 * with it's value, to the node
 */
export function useCreateEstimateNodeWithLink() {
  const store = useStore();

  return useCallback(
    ({
      x,
      y,
      description,
      estimateId,
      value,
      ownerId,
    }: {
      x: number;
      y: number;
      description: string;
      estimateId: string;
      value: string;
      ownerId: string;
    }) => {
      if (!store) return;
      const uid = nanoid();

      store.transaction(() => {
        store.addRow(
          "nodes",

          // Create the node to add the estimate
          createEstimate({
            uid,
            x,
            y,
            name: description,
            variableName: getVariableName(
              store.getTable("nodes") as Tables["nodes"]
            ),
          })
        );

        //  Get the id of the node we just created
        const nodeId = Object.entries(store.getTable("nodes")).find(
          ([_, node]) => node.uid === uid
        )?.[0];

        if (!nodeId) throw new Error("Node ID not found");

        const link: Link = {
          id: estimateId,
          nodeId,
          owner: ownerId,
          value,
        };

        store.addRow("links", link);
      });
    },
    [store]
  );
}

export function useConnectNodes() {
  const store = useStore();

  return useCallback(
    ({ source, target }: { source: string; target: string }) => {
      if (!store) return;
      // we get the variable of the source
      const sourceVariable = store.getCell("nodes", source, "variableName");

      if (!sourceVariable) return;

      // get the value of the target
      const targetValue = store.getCell("nodes", target, "value");

      if (!targetValue) return;

      // Naive version: Wrap existing value in parens and multiply
      const newValue = `(${targetValue}) * ${sourceVariable}`;

      // Update the target node with the new value
      store.setCell("nodes", target, "value", newValue);
    },
    [store]
  );
}
