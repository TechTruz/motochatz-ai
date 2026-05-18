import { AppSidebar } from "@/components/AppSidebar";
import { PageHeader } from "@/components/PageHeader";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useDocumentTitle } from "@/hooks/use-document-title";
import UploadSection from "../components/UploadSection";
import DocumentList from "../components/DocumentList";
import { useState } from "react";

export default function KnowledgeBase() {
  useDocumentTitle("Knowledge Base");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col">
        <PageHeader title="Knowledge Management" />
        <main className="flex-1 overflow-y-auto p-7">
          <div className="mx-auto max-w-7xl space-y-8">
            <UploadSection onUploadSuccess={handleUploadSuccess} />
            <DocumentList refreshTrigger={refreshTrigger} />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
