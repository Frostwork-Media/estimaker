import { Tables, Values, Row, Cell } from "tinybase";
import { TinyBasePartyKitServer } from "tinybase/persisters/persister-partykit-server";
import throttle from "lodash.throttle";
import debounce from "lodash.debounce";
import type * as Party from "partykit/server";
import { Connection } from "partykit/server";

export default class CustomServer extends TinyBasePartyKitServer {
  id: string;

  constructor(readonly party: Party.Party) {
    super(party);
    this.id = party.id;
  }

  async onMessage(message: string, connection: Connection): Promise<void> {
    await super.onMessage(message, connection);

    sendStateToWebhook(this);
  }
}

// Throttled state update
const sendStateToWebhook = debounce(
  throttle(
    (that: CustomServer) => {
      (async () => {
        const state = await loadStore(that);
        if (state && that.id) {
          console.log(`Saving state: ${that.id}`);
          console.log(state);
          // fetch(`http://localhost:3002/save/${that.id}`, {
          //   method: "POST",
          //   headers: {
          //     "Content-Type": "application/json",
          //   },
          //   body: JSON.stringify({ state }),
          // })
          //   .catch((err) => {
          //     console.error("MY ERROR _ ", err);
          //   })
          //   .then(() => {
          //     console.log("Sent state to webhook");
          //   });
        }
      })();
    },
    5000,
    { trailing: true }
  ),
  1000,
  { trailing: true }
);

const isUndefined = (thing: unknown): thing is undefined | null =>
  thing == undefined;

const ifNotUndefined = <Value, Return>(
  value: Value | undefined,
  then: (value: Value) => Return,
  otherwise?: () => Return
): Return | undefined => (isUndefined(value) ? otherwise?.() : then(value));

type Coll<Value> = Map<unknown, Value> | Set<Value>;

const collForEach = <Value>(
  coll: Coll<Value> | undefined,
  cb: (value: Value, key: any) => void
): void => coll?.forEach(cb);

export const mapForEach = <Key, Value>(
  map: Map<Key, Value> | undefined,
  cb: (key: Key, value: Value) => void
): void => collForEach(map, (value, key) => cb(key, value));

const SET_CHANGES = "s";

type MessageType = typeof SET_CHANGES;
type StorageKeyType = typeof T | typeof V;

const size = (arrayOrString: string | any[]): number => arrayOrString.length;

const strStartsWith = (str: string, prefix: string) => str.startsWith(prefix);

const slice = <ArrayOrString extends string | any[]>(
  arrayOrString: ArrayOrString,
  start: number,
  end?: number
): ArrayOrString => arrayOrString.slice(start, end) as ArrayOrString;

const deconstruct = (
  prefix: string,
  message: string,
  stringified?: 1
): [type: MessageType | StorageKeyType, payload: string | any] | undefined => {
  const prefixSize = size(prefix);
  return strStartsWith(message, prefix)
    ? [
        message[prefixSize] as MessageType | StorageKeyType,
        (stringified ? JSON.parse : String)(slice(message, prefixSize + 1)),
      ]
    : undefined;
};

type IdObj<Value> = { [id: string]: Value };

type Id = string;

const objGet = <Value>(
  obj: IdObj<Value> | Value[] | undefined,
  id: Id
): Value | undefined => ifNotUndefined(obj, (obj) => (obj as IdObj<Value>)[id]);

const objHas = (obj: IdObj<unknown> | undefined, id: Id): boolean =>
  !isUndefined(objGet(obj, id));

const objEnsure = <Value>(
  obj: IdObj<Value>,
  id: Id | number,
  getDefaultValue: () => Value
): Value => {
  if (!objHas(obj, id as Id)) {
    obj[id] = getDefaultValue();
  }
  return obj[id] as Value;
};

const object = Object;

const objNew = <Value>(
  entries: [id: string, value: Value][] = []
): IdObj<Value> => object.fromEntries(entries);

const T = "t";
const V = "v";

const loadStore = async (that: CustomServer) => {
  const tables: Tables = {};
  const values: Values = {};
  const storagePrefix = that.config.storagePrefix ?? "";
  mapForEach(
    await that.party.storage.list<string | number | boolean>(),
    (key, cellOrValue) =>
      ifNotUndefined(deconstruct(storagePrefix, key), ([type, ids]) => {
        if (type == T) {
          const [tableId, rowId, cellId] = JSON.parse("[" + ids + "]");
          objEnsure(
            objEnsure(tables, tableId, objNew<Row>),
            rowId,
            objNew<Cell>
          )[cellId] = cellOrValue;
        } else if (type == V) {
          values[ids] = cellOrValue;
        }
      })
  );
  return [tables, values];
};
