import { Types } from 'mongoose';
import type { DocumentData } from '@/@types/document.js';

export class GetSignedUrlDataDTO {
    private readonly documentId: string;
    private readonly documentUrl: string;
    private readonly signedUrl: string;

    constructor(
        documentId: Types.ObjectId,
        documentUrl: string,
        signedUrl: string
    ) {
        this.documentId = documentId.toString();
        this.documentUrl = documentUrl;
        this.signedUrl = signedUrl;
    }

    getObject() {
        return {
            documentId: this.documentId,
            documentUrl: this.documentUrl,
            signedUrl: this.signedUrl,
        };
    }
}

export class GetManyDocumentsDataDTO {
    private readonly documents: DocumentData[];

    constructor(documents: DocumentData[]) {
        this.documents = documents;
    }

    getObject() {
        return this.documents;
    }
}
