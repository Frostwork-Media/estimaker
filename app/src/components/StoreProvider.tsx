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

import { useSetupCursors } from "@/lib/cursors";
import { UserPresence } from "@/lib/hooks";

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
    return new PartySocket({
      host: import.meta.env.VITE_PARTYKIT_HOST,
      room: id,
      // debug: true,
    });
  });

  useCreatePersister(
    store,
    (store) =>
      createPartyKitPersister(
        store,
        socket,
        location.protocol.slice(0, -1) as "http" | "https"
      ),
    [id],
    async (persister) => {
      if (!persister) return;
      await persister.startAutoSave();
      await persister.startAutoLoad();
      // Is there a way to subscribe to events from the persister?
    }
  );

  useSetupCursors(socket);

  return <Provider store={store}>{children}</Provider>;
}
