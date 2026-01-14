import { AppSidebar } from "@/components/AppSidebar";
import { PageHeader } from "@/components/PageHeader";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function Analytics() {
  useDocumentTitle("Analytics");
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col">
        <PageHeader title="Analytics" />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-8"></div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
