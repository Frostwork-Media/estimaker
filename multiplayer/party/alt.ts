import {
  Cell,
  CellOrUndefined,
  Row,
  Tables,
  TransactionChanges,
  Value,
  ValueOrUndefined,
  Values,
} from "tinybase";
import { Connection, Party, Request, Server } from "partykit/server";

/**
 * DurableStorage:
 *   prefix_hasStore: 1
 *   prefix_t"t1","r1","c1": 'c'
 *   prefix_vv1: 'v'
 */

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
const EMPTY_STRING = "";

const HAS_STORE = "hasStore";

const arrayMap = <Value, Return>(
  array: Value[],
  cb: (value: Value, index: number, array: Value[]) => Return
): Return[] => array.map(cb);

const RESPONSE_HEADERS = objNew(
  arrayMap(["Origin", "Methods", "Headers"], (suffix) => [
    "Access-Control-Allow-" + suffix,
    "*",
  ])
);

const hasStore = async (that: TinyBasePartyKitServer): Promise<1 | undefined> =>
  await that.party.storage.get<1>(
    (that.config.storagePrefix ?? EMPTY_STRING) + HAS_STORE
  );

const loadStore = async (that: TinyBasePartyKitServer) => {
  const tables: Tables = {};
  const values: Values = {};
  const storagePrefix = that.config.storagePrefix ?? EMPTY_STRING;
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

const promise = Promise;

const promiseAll = async (promises: Promise<any>[]) => promise.all(promises);

const saveStore = async (
  that: TinyBasePartyKitServer,
  transactionChanges: TransactionChanges,
  initialSave: boolean,
  requestOrConnection: Request | Connection
) => {
  const storage = that.party.storage;
  const prefix = that.config.storagePrefix ?? EMPTY_STRING;

  const keysToSet: { [key: string]: Cell | Value } = {
    [prefix + HAS_STORE]: 1,
  };
  const keysToDel: string[] = [];
  const keyPrefixesToDel: string[] = [];

  const objMap = <Value, Return>(
    obj: IdObj<Value>,
    cb: (value: Value, id: string) => Return
  ): Return[] => arrayMap(object.entries(obj), ([id, value]) => cb(value, id));

  const arrayUnshift = <Value>(array: Value[], ...values: Value[]): number =>
    array.unshift(...values);

  const arrayPush = <Value>(array: Value[], ...values: Value[]): number =>
    array.push(...values);

  const arrayIsEmpty = (array: unknown[]): boolean => size(array) == 0;

  const arrayEvery = <Value>(
    array: Value[],
    cb: (value: Value, index: number) => boolean | 0 | 1
  ): boolean => array.every(cb);

  await promiseAll(
    objMap(transactionChanges[0], async (table, tableId) =>
      isUndefined(table)
        ? !initialSave &&
          that.canDelTable(tableId, requestOrConnection as Connection) &&
          arrayUnshift(
            keyPrefixesToDel,
            constructStorageKey(prefix, T, tableId)
          )
        : that.canSetTable(tableId, initialSave, requestOrConnection) &&
          (await promiseAll(
            objMap(table, async (row, rowId) =>
              isUndefined(row)
                ? !initialSave &&
                  that.canDelRow(
                    tableId,
                    rowId,
                    requestOrConnection as Connection
                  ) &&
                  arrayPush(
                    keyPrefixesToDel,
                    constructStorageKey(prefix, T, tableId, rowId)
                  )
                : that.canSetRow(
                    tableId,
                    rowId,
                    initialSave,
                    requestOrConnection
                  ) &&
                  (await promiseAll(
                    objMap(row, async (cell, cellId) => {
                      const ids: [Id, Id, Id] = [tableId, rowId, cellId];
                      const key = constructStorageKey(prefix, T, ...ids);
                      isUndefined(cell)
                        ? !initialSave &&
                          that.canDelCell(
                            ...ids,
                            requestOrConnection as Connection
                          ) &&
                          arrayPush(keysToDel, key)
                        : that.canSetCell(
                            ...ids,
                            cell,
                            initialSave,
                            requestOrConnection,
                            await storage.get(key)
                          ) && (keysToSet[key] = cell);
                    })
                  ))
            )
          ))
    )
  );

  await promiseAll(
    objMap(transactionChanges[1], async (value, valueId) => {
      const key = prefix + V + valueId;
      isUndefined(value)
        ? !initialSave &&
          that.canDelValue(valueId, requestOrConnection as Connection) &&
          arrayPush(keysToDel, key)
        : that.canSetValue(
            valueId,
            value,
            initialSave,
            requestOrConnection,
            await storage.get(key)
          ) && (keysToSet[key] = value);
    })
  );

  if (!arrayIsEmpty(keyPrefixesToDel)) {
    mapForEach(await storage.list<string | number | boolean>(), (key) =>
      arrayEvery(
        keyPrefixesToDel,
        (keyPrefixToDelete) =>
          !strStartsWith(key, keyPrefixToDelete) ||
          ((arrayPush(keysToDel, key) as any) && 0)
      )
    );
  }

  await storage.delete(keysToDel);
  await storage.put(keysToSet);
};

export const STORE_PATH = "/store";
export const PUT = "PUT";

const getTypeOf = (thing: unknown): string => typeof thing;

const STRING = getTypeOf(EMPTY_STRING);

const isString = (thing: unknown): thing is string =>
  getTypeOf(thing) == STRING;

export const construct = (
  prefix: string,
  type: MessageType | StorageKeyType,
  payload: any
): string =>
  prefix + type + (isString(payload) ? payload : jsonString(payload));

type Ids = Id[];

const constructStorageKey = (
  storagePrefix: string,
  type: StorageKeyType,
  ...ids: Ids
) => construct(storagePrefix, type, slice(jsonString(ids), 1, -1));

const createResponse = async (
  that: TinyBasePartyKitServer,
  status: number,
  body: string | null = null
) =>
  new Response(body, {
    status,
    headers: that.config.responseHeaders ?? RESPONSE_HEADERS,
  });

type TinyBasePartyKitServerConfig = {
  /// TinyBasePartyKitServerConfig.storePath
  storePath?: string;
  /// TinyBasePartyKitServerConfig.messagePrefix
  messagePrefix?: string;
  /// TinyBasePartyKitServerConfig.storagePrefix
  storagePrefix?: string;
  /// TinyBasePartyKitServerConfig.responseHeaders
  responseHeaders?: HeadersInit;
};

declare class TinyBasePartyKitServerDecl implements Server {
  constructor(party: Party);
  /// TinyBasePartyKitServer.config
  readonly config: TinyBasePartyKitServerConfig;
  /// TinyBasePartyKitServer.onRequest
  onRequest(request: Request): Promise<Response>;
  /// TinyBasePartyKitServer.onMessage
  onMessage(message: string, connection: Connection): Promise<void>;
  /// TinyBasePartyKitServer.canSetTable
  canSetTable(
    tableId: Id,
    initialSave: boolean,
    requestOrConnection: Request | Connection
  ): boolean;
  /// TinyBasePartyKitServer.canDelTable
  canDelTable(tableId: Id, connection: Connection): boolean;
  /// TinyBasePartyKitServer.canSetRow
  canSetRow(
    tableId: Id,
    rowId: Id,
    initialSave: boolean,
    requestOrConnection: Request | Connection
  ): boolean;
  /// TinyBasePartyKitServer.canDelRow
  canDelRow(tableId: Id, rowId: Id, connection: Connection): boolean;
  /// TinyBasePartyKitServer.canSetCell
  canSetCell(
    tableId: Id,
    rowId: Id,
    cellId: Id,
    cell: Cell,
    initialSave: boolean,
    requestOrConnection: Request | Connection,
    oldCell: CellOrUndefined
  ): boolean;
  /// TinyBasePartyKitServer.canDelCell
  canDelCell(
    tableId: Id,
    rowId: Id,
    cellId: Id,
    connection: Connection
  ): boolean;
  /// TinyBasePartyKitServer.canSetValue
  canSetValue(
    valueId: Id,
    value: Value,
    initialSave: boolean,
    requestOrConnection: Request | Connection,
    oldValue: ValueOrUndefined
  ): boolean;
  /// TinyBasePartyKitServer.canDelValue
  canDelValue(valueId: Id, connection: Connection): boolean;
}

const jsonString = (obj: unknown): string =>
  JSON.stringify(obj, (_key, value) =>
    isInstanceOf(value, Map) ? object.fromEntries([...value]) : value
  );

const isInstanceOf = (
  thing: unknown,
  cls: MapConstructor | SetConstructor | ObjectConstructor
): boolean => thing instanceof cls;

export default class TinyBasePartyKitServer
  implements TinyBasePartyKitServerDecl
{
  constructor(readonly party: Party) {}

  readonly config: TinyBasePartyKitServerConfig = {};

  async onRequest(request: Request): Promise<Response> {
    const storePath = this.config.storePath ?? STORE_PATH;
    if (new URL(request.url).pathname.endsWith(storePath)) {
      const hasExistingStore = await hasStore(this);
      const text = await request.text();
      if (request.method == PUT) {
        if (hasExistingStore) {
          return createResponse(this, 205);
        }
        await saveStore(this, JSON.parse(text), true, request);
        return createResponse(this, 201);
      }
      return createResponse(
        this,
        200,
        hasExistingStore ? jsonString(await loadStore(this)) : EMPTY_STRING
      );
    }
    return createResponse(this, 404);
  }

  async onMessage(message: string, connection: Connection) {
    const messagePrefix = this.config.messagePrefix ?? EMPTY_STRING;
    await ifNotUndefined(
      deconstruct(messagePrefix, message, 1),
      async ([type, payload]) => {
        if (type == SET_CHANGES && (await hasStore(this))) {
          await saveStore(this, payload, false, connection);
          this.party.broadcast(construct(messagePrefix, SET_CHANGES, payload), [
            connection.id,
          ]);
        }
      }
    );
  }

  canSetTable(
    _tableId: Id,
    _initialSave: boolean,
    _requestOrConnection: Request | Connection
  ): boolean {
    return true;
  }

  canDelTable(_tableId: Id, _connection: Connection): boolean {
    return true;
  }

  canSetRow(
    _tableId: Id,
    _rowId: Id,
    _initialSave: boolean,
    _requestOrConnection: Request | Connection
  ): boolean {
    return true;
  }

  canDelRow(_tableId: Id, _rowId: Id, _connection: Connection): boolean {
    return true;
  }

  canSetCell(
    _tableId: Id,
    _rowId: Id,
    _cellId: Id,
    _cell: Cell,
    _initialSave: boolean,
    _requestOrConnection: Request | Connection,
    _oldCell: CellOrUndefined
  ): boolean {
    return true;
  }

  canDelCell(
    _tableId: Id,
    _rowId: Id,
    _cellId: Id,
    _connection: Connection
  ): boolean {
    return true;
  }

  canSetValue(
    _valueId: Id,
    _value: Value,
    _initialSave: boolean,
    _requestOrConnection: Request | Connection,
    _oldValue: ValueOrUndefined
  ): boolean {
    return true;
  }

  canDelValue(_valueId: Id, _connection: Connection): boolean {
    return true;
  }
}
