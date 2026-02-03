import type { Request, Response } from 'express';
import validateData from '@utils/validator.js';
import { GetSignedUrlSchema } from '@schemas/document.schema.js';
import DocumentService from '@services/document.service.js';
import { GetSignedUrlDataDTO } from '@dtos/document.dto.js';
import { ResponsePayloadDTO } from '@/dtos/api.dto.js';

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
 * - [x] Validate the query parameters (fileName, fileType (MIME), fileSize (bytes))
 * - [x] Call the service function to generate an s3 pre-signed url
 * - [x] Transform the data into response object with DTO
 * - [x] Response with 200 OK and data.documentId, data.signedUrl, and data.documentUrl
 */
export async function getSignedUrlController(req: Request, res: Response) {
    const data = validateData(GetSignedUrlSchema, req.query);

    const { documentId, documentUrl, signedUrl } =
        await DocumentService.getPreSignedUrl(
            data,
            req.tokenPayload?.garageId as string
        );

    const getSignedUrlData = new GetSignedUrlDataDTO(
        documentId,
        documentUrl,
        signedUrl
    );

    const responsePayload = new ResponsePayloadDTO(
        getSignedUrlData.getObject()
    );

    return res.status(200).json(responsePayload.getObject());
}
