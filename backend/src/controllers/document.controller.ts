import type { Request, Response } from 'express';

/**
 * @todo Implement this controller
 * - [ ] Validate the query parameters (garageId, limit, page, status, sort)
 * - [ ] Call the service function to get documents from db
 * - [ ] Transform the data including pagination into response object with DTO
 * - [ ] Response with 200 OK and data with pagination
 */
export declare function getManyDocuments(
    req: Request,
    res: Response
): Promise<Response>;

/**
 * @todo Implement this controller
 * - [ ] Validate the query parameters (fileName, fileType, fileSize)
 * - [ ] Call the service function to generate an s3 pre-signed url
 * - [ ] Transform the data into response object with DTO
 * - [ ] Response with 200 OK and data.documentId, data.signedUrl, and data.documentUrl
 */
export declare function getSignedUrlController(
    req: Request,
    res: Response
): Promise<Response>;
