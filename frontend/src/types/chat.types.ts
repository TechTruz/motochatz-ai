export interface ReferencedDocument {
  documentId: string;
  documentUrl: string;
}

export interface ChatSession {
  chatId: string;
  userId: string;
  userFirstName: string;
  userLastName: string | null;
  status: "ALL" | "ONGOING" | "ENDED";
  remainingQuota: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  messageId: string;
  role: "USER" | "ASSISTANT";
  userId: string | null;
  userFirstName: string | null;
  userLastName: string | null;
  content: string;
  referencedDocuments?: ReferencedDocument[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationData {
  currentRecords: number;
  totalRecords: number;
  currentPage?: number;
  totalPage?: number;
  latestCursor?: string | null;
  oldestCursor?: string | null;
  sort?: string;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface GetChatsRequest {
  garageId: string;
  userId?: string;
  limit?: number;
  page?: number;
  status?: "ALL" | "ONGOING" | "ENDED";
  sort?:
    | "chatId"
    | "-chatId"
    | "createdAt"
    | "-createdAt"
    | "updatedAt"
    | "-updatedAt";
}

export interface GetChatsResponse {
  data: ChatSession[];
  pagination: PaginationData;
}

export interface GetMessagesRequest {
  chatId: string;
  limit?: number;
  cursor?: string;
  sort?: "createdAt" | "-createdAt";
}

export interface GetMessagesResponse {
  data: ChatMessage[];
  pagination: PaginationData;
}

export interface CreateChatResponse {
  data: {
    chatId: string;
  };
}

export interface SSEMessageEvent {
  content: string;
  timestamp: Date;
}

export interface SSEIngestStatusEvent {
  status:
    | "PROCESSING"
    | "INGESTING"
    | "CHUNKING"
    | "EMBEDDING"
    | "INDEXING"
    | "INDEXED";
  timestamp: Date;
}

export interface SSEChatStatusEvent {
  status:
    | "ENCODING QUERY"
    | "RETRIEVING KNOWLEDGE"
    | "AUGMENTING"
    | "GENERATING ANSWER"
    | "ANSWERED";
  timestamp: Date;
  referencedDocuments?: ReferencedDocument[];
}
