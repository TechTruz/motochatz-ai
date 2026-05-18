import { authenticatedApiClient } from "@/lib/authenticated-api-client";
import type {
  GetChatsRequest,
  GetChatsResponse,
  GetMessagesRequest,
  GetMessagesResponse,
  CreateChatResponse,
  SSEIngestStatusEvent,
  SSEChatStatusEvent,
  SSEMessageEvent,
} from "@/types/chat.types";

export const chatService = {
  async getChats(request: GetChatsRequest): Promise<GetChatsResponse> {
    const params = {
      garageId: request.garageId,
      ...(request.userId && { userId: request.userId }),
      limit: request.limit?.toString() || "5",
      page: request.page?.toString() || "1",
      ...(request.status && { status: request.status }),
      ...(request.sort && { sort: request.sort }),
    };

    return authenticatedApiClient.get<GetChatsResponse>("/api/chats", {
      params,
    });
  },

  async getMessages(request: GetMessagesRequest): Promise<GetMessagesResponse> {
    const params = {
      ...(request.limit && { limit: request.limit.toString() }),
      ...(request.cursor && { cursor: request.cursor }),
      ...(request.sort && { sort: request.sort }),
    };

    return authenticatedApiClient.get<GetMessagesResponse>(
      `/api/chats/${request.chatId}/messages`,
      {
        params,
      }
    );
  },

  async createChat(): Promise<CreateChatResponse> {
    return authenticatedApiClient.post<CreateChatResponse>("/api/chats");
  },

  async sendMessage(
    chatId: string,
    message: string,
    onStatusUpdate: (event: SSEChatStatusEvent) => void,
    onMessageChunk: (event: SSEMessageEvent) => void,
    onError: (error: Error) => void
  ): Promise<void> {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found");
    }
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    const url = `${baseURL}/api/stream/chat?chatId=${chatId}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error("Response body is null");
      }

      await this.parseSSEStream(response.body, onStatusUpdate, onMessageChunk);
    } catch (error) {
      onError(error instanceof Error ? error : new Error(String(error)));
    }
  },

  async ingestDocument(
    documentId: string,
    onStatusUpdate: (event: SSEIngestStatusEvent) => void,
    onError: (error: Error) => void
  ): Promise<void> {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found");
    }

    const baseURL = import.meta.env.VITE_API_BASE_URL;
    const url = `${baseURL}/api/stream/ingest?documentId=${documentId}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to ingest document: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error("Response body is null");
      }

      await this.parseIngestSSEStream(response.body, onStatusUpdate);
    } catch (error) {
      onError(error instanceof Error ? error : new Error(String(error)));
    }
  },

  async parseSSEStream(
    body: ReadableStream<Uint8Array>,
    onStatusUpdate: (event: SSEChatStatusEvent) => void,
    onMessageChunk: (event: SSEMessageEvent) => void
  ): Promise<void> {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");

        buffer = lines[lines.length - 1];

        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i].trim();

          if (line.startsWith("event:")) {
            const eventType = line.substring(6).trim();

            let j = i + 1;
            let dataLine = "";
            while (j < lines.length && lines[j].startsWith("data:")) {
              dataLine = lines[j].substring(5).trim();
              j++;
            }

            if (dataLine === "[DONE]") {
              continue;
            }

            try {
              const parsedData = JSON.parse(dataLine);

              if (eventType === "status") {
                onStatusUpdate({
                  status: parsedData.status,
                  timestamp: new Date(parsedData.timestamp),
                  referencedDocuments: parsedData.referencedDocuments,
                });
              } else if (eventType === "message") {
                onMessageChunk({
                  content: parsedData.content || parsedData.message,
                  timestamp: new Date(parsedData.timestamp),
                });
              }
            } catch {
              // Ignore JSON parse errors for incomplete data
            }

            i = j - 1;
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  },

  async parseIngestSSEStream(
    body: ReadableStream<Uint8Array>,
    onStatusUpdate: (event: SSEIngestStatusEvent) => void
  ): Promise<void> {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");

        buffer = lines[lines.length - 1];

        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i].trim();

          if (line.startsWith("event:")) {
            const eventType = line.substring(6).trim();

            let j = i + 1;
            let dataLine = "";
            while (j < lines.length && lines[j].startsWith("data:")) {
              dataLine = lines[j].substring(5).trim();
              j++;
            }

            if (eventType === "status" && dataLine) {
              try {
                const parsedData = JSON.parse(dataLine);
                onStatusUpdate({
                  status: parsedData.status,
                  timestamp: new Date(parsedData.timestamp),
                });
              } catch {
                // Ignore JSON parse errors for incomplete data
              }
            }

            i = j - 1;
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  },
};
