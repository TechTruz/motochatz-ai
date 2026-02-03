import { Types } from 'mongoose';

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
