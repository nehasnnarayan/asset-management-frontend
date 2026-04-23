"use client";

import { ShieldAlert, UserPlus, Users, Trash2, Loader2, Mail, Shield } from "lucide-react";
import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/SharedUtility";

export default function SuperadminDashboardPage() {
  const router = useRouter();
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);
  
  // Form State
  const [newAdmin, setNewAdmin] = useState({
    employee_code: "",
    first_name: "",
    last_name: "",
    email: "",
    designation: "Administrator",
    password: ""
  });

  const apiUrl = "/api";

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/employees/admins/list`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch admins");
      const data = await res.json();
      setAdmins(data);
    } catch (err) {
      toast.error("Could not load administrator directory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleProvision = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/employees/provision-admin`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newAdmin)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to provision admin");
      }

      toast.success("Administrator provisioned successfully!");
      setIsProvisionModalOpen(false);
      fetchAdmins();
      setNewAdmin({
        employee_code: "",
        first_name: "",
        last_name: "",
        email: "",
        designation: "Administrator",
        password: ""
      });
    } catch (err: any) {
      toast.error(err.message || "Error provisioning administrator");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            Superadmin Hub
          </h1>
          <p className="text-muted-foreground">Manage privileged accounts and system-wide configurations.</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="bg-[#1a1625]/60 border-white/5 shadow-2xl rounded-[1.5rem] overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between p-8">
            <div>
              <CardTitle className="text-2xl font-bold text-white">Active Administrators</CardTitle>
              <CardDescription className="text-muted-foreground font-medium mt-1">
                The personnel authorized to manage assets and standard employees.
              </CardDescription>
            </div>
            
            <Dialog open={isProvisionModalOpen} onOpenChange={setIsProvisionModalOpen}>
              <DialogTrigger asChild>
                <Button className="font-bold rounded-xl h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-all active:scale-95">
                  <UserPlus className="mr-2 h-5 w-5" />
                  Provision Admin
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] bg-[#1a1625] border-white/5 rounded-3xl shadow-2xl">
                <DialogHeader className="p-2">
                  <DialogTitle className="text-2xl font-bold text-white">Provision New Administrator</DialogTitle>
                  <DialogDescription className="text-muted-foreground mt-2">
                    Create a new administrative account with full management privileges.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleProvision} className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">First Name</Label>
                      <Input 
                        placeholder="Sarah" 
                        className="bg-black/30 border-white/5 rounded-xl h-12 text-white px-4"
                        value={newAdmin.first_name}
                        onChange={e => setNewAdmin({...newAdmin, first_name: e.target.value})}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Last Name</Label>
                      <Input 
                        placeholder="Collins" 
                        className="bg-black/30 border-white/5 rounded-xl h-12 text-white px-4"
                        value={newAdmin.last_name}
                        onChange={e => setNewAdmin({...newAdmin, last_name: e.target.value})}
                        required 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Email Address</Label>
                    <Input 
                      type="email"
                      placeholder="sarah@enterprise.com" 
                      className="bg-black/30 border-white/5 rounded-xl h-12 text-white px-4"
                      value={newAdmin.email}
                      onChange={e => setNewAdmin({...newAdmin, email: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Admin ID Code</Label>
                      <Input 
                        placeholder="ADMIN-XXX" 
                        className="bg-black/30 border-white/5 rounded-xl h-12 text-white px-4"
                        value={newAdmin.employee_code}
                        onChange={e => setNewAdmin({...newAdmin, employee_code: e.target.value})}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Initial Password</Label>
                      <Input 
                        type="password"
                        placeholder="••••••••" 
                        className="bg-black/30 border-white/5 rounded-xl h-12 text-white px-4"
                        value={newAdmin.password}
                        onChange={e => setNewAdmin({...newAdmin, password: e.target.value})}
                        required 
                      />
                    </div>
                  </div>
                  <DialogFooter className="pt-4">
                    <Button type="submit" className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg transition-all">Grant Admin Privileges</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          
          <CardContent className="p-0">
            {loading ? (
              <div className="h-64 flex flex-col items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
              </div>
            ) : admins.length === 0 ? (
              <div className="p-12">
                <EmptyState 
                  title="No Administrators Found" 
                  description="Only you can provision new administrative accounts."
                  className="bg-white/5 border-0 rounded-2xl"
                />
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="w-[150px] font-bold text-muted-foreground uppercase text-xs tracking-wider pl-8 py-6">Admin ID</TableHead>
                    <TableHead className="font-bold text-muted-foreground uppercase text-xs tracking-wider py-6">Name</TableHead>
                    <TableHead className="font-bold text-muted-foreground uppercase text-xs tracking-wider py-6">Email</TableHead>
                    <TableHead className="font-bold text-muted-foreground uppercase text-xs tracking-wider py-6 text-center">Status</TableHead>
                    <TableHead className="text-right font-bold text-muted-foreground uppercase text-xs tracking-wider pr-8 py-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admins.map((admin) => (
                    <TableRow key={admin.employee_id} className="border-white/5 hover:bg-white/5 transition-colors group">
                      <TableCell className="font-bold text-primary pl-8 py-6">{admin.employee_code}</TableCell>
                      <TableCell className="font-bold text-white py-6">{admin.first_name} {admin.last_name}</TableCell>
                      <TableCell className="text-muted-foreground font-medium py-6">{admin.email}</TableCell>
                      <TableCell className="text-center py-6">
                        <Badge className="bg-[#10b981]/10 text-[#10b981] border-0 rounded-full font-bold px-4 py-1">
                          {admin.employment_status || "Active"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-8 py-6">
                         <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all rounded-xl group-hover:scale-110">
                            <Trash2 className="h-4 w-4" />
                         </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
