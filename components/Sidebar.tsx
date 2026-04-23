"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Package,
  Users,
  LayoutGrid,
  LogOut,
  Moon,
  Sun,
  ShieldAlert,
  Archive,
  User as UserIcon,
  DollarSign,
  CreditCard,
  AlertTriangle,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export type UserRole = "Superadmin" | "Admin" | "Employee" | null;

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  userRole: UserRole;
  userName?: string;
}

export function Sidebar({ className, userRole, userName = "User", ...props }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setTheme, theme } = useTheme();
  
  const currentStatus = searchParams.get("status");

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  const NavButton = ({ href, icon: Icon, children, isActive }: any) => (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className={cn(
        "w-full justify-start h-11 px-4 rounded-xl transition-all font-bold",
        isActive ? "bg-white/5 text-white" : "text-muted-foreground hover:text-white hover:bg-white/5"
      )}
      asChild
    >
      <Link href={href}>
        <Icon className={cn("mr-3 h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
        {children}
      </Link>
    </Button>
  );

  const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <div className="px-4 py-4 mt-2">
      <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em]">
        {children}
      </span>
    </div>
  );

  return (
    <div className={cn("pb-8 bg-[#0c0a0f] h-screen flex flex-col w-64 border-r border-white/5", className)} {...props}>
      <div className="flex-1 px-3 py-6 space-y-2 overflow-y-auto scrollbar-hide">
        <div className="px-4 mb-8 flex items-center gap-3">
          <div className="p-1.5 bg-primary/10 rounded-lg">
            <Archive className="h-6 w-6 text-primary" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">AssetTrack Pro</span>
        </div>

        <div className="space-y-1">
          {userRole === "Superadmin" ? (
            <>
              <NavButton 
                href="/superadmin-dashboard" 
                icon={ShieldAlert} 
                isActive={pathname === "/superadmin-dashboard"}
              >
                Superadmin Hub
              </NavButton>

              <SectionLabel>GLOBAL SYSTEM VIEW</SectionLabel>
              <NavButton 
                href="/dashboard" 
                icon={LayoutGrid} 
                isActive={pathname === "/dashboard"}
              >
                Vault Overview
              </NavButton>

              <SectionLabel>INVENTORY INSIGHTS</SectionLabel>
              <NavButton 
                href="/assets" 
                icon={DollarSign} 
                isActive={pathname === "/assets" && !currentStatus}
              >
                Total Assets
              </NavButton>
              <NavButton 
                href="/assets?status=ASSIGNED" 
                icon={Users} 
                isActive={pathname === "/assets" && currentStatus === "ASSIGNED"}
              >
                Assigned Assets
              </NavButton>
              <NavButton 
                href="/assets?status=AVAILABLE" 
                icon={CreditCard} 
                isActive={pathname === "/assets" && currentStatus === "AVAILABLE"}
              >
                Available Assets
              </NavButton>
              <NavButton 
                href="/assets?status=MAINTENANCE" 
                icon={AlertTriangle} 
                isActive={pathname === "/assets" && currentStatus === "MAINTENANCE"}
              >
                Maintenance
              </NavButton>
              <NavButton 
                href="/employees" 
                icon={Users} 
                isActive={pathname === "/employees"}
              >
                Directory
              </NavButton>
            </>
          ) : userRole === "Admin" ? (
            <>
              <NavButton 
                href="/dashboard" 
                icon={LayoutGrid} 
                isActive={pathname === "/dashboard"}
              >
                Dashboard
              </NavButton>

              <SectionLabel>INVENTORY INSIGHTS</SectionLabel>
              <NavButton 
                href="/assets" 
                icon={DollarSign} 
                isActive={pathname === "/assets" && !currentStatus}
              >
                Total Assets
              </NavButton>
              <NavButton 
                href="/assets?status=ASSIGNED" 
                icon={Users} 
                isActive={pathname === "/assets" && currentStatus === "ASSIGNED"}
              >
                Assigned Assets
              </NavButton>
              <NavButton 
                href="/assets?status=AVAILABLE" 
                icon={CreditCard} 
                isActive={pathname === "/assets" && currentStatus === "AVAILABLE"}
              >
                Available Assets
              </NavButton>
              <NavButton 
                href="/assets?status=MAINTENANCE" 
                icon={AlertTriangle} 
                isActive={pathname === "/assets" && currentStatus === "MAINTENANCE"}
              >
                Maintenance
              </NavButton>
              <NavButton 
                href="/employees" 
                icon={Users} 
                isActive={pathname === "/employees"}
              >
                Directory
              </NavButton>
            </>
          ) : (
            <>
              <NavButton 
                href="/my-assets" 
                icon={Package} 
                isActive={pathname === "/my-assets"}
              >
                My Assets
              </NavButton>
              <NavButton 
                href="/profile" 
                icon={UserIcon} 
                isActive={pathname === "/profile"}
              >
                Profile
              </NavButton>
            </>
          )}
        </div>
      </div>

      <div className="px-3 pb-4 space-y-4">
        <div className="bg-white/5 rounded-[1.25rem] p-4 border border-white/5">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-white/10 rounded-xl">
              <AvatarFallback className="bg-primary/20 text-primary font-bold">
                {userName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-white truncate">{userName}</span>
              <span className="text-[10px] font-bold text-muted-foreground tracking-wider">{userRole}</span>
            </div>
            <div className="ml-auto flex items-center">
               <button 
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-1.5 text-muted-foreground hover:text-white transition-colors"
               >
                 {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
               </button>
            </div>
          </div>
          
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full mt-4 h-11 justify-start rounded-xl text-muted-foreground hover:text-white hover:bg-white/5 px-3"
          >
            <LogOut className="mr-3 h-4 w-4" />
            <span className="font-bold text-sm">Log out</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
