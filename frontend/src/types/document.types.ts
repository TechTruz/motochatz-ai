export interface DocumentData {
  documentId: string;
  documentUrl: string;
  fileName: string;
  fileType: "application/pdf" | "text/plain";
  fileSize: number;
  status: "UPLOADING" | "UPLOADED" | "INDEXED";
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationData {
  currentRecords: number;
  totalRecords: number;
  currentPage: number;
  totalPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface GetSignedUrlRequest {
  fileName: string;
  fileType: "application/pdf" | "text/plain";
  fileSize: string;
}

export interface GetSignedUrlResponse {
  data: {
    documentId: string;
    signedUrl: string;
    documentUrl: string;
  };
}

export interface GetManyDocumentsRequest {
  garageId: string;
  limit?: number;
  page?: number;
  status?: "ALL" | "UPLOADING" | "UPLOADED" | "INDEXED";
  sort?:
    | "documentId"
    | "-documentId"
    | "fileSize"
    | "-fileSize"
    | "createdAt"
    | "-createdAt"
    | "updatedAt"
    | "-updatedAt";
}

export interface GetManyDocumentsResponse {
  data: DocumentData[];
  pagination: PaginationData;
}
