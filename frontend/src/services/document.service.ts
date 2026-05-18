import { authenticatedApiClient } from "@/lib/authenticated-api-client";
import type {
  GetSignedUrlRequest,
  GetSignedUrlResponse,
  GetManyDocumentsRequest,
  GetManyDocumentsResponse,
} from "@/types/document.types";

export const documentService = {
  async getSignedUrl(
    request: GetSignedUrlRequest
  ): Promise<GetSignedUrlResponse> {
    return authenticatedApiClient.get<GetSignedUrlResponse>(
      "/api/documents/signed-url",
      {
        params: request,
      }
    );
  },

  async getDocuments(
    request: GetManyDocumentsRequest
  ): Promise<GetManyDocumentsResponse> {
    const params = {
      ...request,
      limit: request.limit?.toString() || "5",
      page: request.page?.toString() || "1",
    };

    return authenticatedApiClient.get<GetManyDocumentsResponse>(
      "/api/documents",
      {
        params,
      }
    );
  },
};
