import { create } from "zustand";
import type { ChatSession, ChatMessage } from "@/types/chat.types";

interface ChatState {
  currentChat: ChatSession | null;
  messages: ChatMessage[];
  isStreaming: boolean;
  currentStatus: string | null;
  error: string | null;

  setCurrentChat: (chat: ChatSession | null) => void;
  addMessage: (message: ChatMessage) => void;
  setIsStreaming: (streaming: boolean) => void;
  setCurrentStatus: (status: string | null) => void;
  setError: (error: string | null) => void;
  updateLastAssistantMessage: (content: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  currentChat: null,
  messages: [],
  isStreaming: false,
  currentStatus: null,
  error: null,

  setCurrentChat: (chat) => set({ currentChat: chat }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setIsStreaming: (streaming) => set({ isStreaming: streaming }),
  setCurrentStatus: (status) => set({ currentStatus: status }),
  setError: (error) => set({ error }),
  updateLastAssistantMessage: (content) =>
    set((state) => {
      const messages = [...state.messages];
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.role === "ASSISTANT") {
        lastMessage.content += content;
      }
      return { messages };
    }),
}));
