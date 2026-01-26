import { AppSidebar } from "@/components/AppSidebar";
import { PageHeader } from "@/components/PageHeader";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useDocumentTitle } from "@/hooks/use-document-title";
import ChatSection from "@/components/ChatSection";
import PDFReaderSection from "@/components/PDFReaderSection";

export default function Playground() {
  useDocumentTitle("Playground");
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col">
        <PageHeader title="Playground / Simulator" />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <ChatSection />
            <PDFReaderSection />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
