export class WebSocketClient {
  public ws: WebSocket | null = null;

  constructor() {
    this.connect();
  }

  public async connect() {
    this.ws = new WebSocket(`ws://localhost:8080/ws`);

    return new Promise<void>((resolve, reject) => {
      if (!this.ws) return reject(new Error("websocket not initialized"));

      this.ws.onopen = () => resolve();
      this.ws.onerror = (error) => reject(error);
    });
  }

  public async close() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  public async send(content: string) {
    return new Promise<void>((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        return reject(new Error("websocket is not connected"));
      }

      this.ws.send(content);
      resolve();
    });
  }

  public unsubscribe(
    roomId: string,
    setContent: (content: string) => void
  ): () => void {
    if (!this.ws) throw new Error("websocket is not connected");

    this.ws.onmessage = (event: MessageEvent) => {
      setContent(event.data);
    };
    return () => {
      this.ws!.onmessage = () => null;
    };
  }
}

export const WEBSOCKET = new WebSocketClient();
