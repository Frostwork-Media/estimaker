import PartySocket from "partysocket";
import { useEffect } from "react";
import { create } from "zustand";

type Position = {
  x: number;
  y: number;
  pointer: "mouse" | "touch";
};

type Cursor = Position & {
  country: string | null;
  lastUpdate: number;
};

type OtherCursorsMap = {
  [id: string]: Cursor;
};

interface CursorsContextType {
  others: OtherCursorsMap;
  self: Position | null;
}

export const useCursorsStore = create<CursorsContextType>((_set) => ({
  others: {},
  self: null,
}));

export function useSetupCursors(socket: PartySocket) {
  useEffect(() => {
    if (!socket) return;
    const onMessage = (evt: WebSocketEventMap["message"]) => {
      try {
        // Ignore events related to nodes
        if (evt.data.startsWith("s[")) return;

        const msg = JSON.parse(evt.data as string);

        console.log(msg);
        switch (msg.type) {
          case "sync":
            // const newOthers = { ...msg.cursors }
            // setOthers(newOthers)
            break;
          case "update":
            // const other = { x: msg.x, y: msg.y, country: msg.country, lastUpdate: msg.lastUpdate, pointer: msg.pointer }
            // setOthers((others) => ({ ...others, [msg.id]: other }))
            break;
          case "remove":
            // setOthers((others) => {
            //     const newOthers = { ...others }
            //     delete newOthers[msg.id]
            //     return newOthers
            // })
            break;
        }
      } catch (err) {
        //
      }
    };

    socket.addEventListener("message", onMessage);

    return () => {
      socket.removeEventListener("message", onMessage);
    };
  }, [socket]);
}

// export function useCursors() {
//   return useContext(CursorsContext);
// }
