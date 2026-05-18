import { useCallback, useEffect, useRef } from "react";
import { ChatBubble } from "./ChatBubble";
import { ChatInput } from "./ChatInput";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useChatStore } from "@/stores/chat.store";
import { useAuthStore } from "@/stores/auth.store";
import { chatService } from "@/services/chat.service";
import type {
  ChatMessage,
  SSEChatStatusEvent,
  SSEMessageEvent,
} from "@/types/chat.types";

export default function ChatSection() {
  const {
    currentChat,
    messages,
    isStreaming,
    currentStatus,
    error,
    setCurrentChat,
    addMessage,
    setIsStreaming,
    setCurrentStatus,
    setError,
    updateLastAssistantMessage,
  } = useChatStore();

  const { user } = useAuthStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);

  const initializeChat = useCallback(async () => {
    try {
      const response = await chatService.createChat();
      setCurrentChat({
        chatId: response.data.chatId,
        userId: user?.userId || "",
        userFirstName: user?.firstName || "",
        userLastName: user?.lastName || null,
        status: "ONGOING",
        remainingQuota: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to initialize chat"
      );
    }
  }, [user?.userId, user?.firstName, user?.lastName, setCurrentChat, setError]);

  useEffect(() => {
    if (!isInitializedRef.current && user?.garageId) {
      isInitializedRef.current = true;
      initializeChat();
    }
  }, [user?.garageId, initializeChat]);

  const handleSendMessage = async (messageText: string) => {
    if (!currentChat || isStreaming) return;

    try {
      setError(null);
      setIsStreaming(true);
      setCurrentStatus("Encoding query...");

      const userMessage: ChatMessage = {
        messageId: Date.now().toString(),
        role: "USER",
        userId: user?.userId || "",
        userFirstName: user?.firstName || "",
        userLastName: user?.lastName || null,
        content: messageText,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      addMessage(userMessage);

      const assistantMessage: ChatMessage = {
        messageId: (Date.now() + 1).toString(),
        role: "ASSISTANT",
        userId: null,
        userFirstName: null,
        userLastName: null,
        content: "",
        referencedDocuments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      addMessage(assistantMessage);

      const onStatusUpdate = (event: SSEChatStatusEvent) => {
        setCurrentStatus(event.status);
      };

      const onMessageChunk = (event: SSEMessageEvent) => {
        updateLastAssistantMessage(event.content);
      };

      const onError = (error: Error) => {
        setError(error.message);
        setIsStreaming(false);
      };

      await chatService.sendMessage(
        currentChat.chatId,
        messageText,
        onStatusUpdate,
        onMessageChunk,
        onError
      );

      setCurrentStatus(null);
    } finally {
      setIsStreaming(false);
    }
  };

  const formattedMessages = messages.map((msg) => ({
    ...msg,
    timestamp: new Date(msg.createdAt).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));

  return (
    <Card className="border-gray-800 bg-[#0F1729]">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${
                isStreaming
                  ? "animate-pulse bg-yellow-500"
                  : "animate-pulse bg-green-500"
              }`}
            ></div>
            <CardTitle className="text-xl text-white">
              Gemini 1.5 Flash (RAG)
            </CardTitle>
          </div>
          <div>
            <CardTitle className="text-xl text-gray-400 italic">
              {currentStatus || "Connected"}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex max-h-96 flex-col bg-slate-800">
        <div className="flex-1 space-y-4 overflow-auto p-6">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-gray-500">
                Mulai percakapan dengan assistant...
              </p>
            </div>
          ) : (
            formattedMessages.map((msg) => (
              <ChatBubble
                key={msg.messageId}
                role={msg.role.toLowerCase() as "user" | "assistant"}
                content={msg.content || "..."}
                timestamp={msg.timestamp}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        {error && (
          <div className="w-full rounded bg-red-900/20 p-2 text-sm text-red-400">
            {error}
          </div>
        )}
        <ChatInput onSend={handleSendMessage} isLoading={isStreaming} />
        <p className="text-gray-400">INTERNAL SANDBOX ENVIRONMENT</p>
      </CardFooter>
    </Card>
  );
}
