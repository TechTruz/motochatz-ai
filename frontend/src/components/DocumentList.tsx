import DocumentCard from "./DocumentCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Document {
  id: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  status: "INDEXED" | "PROCESSING" | "FAILED";
}

const mockDocuments: Document[] = [
  {
    id: "1",
    fileName: "Honda_CBR150R_Service_Manual_2023.pdf",
    fileSize: "12.5 MB",
    uploadDate: "10 Jan 2026",
    status: "INDEXED",
  },
  {
    id: "2",
    fileName: "Yamaha_NMAX_Technical_Manual.pdf",
    fileSize: "8.3 MB",
    uploadDate: "09 Jan 2026",
    status: "INDEXED",
  },
  {
    id: "3",
    fileName: "Kawasaki_Ninja_250_Maintenance_Guide.pdf",
    fileSize: "15.7 MB",
    uploadDate: "08 Jan 2026",
    status: "INDEXED",
  },
  {
    id: "4",
    fileName: "Suzuki_GSX_R150_Workshop_Manual.pdf",
    fileSize: "10.2 MB",
    uploadDate: "07 Jan 2026",
    status: "INDEXED",
  },
];

export default function DocumentList() {
  return (
    <Card className="bg-[#0F1729] border-gray-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-white">
            Dokumen Terindeks
          </CardTitle>
          <span className="text-sm text-gray-400">
            {mockDocuments.length} dokumen
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockDocuments.map((doc) => (
            <DocumentCard
              key={doc.id}
              fileName={doc.fileName}
              fileSize={doc.fileSize}
              uploadDate={doc.uploadDate}
              status={doc.status}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
