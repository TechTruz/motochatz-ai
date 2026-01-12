import * as React from "react";
import { BookOpen, PlaySquare, BarChart3, Settings } from "lucide-react";

import { NavMain } from "@/components/NavMain";
import { NavSecondary } from "@/components/NavSecondary";
import { NavUser } from "@/components/NavUser";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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
      url: "#",
      icon: BookOpen,
    },
    {
      title: "Playground / Simulator",
      url: "#",
      icon: PlaySquare,
    },
    {
      title: "Analytics",
      url: "#",
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
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="pt-4 pb-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="h-10 px-3">
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
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
