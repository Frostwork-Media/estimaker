import {
  TinyBasePartyKitServer,
  loadStoreFromStorage,
} from "tinybase/persisters/persister-partykit-server";
import debounce from "lodash.debounce";
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
    await super.onMessage(message, connection);

    const state = await loadStoreFromStorage(this.party.storage);

    // Throttled state update
    sendStateToWebhook(this.id, state, this.saveTo);
  }

  onError(err: Error) {
    console.error(err);
  }
}

const sendStateToWebhook = debounce(writeState, 1000, { trailing: true });

function writeState(
  id: string,
  state: Awaited<ReturnType<typeof loadStoreFromStorage>>,
  saveTo: string
) {
  fetch(saveTo, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ state, id }),
  })
    .catch((err) => {
      console.error("Error hitting /save webhook", err);
    })
    .then((response) => {
      if (response) console.log(response.status, response.statusText);
      console.log("Sent state to webhook");
    });
}
