"use client";

import { useState, useEffect } from "react";
import { User, Lock, Save, Loader2, ShieldCheck, Mail, Building, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    old_password: "",
    new_password: "",
    confirm_password: ""
  });

  const getApiUrl = () => {
    return process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/";
        return;
      }

      const res = await fetch(`${getApiUrl()}/api/auth/me`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.clear();
          window.location.href = "/";
          return;
        }
        throw new Error("Failed to fetch profile data");
      }

      const data = await res.json();
      setUser(data);
    } catch (err: any) {
      console.error("Profile Fetch Error:", err);
      toast.error(err.message || "Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!passwords.old_password || !passwords.new_password) {
      toast.error("Please fill in the required password fields.");
      return;
    }

    if (passwords.new_password.length < 4) {
      toast.error("New password must be at least 4 characters.");
      return;
    }

    if (passwords.new_password !== passwords.confirm_password) {
      toast.error("Passwords do not match. Please verify.");
      return;
    }

    setChangingPassword(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${getApiUrl()}/api/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        },
        body: JSON.stringify({
          old_password: passwords.old_password,
          new_password: passwords.new_password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Authentication failed. check current password.");
      }

      toast.success("Password successfully updated. Your account is secure.");
      setPasswords({ old_password: "", new_password: "", confirm_password: "" });
    } catch (err: any) {
      console.error("Password Change Error:", err);
      toast.error(err.message || "Failed to update security credentials.");
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-primary/30" />
        <p className="mt-4 text-[10px] font-bold text-primary/40 uppercase tracking-widest">Validating Credentials...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-12 space-y-12 animate-in fade-in duration-700">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold text-white tracking-tight">Security & Profile</h1>
        <p className="text-[#94a3b8] text-base font-medium opacity-80">Update your account credentials and view access privileges.</p>
      </div>

      <div className="grid gap-10 md:grid-cols-5">
        <Card className="md:col-span-2 bg-[#13111c] border-white/5 rounded-[16px] overflow-hidden self-start shadow-2xl">
          <div className="p-10 bg-primary/5 flex flex-col items-center gap-6 border-b border-white/5">
            <div className="h-28 w-28 rounded-full bg-gradient-to-br from-primary to-primary/40 flex items-center justify-center text-4xl font-bold text-black shadow-2xl relative">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"></div>
              <span className="relative z-10">{user?.employee_code?.charAt(0) || "E"}</span>
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white tracking-tight">{user?.employee_code}</h2>
              <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                  {user?.roles?.[0] || "Authorized Personnel"}
                </span>
              </div>
            </div>
          </div>
          <CardContent className="p-10 space-y-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="mt-1 p-2 bg-white/5 rounded-lg">
                  <Mail className="h-4 w-4 text-[#475569]" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest">Employee System ID</p>
                  <p className="text-[#cbd5e1] font-medium">{user?.employee_id || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 p-2 bg-white/5 rounded-lg">
                  <Building className="h-4 w-4 text-[#475569]" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest">Status</p>
                  <p className="text-emerald-500 font-bold tracking-wide">ACTIVE INFRASTRUCTURE ACCESS</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 bg-[#13111c] border-white/5 rounded-[16px] overflow-hidden shadow-2xl">
          <CardHeader className="p-10 pb-0 space-y-4">
            <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <KeyRound className="h-7 w-7 text-amber-500" />
              Update Credentials
            </CardTitle>
            <CardDescription className="text-[#94a3b8] text-base font-medium opacity-80 leading-relaxed">
              For security reasons, we recommend updating your password periodically.
              Ensure your new password is secure and unique.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-10">
            <form onSubmit={handleChangePassword} className="space-y-8">
              <div className="space-y-3">
                <Label className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest ml-1">Current Password</Label>
                <Input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="bg-black/40 border border-white/5 rounded-xl h-14 text-white px-6 focus-visible:ring-primary/20 transition-all text-lg"
                  value={passwords.old_password}
                  onChange={e => setPasswords({ ...passwords, old_password: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest ml-1">New Password</Label>
                  <Input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="bg-black/40 border border-white/5 rounded-xl h-14 text-white px-6 focus-visible:ring-primary/20 transition-all text-lg"
                    value={passwords.new_password}
                    onChange={e => setPasswords({ ...passwords, new_password: e.target.value })}
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest ml-1">Confirm New Password</Label>
                  <Input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="bg-black/40 border border-white/5 rounded-xl h-14 text-white px-6 focus-visible:ring-primary/20 transition-all text-lg"
                    value={passwords.confirm_password}
                    onChange={e => setPasswords({ ...passwords, confirm_password: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={changingPassword}
                  className="w-full h-14 rounded-xl bg-primary hover:bg-primary/90 text-black font-bold text-base shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  {changingPassword ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Updating Security Protocols...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      Commit Password Change
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
