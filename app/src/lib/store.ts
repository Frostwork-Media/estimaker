import { useClerk } from "@clerk/clerk-react";
import { nanoid } from "nanoid";
import { useCallback } from "react";
import { useStore } from "tinybase/debug/ui-react";

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

/**
 * This represents a user of the project
 */
export type User = {
  /** The ID of the user */
  id: string;
  /** The avatar url of the user */
  avatarUrl: string;
  /** Full Name */
  name: string;
};

export type AnyNode = EstimateNode | DerivativeNode | MetaforecastNode;

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
  name = "Estimate...",
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
    name: "Derivative...",
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
      store.addRow(
        "nodes",
        createEstimate({
          uid,
          x,
          y,
          variableName: getVariableName(
            store.getTable("nodes") as Tables["nodes"]
          ),
        })
      );
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

      store.addRow(
        "nodes",
        createDerivative({
          uid,
          x,
          y,
          variableName: getVariableName(
            store.getTable("nodes") as Tables["nodes"]
          ),
          value: initialContent,
        })
      );
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
        x,
        y,
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

/**
 * Sets the users id and avatar url in the store,
 * if it's not already set
 */
export function useSetUser() {
  const store = useStore();
  return useCallback(
    (user: ReturnType<typeof useClerk>["user"]) => {
      if (!store || !user) return;
      const users = store.getTable("users");
      if (Object.values(users).some((u) => u.id === user.id)) return;
      store.addRow("users", {
        id: user.id,
        avatarUrl: user.imageUrl,
        name:
          user.fullName ??
          user.firstName ??
          user.emailAddresses[0].emailAddress,
      });
    },
    [store]
  );
}

function getVariableName<T extends { variableName: string }>(
  nodes?: Record<number, T>
) {
  let count = 1;
  let name = `x${count}`;
  if (!nodes) {
    return name;
  }
  while (Object.values(nodes).some((node) => node.variableName === name)) {
    count++;
    name = `x${count}`;
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
