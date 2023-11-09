import { TinyBasePartyKitServer } from "tinybase/persisters/persister-partykit-server";
// import throttle from "lodash.throttle";
// import debounce from "lodash.debounce";
import type * as Party from "partykit/server";

export default class CustomServer extends TinyBasePartyKitServer {
  roomId: string;

  constructor(readonly party: Party.Party) {
    super(party);
    this.roomId = party.id;
  }

  // async onMessage(message, connection) {
  //   await super.onMessage(message, connection);

  //   sendStateToWebhook(this);
  // }
}

// Throttled state update
// const sendStateToWebhook = debounce(
//   throttle(
//     (that: CustomServer) => {
//       (async () => {
//         const state = await loadStore(that);
//         if (state && that.roomId) {
//           console.log(`Sending state to webhook: ${that.roomId}`);
//           fetch(`http://localhost:3002/save/${that.roomId}`, {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ state }),
//           })
//             .catch((err) => {
//               console.error("MY ERROR _ ", err);
//             })
//             .then(() => {
//               console.log("Sent state to webhook");
//             });
//         }
//       })();
//     },
//     5000,
//     { trailing: true }
//   ),
//   1000,
//   { trailing: true }
// );
