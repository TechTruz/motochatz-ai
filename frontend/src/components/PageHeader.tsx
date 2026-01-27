import { NavUser } from "@/components/NavUser";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/stores/auth.store";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

interface PageHeaderProps {
  title: string;
}

export function PageHeader({ title }: PageHeaderProps) {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  return (
    <header className="bg-background sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-2 border-b px-3">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="mr-1 cursor-pointer" />
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
        {isAuthenticated && user ? (
          <NavUser
            user={{
              name: `${user.firstName} ${user.lastName || ""}`.trim(),
              email: user.email,
              avatar: "",
              role: user.role,
            }}
          />
        ) : (
          <div className="flex items-center gap-2">
            <Button
              onClick={() => navigate("/login")}
              variant="outline"
              size="sm"
              className="cursor-pointer"
            >
              Login
            </Button>
            <Button
              onClick={() => navigate("/register")}
              size="sm"
              className="cursor-pointer"
            >
              Register
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
