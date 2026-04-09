"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [employeeCode, setEmployeeCode] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employee_code: employeeCode, password }),
      });

      if (!res.ok) {
        throw new Error("Invalid Employee ID or Password.");
      }

      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("userName", data.user.employee_code);
      
      const roles = data.user.roles || [];
      localStorage.setItem("availableRoles", JSON.stringify(roles));
      
      const primaryRole = roles[0] || "Employee";
      localStorage.setItem("userRole", primaryRole);

      toast.success("Login Successful!");

      // Role Based Routing
      if (primaryRole === "Superadmin") {
        router.push("/superadmin-dashboard");
      } else if (primaryRole === "Admin") {
        router.push("/dashboard");
      } else {
        router.push("/my-assets");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to login. Please check connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 charity-bg">
      <div className="w-full max-w-sm glass-panel p-8 sm:p-10 rounded-[1.5rem] shadow-2xl relative z-10 border-0 flex flex-col items-center">

        {/* Branding */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary relative">
            <Archive className="w-8 h-8 relative z-10" />
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tighter text-foreground mb-1 mt-2 text-center">
            AssetTrack Pro
          </h1>
          <p className="text-sm font-medium text-muted-foreground text-center px-4">
            Together, We're Managing Operations
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleLogin} className="w-full space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="employeeCode" className="font-bold text-foreground ml-1">Employee ID</Label>
              <Input
                id="employeeCode"
                placeholder="Ex. SUPER_001"
                className="h-12 rounded-2xl bg-muted/50 border-0 ring-1 ring-border/50 focus-visible:ring-primary focus-visible:ring-2 px-4 shadow-sm font-medium"
                value={employeeCode}
                onChange={(e) => setEmployeeCode(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-bold text-foreground ml-1">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-12 rounded-2xl bg-muted/50 border-0 ring-1 ring-border/50 focus-visible:ring-primary focus-visible:ring-2 pl-4 pr-12 shadow-sm font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg shadow-lg hover:shadow-primary/25 transition-all mt-4"
            disabled={isLoading}
          >
            {isLoading ? "AUTHENTICATING..." : "LOGIN"}
          </Button>
        </form>
      </div>

      {/* Footer Branding */}
      <div className="fixed bottom-8 left-8 flex gap-4 text-sm font-bold text-foreground/50 tracking-wider">
        <span>HOPERIAL</span>
        <span>SECURITY</span>
      </div>
    </div>
  );
}
