"use client";

import * as React from "react";
import { type LucideIcon } from "lucide-react";
import {
  IconLogout,
  IconUserCircle,
  IconHelp,
  IconInfoCircle,
} from "@tabler/icons-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth.store";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const navigate = useNavigate();
  const { isAuthenticated, clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    toast.success("Logged out successfully");
    navigate("/knowledge-base");
  };

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              {item.title === "Settings" ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton className="cursor-pointer">
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="min-w-56 rounded-lg"
                    side="top"
                    align="start"
                    sideOffset={4}
                  >
                    {isAuthenticated ? (
                      <>
                        <DropdownMenuGroup>
                          <DropdownMenuItem>
                            <IconUserCircle />
                            Account
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                          <IconLogout />
                          Log out
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <IconHelp />
                          Help & Support
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <IconInfoCircle />
                          About
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <SidebarMenuButton asChild>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
