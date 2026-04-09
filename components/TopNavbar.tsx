"use client";

import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { LogOut, User, Settings, Bell, ChevronDown, Repeat } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserRole } from "./Sidebar";

interface TopNavbarProps {
  userName?: string;
  role?: UserRole;
}

export function TopNavbar({ userName = "User", role = "Employee" }: TopNavbarProps) {
  const router = useRouter();
  const [availableRoles, setAvailableRoles] = useState<UserRole[]>([]);

  useEffect(() => {
    const rolesStr = localStorage.getItem("availableRoles");
    if (rolesStr) {
      try {
        setAvailableRoles(JSON.parse(rolesStr));
      } catch (e) {
        console.error("Failed to parse roles", e);
      }
    }
  }, []);

  const handleRoleSwitch = (newRole: UserRole) => {
    if (!newRole) return;
    localStorage.setItem("userRole", newRole);
    
    // Redirect based on the new role
    if (newRole === "Superadmin") {
      router.push("/superadmin-dashboard");
    } else if (newRole === "Admin") {
      router.push("/dashboard");
    } else {
      router.push("/my-assets");
    }
    
    // Refresh to update sidebar and other role-dependent components
    router.refresh();
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("availableRoles");
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 bg-background px-4 sm:static sm:h-16 sm:px-6 justify-between md:justify-end">
      {/* Mobile Title */}
      <div className="flex items-center md:hidden">
        <span className="font-semibold text-lg tracking-tight">AssetTrack Pro</span>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4">
        {/* Switch Role Dropdown */}
        {availableRoles.length > 1 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1 rounded-full border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 font-bold px-3">
                <Repeat className="h-3.5 w-3.5" />
                <span>Switch Role</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Available Roles</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {availableRoles.map((r) => (
                <DropdownMenuItem 
                  key={r} 
                  onClick={() => handleRoleSwitch(r)}
                  className={cn("cursor-pointer", role === r && "bg-muted font-bold")}
                >
                  {r}
                  {role === r && <span className="ml-auto text-xs text-muted-foreground ml-2">(Active)</span>}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <Button variant="outline" size="icon" className="h-8 w-8 rounded-full hidden sm:flex border-0 ring-1 ring-border/10 bg-background hover:bg-white text-foreground">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Toggle notifications</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full ring-2 ring-primary bg-primary text-primary-foreground">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-transparent text-primary-foreground text-xs font-bold">
                  {userName.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{userName}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {role} Account
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Preferences</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive cursor-pointer" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
