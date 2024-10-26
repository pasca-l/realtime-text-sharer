import { firebaseService } from "./database";
import { websocketService } from "./websocket";

export interface Service {
  addData: (roomId: string) => Promise<void>;
  getData: (
    roomId: string,
    setContent: (content: string) => void
  ) => Promise<void>;
  deleteData: (roomId: string) => Promise<void>;
  updateData: (roomId: string, content: string) => Promise<void>;
  unsubscribeData: (
    roomId: string,
    setContent: (content: string) => void
  ) => () => void;
}

const useWebsocket = process.env.NEXT_PUBLIC_USE_WEBSOCKET;
export const service =
  useWebsocket === "true" ? websocketService : firebaseService;
