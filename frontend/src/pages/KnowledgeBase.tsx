import { AppSidebar } from "@/components/AppSidebar";
import { PageHeader } from "@/components/PageHeader";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useDocumentTitle } from "@/hooks/use-document-title";
import UploadSection from "../components/UploadSection";
import DocumentList from "../components/DocumentList";

export default function KnowledgeBase() {
  useDocumentTitle("Knowledge Base");
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col">
        <PageHeader title="Knowledge Management" />
        <main className="flex-1 overflow-y-auto p-7">
          <div className="mx-auto max-w-7xl space-y-8">
            <UploadSection />
            <DocumentList />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
