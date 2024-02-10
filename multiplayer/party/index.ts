import {
  TinyBasePartyKitServer,
  loadStoreFromStorage,
} from "tinybase/persisters/persister-partykit-server";
import debounce from "lodash.debounce";
import throttle from "lodash.throttle";
import { Connection, Party } from "partykit/server";
export default class Server extends TinyBasePartyKitServer {
  id: string;
  saveTo: string;

  constructor(readonly party: Party) {
    super(party);

    this.id = party.id;
    this.saveTo = party.env.SAVE_ENDPOINT as string;
  }

  async onMessage(message: string, connection: Connection) {
    console.log("Received message", message);

    await super.onMessage(message, connection);

    // Throttled state update
    sendStateToWebhook(this);
  }

  onClose() {
    const connections = this.party.getConnections();
    // get size of iterator
    let size = 0;
    for (const _ of connections) {
      size++;
    }

    // If no one in the room, purge from storage
    if (size === 0) {
      this.party.storage.deleteAll();
    }
  }

  onError(err: Error) {
    console.error(err);
  }
}

// Throttled state update
const sendStateToWebhook = debounce(
  throttle(
    (that: Server) => {
      (async () => {
        console.log("Sending state to webhook");

        // It seems like on first connection this state may not be loaded and it could be overriden by the initial state
        try {
          const state = await loadStoreFromStorage(that.party.storage);
          console.log("State", state);

          if (state && that.id) {
            console.log("Sending state to webhook", state);

            fetch(that.saveTo, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ state, id: that.id }),
            })
              .catch((err) => {
                console.error("Error hitting /save webhook", err);
              })
              .then(() => {
                console.log("Sent state to webhook");
              });
          }
        } catch (err) {
          console.error("Error loading state from storage", err);
          return;
        }
      })();
    },
    5000,
    { trailing: true }
  ),
  1000,
  { trailing: true }
);
