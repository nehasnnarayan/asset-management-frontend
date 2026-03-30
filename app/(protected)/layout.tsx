"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar, UserRole } from "@/components/Sidebar";
import { TopNavbar } from "@/components/TopNavbar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>(null);
  const [userName, setUserName] = useState<string>("Loading...");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedRole = localStorage.getItem("userRole") as UserRole;
    const storedName = localStorage.getItem("userName");
    
    // Strict Routing Barrier
    if (!storedRole) {
       router.push("/");
       return;
    }

    setRole(storedRole);
    setUserName(storedName || "Authenticated User");
  }, [router]);

  if (!isMounted || !role) return <div className="min-h-screen charity-bg flex items-center justify-center font-bold text-primary">Loading Framework...</div>;

  return (
    <div className="flex h-screen overflow-hidden charity-bg">
      <Sidebar userRole={role} userName={userName} className="w-64 flex-shrink-0 hidden md:flex z-10" />

      <div className="flex-1 flex flex-col overflow-hidden z-10">
        <TopNavbar role={role} userName={userName} />

        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
