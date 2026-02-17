import type { Request, Response } from 'express';
import validateData from '@utils/validator.js';
import {
    GetSignedUrlSchema,
    GetManyDocumentsSchema,
    IngestDocumentSchema,
} from '@schemas/document.schema.js';
import DocumentService from '@services/document.service.js';
import {
    GetSignedUrlDataDTO,
    GetManyDocumentsDataDTO,
} from '@dtos/document.dto.js';
import { OffsetPaginationDTO, ResponsePayloadDTO } from '@dtos/api.dto.js';
import Logger from '@utils/logger.js';
import { CustomError } from '@errors/CustomError.js';

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

export async function ingestDocumentController(req: Request, res: Response) {
    const data = validateData(IngestDocumentSchema, req.query);

    res.set({
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
    });
    res.flushHeaders();

    const abortController = new AbortController();
    const aiResponseStream = DocumentService.ingestDocument(
        data,
        abortController.signal
    );

    req.on('close', () => {
        if (!abortController.signal.aborted) {
            abortController.abort();
        }
    });

    aiResponseStream.on('error', (err: Error | CustomError) => {
        let errorDetails = {
            code: 502,
            message: err.message,
        };

        if (err instanceof CustomError) {
            errorDetails = {
                code: err.statusCode,
                message: err.message,
            };
        } else {
            Logger.error('SSE error:', err);
            Logger.error('SSE error stack:', err.stack);
        }

        if (!abortController.signal.aborted) {
            abortController.abort();
        }

        res.write(`event: error\n`);
        res.write(`data: ${JSON.stringify(errorDetails)}\n\n`);
        res.end();
    });

    aiResponseStream.pipe(res);
}
