"use client";

import { useRouter } from "next/navigation";
import { LogOut, User, Settings, Bell, ChevronDown, Repeat } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
    let roles: UserRole[] = [];
    if (rolesStr) {
      try {
        roles = JSON.parse(rolesStr);
      } catch (e) {
        console.error("Failed to parse roles", e);
      }
    }

    // Force Role availability logic
    // If the user has EVER had Admin or Superadmin in their available roles, 
    // ensure they can always switch between them and Employee.
    const hasAdminRights = roles.includes("Admin") || roles.includes("Superadmin") || role === "Admin" || role === "Superadmin";
    
    if (hasAdminRights) {
      if (!roles.includes("Employee")) roles.push("Employee");
      if ((roles.includes("Superadmin") || role === "Superadmin") && !roles.includes("Admin")) roles.push("Admin");
    }
    
    setAvailableRoles(Array.from(new Set(roles)));
  }, [role]);

  const handleRoleSwitch = (newRole: UserRole) => {
    if (!newRole) return;
    localStorage.setItem("userRole", newRole);
    
    if (newRole === "Superadmin") {
      window.location.href = "/superadmin-dashboard";
    } else if (newRole === "Admin") {
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/my-assets";
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 bg-transparent px-6 justify-between md:justify-end">
      {/* Mobile Title */}
      <div className="flex items-center md:hidden">
        <span className="font-bold text-lg tracking-tight text-white">AssetTrack Pro</span>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4">
        {/* Switch Role Dropdown - Always show if manager has multiple roles */}
        {(availableRoles.length > 1 || role === "Admin" || role === "Superadmin") && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9 gap-2 rounded-full border-primary/40 bg-primary/5 text-primary hover:bg-primary/10 font-bold px-4 transition-all"
              >
                <Repeat className="h-4 w-4" />
                <span>Switch Role</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-[#1a1625] border-white/5 text-white">
              <DropdownMenuLabel className="text-muted-foreground font-bold text-xs uppercase tracking-wider">Available Roles</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/5" />
              {availableRoles.map((r) => (
                <DropdownMenuItem 
                  key={r} 
                  onClick={() => handleRoleSwitch(r)}
                  className={cn(
                    "cursor-pointer focus:bg-white/5 focus:text-white rounded-lg mx-1", 
                    role === r && "bg-primary/10 text-primary font-bold"
                  )}
                >
                  {r}
                  {role === r && <span className="ml-auto text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full">Active</span>}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-muted-foreground hover:text-white hover:bg-white/5">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden ring-2 ring-primary ring-offset-2 ring-offset-[#0c0a0f] hover:scale-105 transition-all">
              <Avatar className="h-full w-full rounded-none">
                <AvatarFallback className="bg-primary text-white text-sm font-bold">
                  {userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 bg-[#1a1625] border-white/5 text-white p-2" align="end" forceMount>
            <DropdownMenuLabel className="font-normal p-2">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-bold leading-none">{userName}</p>
                <p className="text-xs leading-none text-muted-foreground font-medium">
                  {role} Account
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuGroup>
              <DropdownMenuItem className="rounded-lg focus:bg-white/5 focus:text-white cursor-pointer py-2">
                <User className="mr-3 h-4 w-4 opacity-70" />
                <span className="font-medium">Profile Details</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg focus:bg-white/5 focus:text-white cursor-pointer py-2">
                <Settings className="mr-3 h-4 w-4 opacity-70" />
                <span className="font-medium">Account Settings</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem 
              className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer rounded-lg py-2" 
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-4 w-4" />
              <span className="font-bold">Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
