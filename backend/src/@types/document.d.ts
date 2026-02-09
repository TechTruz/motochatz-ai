export interface DocumentData {
    documentId: string;
    documentUrl: string;
    fileName: string;
    fileType: 'application/pdf' | 'text/plain';
    fileSize: number;
    status: 'UPLOADING' | 'UPLOADED' | 'INDEXED';
    createdAt: Date;
    updatedAt: Date;
}
