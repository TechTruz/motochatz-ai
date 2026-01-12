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
    <Card className="bg-[#0F1729] border-gray-800">
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
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            isDragging
              ? "border-blue-500 bg-blue-500/10"
              : "border-gray-700 hover:border-gray-600"
          }`}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
              <Upload size={32} className="text-gray-400" />
            </div>

            <div>
              <p className="text-white font-medium mb-2">
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
              className="mt-4 bg-blue-600 hover:bg-blue-700 cursor-pointer"
            >
              Pilih Dokumen
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
