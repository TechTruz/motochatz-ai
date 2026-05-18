import DocumentCard from "./DocumentCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { documentService } from "@/services/document.service";
import { useAuthStore } from "@/stores/auth.store";
import { useEffect, useState } from "react";
import type { DocumentData, PaginationData } from "@/types/document.types";
import { Button } from "@/components/ui/button";

interface DocumentListProps {
  refreshTrigger?: number;
}

export default function DocumentList({ refreshTrigger }: DocumentListProps) {
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const { user } = useAuthStore();

  const fetchDocuments = async () => {
    if (!user?.garageId) {
      setError("Garage ID tidak ditemukan");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await documentService.getDocuments({
        garageId: user.garageId,
        limit,
        page: currentPage,
        status: "ALL",
        sort: "-createdAt",
      });

      setDocuments(response.data);
      setPagination(response.pagination);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Gagal memuat dokumen";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [currentPage, user?.garageId, refreshTrigger]);

  const handleDelete = async (documentId: string) => {
    if (confirm("Yakin ingin menghapus dokumen ini?")) {
      try {
        // TODO: Implement delete API call when available
        alert("Fitur hapus belum tersedia");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Gagal menghapus dokumen";
        setError(message);
      }
    }
  };

  return (
    <Card className="border-gray-800 bg-[#0F1729]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-white">
            Dokumen Terindeks
          </CardTitle>
          {pagination && (
            <span className="text-sm text-gray-400">
              {pagination.totalRecords} dokumen
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 rounded-lg bg-red-900/20 p-4 text-red-400">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-400">Memuat dokumen...</p>
          </div>
        ) : documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="mb-2 text-gray-400">Belum ada dokumen</p>
            <p className="text-sm text-gray-500">
              Mulai dengan mengupload dokumen baru
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {documents.map((doc) => (
                <DocumentCard
                  key={doc.documentId}
                  {...doc}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {pagination && pagination.totalPage > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <Button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={!pagination.hasPrevPage}
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:text-white"
                >
                  Sebelumnya
                </Button>
                <span className="text-sm text-gray-400">
                  Halaman {pagination.currentPage} dari {pagination.totalPage}
                </span>
                <Button
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={!pagination.hasNextPage}
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:text-white"
                >
                  Berikutnya
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
