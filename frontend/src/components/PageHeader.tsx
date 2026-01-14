import { NavUser } from '@/components/NavUser';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';

interface PageHeaderProps {
  title: string;
}

export function PageHeader({ title }: PageHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-3 sticky top-0 bg-background z-10">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="cursor-pointer mr-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-xl font-semibold">
                {title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="mr-2">
        <NavUser user={{
          name: "Admin User",
          email: "admin@motochatzai.com",
          avatar: "",
          role: "Superadmin"
        }} />
      </div>
    </header>
  );
}
