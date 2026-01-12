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
    <Card className="bg-[#0F1729] border-gray-800 hover:border-gray-700 transition-colors">
      <div className="flex items-start gap-4 p-6">
        <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center shrink-0">
          <FileText size={24} className="text-red-500" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium mb-1 truncate">{fileName}</h3>
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
