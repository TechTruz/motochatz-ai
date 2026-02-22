"use client";

import * as React from "react";
import { type LucideIcon } from "lucide-react";
import {
  IconLogout,
  IconUserCircle,
  IconHelp,
  IconInfoCircle,
} from "@tabler/icons-react";
import { useAuthStore } from "@/stores/auth.store";
import { useLogout } from "@/hooks/use-auth";
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
  const { isAuthenticated } = useAuthStore();
  const { mutate: logout } = useLogout();

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
                          <DropdownMenuItem className="cursor-pointer">
                            <IconUserCircle />
                            Account
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => logout()}
                          className="cursor-pointer"
                        >
                          <IconLogout />
                          Log out
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <DropdownMenuGroup>
                        <DropdownMenuItem className="cursor-pointer">
                          <IconHelp />
                          Help & Support
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
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
