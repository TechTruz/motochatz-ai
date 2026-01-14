import * as React from "react";
import { BookOpen, PlaySquare, BarChart3, Settings } from "lucide-react";
import { useLocation } from "react-router";

import { NavMain } from "@/components/NavMain";
import { NavSecondary } from "@/components/NavSecondary";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "Admin User",
    email: "admin@motochatzai.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Knowledge Base",
      url: "/knowledge-base",
      icon: BookOpen,
    },
    {
      title: "Playground / Simulator",
      url: "/playground",
      icon: PlaySquare,
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: BarChart3,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="pt-3 pb-5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="h-10 px-1 cursor-default">
              <a href="#" className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-blue-600">
                  <span className="text-lg font-bold text-white">M</span>
                </div>
                <span className="text-sm font-semibold leading-none">
                  Moto Chatz AI
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="pt-2">
        <NavMain items={data.navMain} currentPath={location.pathname} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  );
}
