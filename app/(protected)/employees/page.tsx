"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Search, Loader2, User as UserIcon, Package, Shield, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/SharedUtility";
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
import { Label } from "@/components/ui/label";

export default function EmployeesPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const [newEmployee, setNewEmployee] = useState({
    employee_code: "",
    first_name: "",
    last_name: "",
    email: "",
    designation: "",
    password: "", // Added password field
    department_id: 1 
  });

  const getApiUrl = () => {
    return process.env.NEXT_PUBLIC_API_URL || "https://asset-management-backend-zjco.onrender.com/api";
  };

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }

      const res = await fetch(`${getApiUrl()}/employees/`, {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });

      if (!res.ok) throw new Error("Could not access directory.");
      const data = await res.json();
      setEmployees(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load directory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role === "Employee") {
      router.push("/my-assets");
      return;
    }
    fetchEmployees();
  }, [router]);

  const handleOnboard = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${getApiUrl()}/employees/`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newEmployee)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Onboarding failed.");
      }

      toast.success("Employee record and login credentials established.");
      setIsAddModalOpen(false);
      fetchEmployees(); 
      // Reset form
      setNewEmployee({
        employee_code: "",
        first_name: "",
        last_name: "",
        email: "",
        designation: "",
        password: "",
        department_id: 1
      });
    } catch (err: any) {
      toast.error(err.message || "Onboarding system error.");
    }
  };

  const filteredEmployees = employees.filter(emp => 
    `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.employee_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-12 space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-white tracking-tight">Staff Directory</h1>
          <p className="text-[#94a3b8] text-sm font-medium opacity-80">
            Audit personnel records and manage infrastructure permissions.
          </p>
        </div>
        
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="h-14 px-8 rounded-xl bg-primary hover:bg-primary/90 text-black font-bold shadow-2xl transition-all active:scale-95 flex items-center gap-3">
              <UserPlus className="h-6 w-6" />
              Onboard Personnel
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px] bg-[#1a1625] border border-white/5 rounded-[24px] shadow-2xl p-0 overflow-hidden">
            <div className="bg-primary/5 p-8 border-b border-white/5">
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold text-white flex items-center gap-4">
                  <Shield className="h-8 w-8 text-primary" />
                  Staff Enrollment
                </DialogTitle>
                <DialogDescription className="text-[#94a3b8] mt-3 text-base font-medium">
                  Initialize a new identity record and set login credentials.
                </DialogDescription>
              </DialogHeader>
            </div>
            <form onSubmit={handleOnboard} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest ml-1">First Name</Label>
                  <Input 
                    placeholder="John" 
                    className="bg-black/30 border-white/5 rounded-xl h-12 text-white px-5"
                    value={newEmployee.first_name}
                    onChange={e => setNewEmployee({...newEmployee, first_name: e.target.value})}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest ml-1">Last Name</Label>
                  <Input 
                    placeholder="Doe" 
                    className="bg-black/30 border-white/5 rounded-xl h-12 text-white px-5"
                    value={newEmployee.last_name}
                    onChange={e => setNewEmployee({...newEmployee, last_name: e.target.value})}
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest ml-1">Official Email</Label>
                <Input 
                  type="email"
                  placeholder="j.doe@enterprise.com" 
                  className="bg-black/30 border-white/5 rounded-xl h-12 text-white px-5"
                  value={newEmployee.email}
                  onChange={e => setNewEmployee({...newEmployee, email: e.target.value})}
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest ml-1">System Code (Login ID)</Label>
                  <Input 
                    placeholder="EMP-XXX" 
                    className="bg-black/30 border-white/5 rounded-xl h-12 text-white px-5"
                    value={newEmployee.employee_code}
                    onChange={e => setNewEmployee({...newEmployee, employee_code: e.target.value})}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest ml-1">Designation</Label>
                  <Input 
                    placeholder="Engineer" 
                    className="bg-black/30 border-white/5 rounded-xl h-12 text-white px-5"
                    value={newEmployee.designation}
                    onChange={e => setNewEmployee({...newEmployee, designation: e.target.value})}
                  />
                </div>
              </div>

              {/* PASSWORD FIELD ADDED */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1">Initial Login Password</Label>
                  <Key className="h-3 w-3 text-primary/40" />
                </div>
                <Input 
                  type="password"
                  placeholder="Set employee password..." 
                  className="bg-primary/5 border-primary/20 rounded-xl h-12 text-white px-5 focus-visible:ring-primary/30"
                  value={newEmployee.password}
                  onChange={e => setNewEmployee({...newEmployee, password: e.target.value})}
                  required 
                />
                <p className="text-[9px] text-[#64748b] font-medium ml-1">Staff will be prompted to change this upon first login.</p>
              </div>

              <DialogFooter className="pt-4">
                <Button type="submit" className="w-full h-14 rounded-xl font-bold bg-primary text-black text-base hover:bg-primary/90 shadow-2xl transition-all">Finalize Enrollment</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative w-full sm:max-w-md">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#64748b]" />
        <Input 
          placeholder="Search corporate directory..." 
          className="pl-14 h-14 bg-[#13111c] border-white/5 rounded-xl text-white text-sm focus-visible:ring-primary shadow-xl"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="mt-16 grid gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <div className="col-span-full h-64 flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
            <p className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest">Accessing Directory...</p>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="col-span-full">
            <EmptyState 
              title="No Records Found" 
              description="No personnel match your current search parameters."
              className="bg-[#13111c] border border-white/5 p-20 rounded-[16px] text-center"
            />
          </div>
        ) : (
          filteredEmployees.map((emp) => (
            <div 
              key={emp.employee_id} 
              style={{ width: '400px', padding: '20px', borderRadius: '16px' }}
              className="bg-[#13111c] border border-white/5 shadow-2xl space-y-12 flex flex-col justify-between transition-all hover:border-white/10 group"
            >
              <div>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-primary transition-colors">
                      {emp.first_name} {emp.last_name}
                    </h3>
                    <p className="text-xs font-semibold text-[#64748b] tracking-widest uppercase">
                      CODE: {emp.employee_code}
                    </p>
                  </div>
                  <div className="text-[#475569] bg-white/5 p-2 rounded-xl">
                    <UserIcon className="h-6 w-6" />
                  </div>
                </div>

                <div className="mt-16 space-y-4">
                  <div className="flex text-[15px] font-medium items-center">
                    <span className="text-[#94a3b8] w-48 border-l border-white/5 pl-4">Email:</span>
                    <span className="text-[#cbd5e1] font-bold truncate max-w-[180px]">{emp.email}</span>
                  </div>
                  <div className="flex text-[15px] font-medium items-center">
                    <span className="text-[#94a3b8] w-48 border-l border-white/5 pl-4">Position:</span>
                    <span className="text-[#cbd5e1] font-bold">{emp.designation || "Staff Identity"}</span>
                  </div>
                </div>

                <div className="mt-10">
                  <div 
                    className="inline-flex items-center rounded-full border border-emerald-500 px-5 py-1 text-[10px] font-bold text-emerald-500 bg-transparent uppercase tracking-wider"
                  >
                    Active Clearance
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button 
                  className="w-full bg-white/5 hover:bg-white/10 text-primary border-0 rounded-xl h-14 flex items-center justify-center gap-3 transition-all active:scale-[0.98] cursor-pointer font-bold text-sm uppercase tracking-wide"
                >
                  <Package className="h-5 w-5" />
                  Access Portfolio
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
