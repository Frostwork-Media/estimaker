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

export type AnyNode = EstimateNode | DerivativeNode;

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

type Values = {
  /**
   * The name of the project
   */
  name: string;
};

/**
 * This is the final state of what is synced from tinybase
 *
 * https://tinybase.org/api/store/interfaces/store/store/methods/getter/getjson/
 */
export type State = [Tables, Values];

export const initialState: State = [{}, { name: "New Project" }];
