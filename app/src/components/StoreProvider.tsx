import PartySocket from "partysocket";
import { useState } from "react";
import { initialState } from "shared";
import { createStore } from "tinybase/debug";
import {
  Provider,
  useCreatePersister,
  useCreateStore,
} from "tinybase/debug/ui-react";
import { createPartyKitPersister } from "tinybase/persisters/persister-partykit-client";

import { UserPresence } from "@/lib/hooks";
import { SocketContext } from "@/lib/socketContext";

export function StoreProvider({
  children,
  id,
  initial = JSON.stringify(initialState),
  presence: _,
}: {
  children: React.ReactNode;
  id: string;
  initial?: string;
  presence: UserPresence;
}) {
  if (!id) throw new Error("No room ID provided");

  const store = useCreateStore(() => createStore().setJson(initial));

  const [socket] = useState(() => {
    const socket = new PartySocket({
      host: import.meta.env.VITE_PARTYKIT_HOST,
      room: id,
      party: "main",
    });

    return socket;
  });

  useCreatePersister(
    store,
    (store) =>
      createPartyKitPersister(
        store,
        socket,
        location.protocol.slice(0, -1) as "http" | "https",
        console.error
      ),
    [id],
    async (persister) => {
      if (!persister) return;

      await persister.startAutoSave();
      await persister.startAutoLoad();
      // Is there a way to subscribe to events from the persister?
    }
  );

  return (
    <Provider store={store}>
      <SocketContext.Provider value={{ socket }}>
        {children}
      </SocketContext.Provider>
    </Provider>
  );
}
