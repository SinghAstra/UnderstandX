import { TERMINAL_STATUSES } from "./constants";
import { StatusManagerConfig, StatusUpdate } from "./types";

export class RepositoryStatusManager {
  private connections: Map<string, EventSource>;
  private config: StatusManagerConfig;

  constructor(config: StatusManagerConfig) {
    this.connections = new Map();
    this.config = config;
  }

  public connect(repoId: string): void {
    // Close existing connection if it exists
    this.disconnect(repoId);

    try {
      const eventSource = new EventSource(`/api/repository/${repoId}/status`);

      eventSource.onmessage = (event) => this.handleMessage(repoId, event);
      eventSource.onerror = (error) => this.handleError(repoId, error);

      this.connections.set(repoId, eventSource);
    } catch (error) {
      console.log("error --connect");
      if (error instanceof Error) {
        console.log("error.message is ", error.message);
        console.log("error.stack is ", error.stack);
      }

      // this.config.onError(repoId, "Failed to establish connection");
    }
  }

  public disconnect(repoId: string): void {
    const connection = this.connections.get(repoId);
    if (connection) {
      connection.close();
      this.connections.delete(repoId);
    }
  }

  public disconnectAll(): void {
    this.connections.forEach((eventSource, repoId) => {
      this.disconnect(repoId);
    });
  }

  public isConnected(repoId: string): boolean {
    return this.connections.has(repoId);
  }

  private handleMessage(repoId: string, event: MessageEvent): void {
    try {
      const data: StatusUpdate = JSON.parse(event.data);

      if (data.error) {
        this.handleError(repoId, data.error);
        return;
      }

      // Notify status update
      this.config.onStatusUpdate(repoId, data);

      // Check for terminal status
      if (TERMINAL_STATUSES.includes(data.status)) {
        // this.config.onTerminalStatus(repoId);
        this.disconnect(repoId);
      }
    } catch (error) {
      console.log("error --handleMessage");
      if (error instanceof Error) {
        console.log("error.message is ", error.message);
        console.log("error.stack is ", error.stack);
      }
      this.handleError(repoId, "Failed to process status update");
    }
  }

  private handleError(repoId: string, error: Event | Error | string): void {
    let errorMessage: string;
    console.log("In handleError");
    if (error instanceof Event) {
      errorMessage = "Connection error occurred";
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = error;
    }

    console.log("errorMessage --handleError is ", errorMessage);

    // this.config.onError(repoId, errorMessage);
    this.disconnect(repoId);
  }
}
