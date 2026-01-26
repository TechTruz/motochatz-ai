import PDFContent from "./PDFContent";
import { Card, CardFooter, CardHeader, CardTitle } from "./ui/card";

export default function PDFReaderSection() {
  return (
    <Card className="bg-[#0F1729] border-gray-800 ">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl text-white">
              Dokumen Referensi
            </CardTitle>
          </div>
          <div>
            <CardTitle className="text-xl text-gray-400">
              HAL. 34 / 512
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <PDFContent />
      <CardFooter className="flex flex-col gap-4 ">
        <p className="text-gray-400">INTERNAL SANDBOX ENVIRONMENT</p>
      </CardFooter>
    </Card>
  );
}
