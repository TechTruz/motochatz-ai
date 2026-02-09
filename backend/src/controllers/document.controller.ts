import type { Request, Response } from 'express';
import validateData from '@utils/validator.js';
import {
    GetSignedUrlSchema,
    GetManyDocumentsSchema,
} from '@schemas/document.schema.js';
import DocumentService from '@services/document.service.js';
import {
    GetSignedUrlDataDTO,
    GetManyDocumentsDataDTO,
} from '@dtos/document.dto.js';
import { OffsetPaginationDTO, ResponsePayloadDTO } from '@dtos/api.dto.js';

export async function getManyDocuments(req: Request, res: Response) {
    const data = validateData(GetManyDocumentsSchema, req.query);

    const { documents, total } = await DocumentService.getManyDocuments(data);

    const getManyDocumentsData = new GetManyDocumentsDataDTO(documents);
    const offsetPagination = new OffsetPaginationDTO({
        limit: data.limit,
        total,
        count: documents.length,
        page: data.page,
    });

    const responsePayload = new ResponsePayloadDTO(
        getManyDocumentsData.getObject(),
        offsetPagination.getObject()
    );

    return res.status(200).json(responsePayload.getObject());
}

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
