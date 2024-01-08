import type * as Party from "partykit/server";

export type CursorMessage =
  | {
      type: "move";
      position: { x: number; y: number };
      id: string;
    }
  | {
      type: "disconnect";
      id: string;
    };

export default class Server implements Party.Server {
  constructor(readonly room: Party.Room) {}

  async onClose(connection: Party.Connection<unknown>): Promise<void> {
    const m: CursorMessage = { type: "disconnect", id: connection.id };
    this.room.broadcast(JSON.stringify(m));
  }

  async onMessage(message: string | ArrayBuffer, sender: Party.Connection) {
    // Broadcast message to all clients except sender
    // sender.broadcast(message);

    const m = JSON.parse(message as string) as CursorMessage;
    switch (m.type) {
      case "move":
        this.room.broadcast(JSON.stringify(m));
        break;
    }
  }
}
