"use client";

import { useState, useEffect, FormEvent } from "react";
import { UserPlus, Search, Mail, Building2, MoreVertical, Loader2, Users } from "lucide-react";
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
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Form State
  const [newEmployee, setNewEmployee] = useState({
    employee_code: "",
    first_name: "",
    last_name: "",
    email: "",
    designation: "",
    department_id: 1 // Default
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/api/employees/`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch employees");
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      toast.error("Could not load employee directory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleOnboard = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/api/employees/`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newEmployee)
      });
      if (!res.ok) throw new Error("Failed to onboard employee");
      toast.success("Employee successfully onboarded!");
      setIsAddModalOpen(false);
      fetchEmployees(); // Refresh list
    } catch (err) {
      toast.error("Error onboarding employee");
    }
  };

  const filteredEmployees = employees.filter(emp => 
    `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.employee_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight premium-gradient-text">Employee Directory</h1>
          <p className="text-muted-foreground/80 mt-2 font-medium">
            View all staff members and manage their infrastructure access.
          </p>
        </div>
        
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="h-12 px-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 transition-all active:scale-95">
              <UserPlus className="mr-2 h-5 w-5" />
              Onboard Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] glass-panel border-white/10 rounded-[2rem]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Staff Onboarding</DialogTitle>
              <DialogDescription>
                Fill in the official details to register a new staff member.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleOnboard} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input 
                    id="first_name" 
                    placeholder="John" 
                    className="bg-muted/50 border-0 rounded-xl h-12"
                    value={newEmployee.first_name}
                    onChange={e => setNewEmployee({...newEmployee, first_name: e.target.value})}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input 
                    id="last_name" 
                    placeholder="Doe" 
                    className="bg-muted/50 border-0 rounded-xl h-12"
                    value={newEmployee.last_name}
                    onChange={e => setNewEmployee({...newEmployee, last_name: e.target.value})}
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email"
                  placeholder="john.doe@enterprise.com" 
                  className="bg-muted/50 border-0 rounded-xl h-12"
                  value={newEmployee.email}
                  onChange={e => setNewEmployee({...newEmployee, email: e.target.value})}
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emp_code">Employee Code</Label>
                  <Input 
                    id="emp_code" 
                    placeholder="EMP-XXX" 
                    className="bg-muted/50 border-0 rounded-xl h-12"
                    value={newEmployee.employee_code}
                    onChange={e => setNewEmployee({...newEmployee, employee_code: e.target.value})}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="designation">Designation</Label>
                  <Input 
                    id="designation" 
                    placeholder="Senior Engineer" 
                    className="bg-muted/50 border-0 rounded-xl h-12"
                    value={newEmployee.designation}
                    onChange={e => setNewEmployee({...newEmployee, designation: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter className="pt-4">
                <Button type="submit" className="w-full h-12 rounded-xl font-bold bg-primary">Finalize Onboarding</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search directory..." 
            className="pl-10 bg-transparent border-0 focus-visible:ring-0 text-lg"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <Badge variant="outline" className="h-8 rounded-lg border-white/10 text-muted-foreground font-bold">
          {filteredEmployees.length} Total
        </Badge>
      </div>

      {loading ? (
        <div className="h-96 flex flex-col items-center justify-center gap-4 text-muted-foreground/30">
          <Loader2 className="h-12 w-12 animate-spin" />
          <p className="font-bold text-lg">Synchronizing Directory...</p>
        </div>
      ) : filteredEmployees.length === 0 ? (
        <EmptyState 
          title="No Employees Found" 
          description="Try a different search or onboard a new member."
          className="border-0 bg-white/5 min-h-[400px]"
        />
      ) : (
        <ScrollArea className="h-[calc(100vh-350px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
            {filteredEmployees.map((emp) => (
              <Card key={emp.employee_id} className="glass-panel border-0 shadow-xl hover:shadow-primary/5 transition-all group overflow-hidden">
                <CardHeader className="relative pb-2">
                   <div className="flex justify-between items-start">
                     <Avatar className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 p-2">
                        <AvatarFallback className="bg-transparent text-primary font-black text-xl">
                          {emp.first_name[0]}{emp.last_name[0]}
                        </AvatarFallback>
                     </Avatar>
                     <Button variant="ghost" size="icon" className="rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="h-4 w-4" />
                     </Button>
                   </div>
                   <div className="mt-4">
                      <h3 className="text-xl font-black tracking-tight text-foreground">{emp.first_name} {emp.last_name}</h3>
                      <p className="text-sm font-bold text-primary">{emp.employee_code}</p>
                   </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-4 border-t border-white/5">
                   <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{emp.email}</span>
                   </div>
                   <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      <span>{emp.designation || 'Staff Member'}</span>
                   </div>
                   <div className="pt-2">
                      <Badge className="w-full justify-center bg-white/10 hover:bg-white/20 text-foreground border-0 py-1.5 rounded-lg font-bold">
                        VIEW ASSETS
                      </Badge>
                   </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
