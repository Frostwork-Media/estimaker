import PartySocket from "partysocket";
import { initialState } from "shared";
import { createStore } from "tinybase/debug";
import {
  Provider,
  useCreatePersister,
  useCreateStore,
} from "tinybase/debug/ui-react";
import { createPartyKitPersister } from "tinybase/persisters/persister-partykit-client";

export function StoreProvider({
  children,
  id,
  initial = JSON.stringify(initialState),
}: {
  children: React.ReactNode;
  id: string;
  initial?: string;
}) {
  if (!id) throw new Error("No room ID provided");

  const store = useCreateStore(() => createStore().setJson(initial));

  useCreatePersister(
    store,
    (store) =>
      createPartyKitPersister(
        store,
        new PartySocket({
          host: import.meta.env.VITE_PARTYKIT_HOST,
          room: id,
        }),
        location.protocol.slice(0, -1) as "http" | "https"
      ),
    [id],
    async (persister) => {
      if (!persister) return;
      await persister.startAutoSave();
      await persister.startAutoLoad();
    }
  );

  return <Provider store={store}>{children}</Provider>;
}
