import { FileText, Download, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DocumentData } from "@/types/document.types";

interface DocumentCardProps extends DocumentData {
  onDelete?: (documentId: string) => void;
}

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    UPLOADING: "Sedang Diupload",
    UPLOADED: "Terupload",
    INDEXED: "Terindeks",
  };
  return labels[status] || status;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function DocumentCard({
  documentId,
  fileName,
  fileSize,
  createdAt,
  status,
  documentUrl,
  onDelete,
}: DocumentCardProps) {
  const statusVariants = {
    UPLOADING: "secondary" as const,
    UPLOADED: "secondary" as const,
    INDEXED: "default" as const,
  } as const;

  return (
    <Card className="border-gray-800 bg-[#0F1729] transition-colors hover:border-gray-700">
      <div className="flex items-center justify-between p-6">
        <div className="flex min-w-0 flex-1 items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-800">
            <FileText size={24} className="text-red-500" />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="mb-1 truncate font-medium text-white">{fileName}</h3>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span>{formatFileSize(fileSize)}</span>
              <span>•</span>
              <span>{formatDate(createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant={statusVariants[status] || "default"}>
            {getStatusLabel(status)}
          </Badge>
          {status === "INDEXED" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.open(documentUrl, "_blank")}
              className="h-9 w-9 text-gray-400 hover:text-white"
            >
              <Download size={18} />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(documentId)}
              className="h-9 w-9 text-gray-400 hover:text-red-500"
            >
              <Trash2 size={18} />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
