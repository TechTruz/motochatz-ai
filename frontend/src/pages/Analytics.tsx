import { AppSidebar } from "@/components/AppSidebar";
import { PageHeader } from "@/components/PageHeader";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { ChartRadialShape } from "@/components/ui/chart-radial-shape";
import { ChartAreaInteractive } from "@/components/ui/chart-area-interactive";

export default function Analytics() {
  useDocumentTitle("Analytics");

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col">
        <PageHeader title="Analytics" />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="grid gap-6 md:grid-cols-3">
              <ChartRadialShape
                title="Total Queries"
                description="Last 30 days"
                value={8547}
                label="Queries"
                endAngle={250}
                trendText="Trending up by 12.3% this month"
                footerText="Showing total queries for the last month"
                colorKey="queries"
              />
              <ChartRadialShape
                title="Avg Accuracy"
                description="Response quality"
                value={94}
                label="% Accuracy"
                endAngle={340}
                trendText="Improved by 2.1% this month"
                footerText="Average response accuracy rate"
                colorKey="accuracy"
              />
              <ChartRadialShape
                title="Unresolved Questions"
                description="Pending resolution"
                value={127}
                label="Pending"
                endAngle={90}
                trendText="Down by 8.5% from last month"
                footerText="Questions awaiting response"
                colorKey="unresolved"
              />
            </div>
            <ChartAreaInteractive />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
