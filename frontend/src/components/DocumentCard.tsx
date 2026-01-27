import { FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DocumentCardProps {
  fileName: string;
  fileSize: string;
  uploadDate: string;
  status: "INDEXED" | "PROCESSING" | "FAILED";
}

export default function DocumentCard({
  fileName,
  fileSize,
  uploadDate,
  status,
}: DocumentCardProps) {
  const statusVariants = {
    INDEXED: "default" as const,
    PROCESSING: "secondary" as const,
    FAILED: "destructive" as const,
  };

  return (
    <Card className="border-gray-800 bg-[#0F1729] transition-colors hover:border-gray-700">
      <div className="flex items-start gap-4 p-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-800">
          <FileText size={24} className="text-red-500" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="mb-1 truncate font-medium text-white">{fileName}</h3>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <span>{fileSize}</span>
            <span>•</span>
            <span>{uploadDate}</span>
          </div>
        </div>

        <Badge variant={statusVariants[status]}>{status}</Badge>
      </div>
    </Card>
  );
}
