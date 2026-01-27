import { Upload } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UploadSection() {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Handle file drop logic here
  };

  const handleFileSelect = () => {
    // Open file picker
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf";
    input.onchange = (e) => {
      const { files } = e.target as HTMLInputElement;
      if (files && files.length > 0) {
        // Handle file selection
        console.log("Selected file:", files[0]);
      }
    };
    input.click();
  };

  return (
    <Card className="border-gray-800 bg-[#0F1729]">
      <CardHeader>
        <CardTitle className="text-xl text-white">
          Upload Manual Teknis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`rounded-lg border-2 border-dashed p-12 text-center transition-colors ${
            isDragging
              ? "border-blue-500 bg-blue-500/10"
              : "border-gray-700 hover:border-gray-600"
          }`}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-800">
              <Upload size={32} className="text-gray-400" />
            </div>

            <div>
              <p className="mb-2 font-medium text-white">
                Drag and drop file PDF atau klik untuk mencari file di komputer
                Anda
              </p>
              <p className="text-sm text-gray-400">
                Hanya file PDF yang diperbolehkan
              </p>
            </div>

            <Button
              onClick={handleFileSelect}
              size="lg"
              className="mt-4 cursor-pointer bg-blue-600 hover:bg-blue-700"
            >
              Pilih Dokumen
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
