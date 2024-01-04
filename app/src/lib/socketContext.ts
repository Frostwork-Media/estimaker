import PartySocket from "partysocket";
import { createContext } from "react";

type SocketContextType = {
  socket: null | PartySocket;
};

export const SocketContext = createContext<SocketContextType>({
  socket: null,
});
