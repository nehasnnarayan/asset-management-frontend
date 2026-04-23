"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PackagePlus, Search, Filter, MoreHorizontal, Loader2, UserCheck, Calendar, Hash, User, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/SharedUtility";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";

export default function AssetsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status");
  const [assets, setAssets] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // State for actions
  const [targetAsset, setTargetAsset] = useState<any>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [assignmentDate, setAssignmentDate] = useState(new Date().toISOString().split('T')[0]);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [newAsset, setNewAsset] = useState({
    asset_code: "",
    asset_name: "",
    asset_category: "HARDWARE",
    purchase_cost: 0,
    asset_condition: "NEW",
    purchase_date: new Date().toISOString().split('T')[0]
  });

  // Using absolute URL for production stability
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://asset-management-backend-zjco.onrender.com/api";

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiBase}/assets`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch assets");
      const data = await res.json();
      setAssets(data);
    } catch (err) {
      toast.error("Could not load inventory");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiBase}/employees`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setEmployees(data);
      }
    } catch (err) {
      console.error("Failed to load employee list");
    }
  };

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role === "Employee") {
      router.push("/my-assets");
      return;
    }
    fetchAssets();
    fetchEmployees();
  }, [router]);

  const handleCreateAsset = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiBase}/assets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newAsset)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to create asset");
      }

      toast.success("Asset added successfully");
      setIsAddModalOpen(false);
      fetchAssets();
    } catch (err: any) {
      toast.error(err.message || "Error creating asset");
    }
  };

  const handleAssignAsset = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedEmployeeId || !targetAsset) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiBase}/assignments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          asset_id: targetAsset.asset_id,
          employee_id: parseInt(selectedEmployeeId),
          assignment_date: assignmentDate,
          assigned_by_hr_id: parseInt(localStorage.getItem("employeeId") || "1")
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Assignment failed.");
      }

      toast.success(`Asset assigned successfully.`);
      setIsAssignModalOpen(false);
      fetchAssets();
    } catch (err: any) {
      console.error("DEBUG: Assignment error", err);
      toast.error(`System Error: ${err.message}`);
    }
  };

  const handleDeleteAsset = async () => {
    if (!targetAsset) return;
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiBase}/assets/${targetAsset.asset_id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Deletion rejected by server.");

      toast.success("Asset purged from inventory.");
      setIsDeleteModalOpen(false);
      fetchAssets();
    } catch (err: any) {
      toast.error(err.message || "System error during deletion.");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.asset_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.asset_code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter ? asset.asset_status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white tracking-tight">Asset Inventory</h1>
            {statusFilter && (
              <Badge className="bg-primary/20 text-primary border-0 rounded-full font-bold uppercase text-[10px] tracking-widest px-3">
                {statusFilter}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground font-medium">
            Audit and manage your technical infrastructure.
          </p>
        </div>

        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="h-12 rounded-xl bg-primary hover:bg-primary/90 text-black font-bold px-6 shadow-xl transition-all active:scale-95">
              <PackagePlus className="mr-2 h-5 w-5" />
              Add New Asset
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1a1625] border-white/5 rounded-3xl sm:max-w-[500px] shadow-3xl p-0 overflow-hidden">
            <div className="bg-primary/5 p-8 border-b border-white/5">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-white">New Inventory Entry</DialogTitle>
                <DialogDescription className="text-muted-foreground mt-2">
                  Enter the details of the new hardware asset.
                </DialogDescription>
              </DialogHeader>
            </div>
            <form onSubmit={handleCreateAsset} className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-1">Asset Code</Label>
                  <Input className="bg-black/20 border-white/5 rounded-xl h-12 text-white px-4" value={newAsset.asset_code} onChange={e => setNewAsset({ ...newAsset, asset_code: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-1">Asset Name</Label>
                  <Input className="bg-black/20 border-white/5 rounded-xl h-12 text-white px-4" value={newAsset.asset_name} onChange={e => setNewAsset({ ...newAsset, asset_name: e.target.value })} required />
                </div>
              </div>
              <DialogFooter className="pt-4">
                <Button type="submit" className="w-full h-14 rounded-xl bg-primary hover:bg-primary/90 text-black font-bold text-lg">Register Asset</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-[#1a1625]/60 rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row gap-4 justify-between bg-white/5">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search assets..."
              className="pl-12 h-12 bg-black/20 border-white/5 rounded-xl text-white focus-visible:ring-primary shadow-inner"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center gap-4 text-muted-foreground/30">
            <Loader2 className="h-10 w-10 animate-spin" />
          </div>
        ) : filteredAssets.length === 0 ? (
          <EmptyState title="Inventory Empty" description="No assets matching your filters." className="border-0 bg-transparent min-h-[400px]" />
        ) : (
          <ScrollArea className="h-[600px] w-full">
            <Table>
              <TableHeader className="bg-white/5 sticky top-0 z-10 backdrop-blur-md">
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="w-[150px] font-bold text-muted-foreground py-6 pl-8 uppercase text-[10px] tracking-widest">Code</TableHead>
                  <TableHead className="font-bold text-muted-foreground py-6 uppercase text-[10px] tracking-widest">Name</TableHead>
                  <TableHead className="font-bold text-muted-foreground py-6 text-center uppercase text-[10px] tracking-widest">Category</TableHead>
                  <TableHead className="font-bold text-muted-foreground py-6 text-center uppercase text-[10px] tracking-widest">Status</TableHead>
                  <TableHead className="font-bold text-muted-foreground py-6 text-right pr-8 uppercase text-[10px] tracking-widest">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.map((asset) => (
                  <TableRow key={asset.asset_id} className="border-white/5 hover:bg-white/5 transition-colors group">
                    <TableCell className="font-mono font-bold text-primary pl-8 py-6">{asset.asset_code}</TableCell>
                    <TableCell className="font-bold text-white py-6 text-base">{asset.asset_name}</TableCell>
                    <TableCell className="text-center py-6 text-muted-foreground font-bold">{asset.asset_category}</TableCell>
                    <TableCell className="text-center py-6">
                      <Badge
                        variant="outline"
                        className={`rounded-full px-4 py-0.5 font-bold text-[10px] border-0 ${asset.asset_status === 'AVAILABLE' ? 'bg-[#10b981]/10 text-[#10b981]' : 'bg-[#f59e0b]/10 text-[#f59e0b]'
                          }`}
                      >
                        {asset.asset_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-8 py-6 flex justify-end gap-2">
                      {asset.asset_status === 'AVAILABLE' ? (
                        <Button
                          size="sm"
                          onClick={() => {
                            setTargetAsset(asset);
                            setIsAssignModalOpen(true);
                          }}
                          className="h-9 px-3 bg-white/5 hover:bg-primary hover:text-black text-primary border border-primary/20 rounded-lg font-bold transition-all"
                        >
                          <UserCheck className="mr-2 h-4 w-4" />
                          Assign
                        </Button>
                      ) : (
                        <Button disabled size="sm" className="h-9 px-3 bg-white/5 text-muted-foreground/30 border border-white/5 rounded-lg font-bold italic">
                          Locked
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setTargetAsset(asset);
                          setIsDeleteModalOpen(true);
                        }}
                        className="h-9 w-9 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </div>

      {/* ASSIGN MODAL */}
      <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
        <DialogContent className="bg-[#1a1625] border border-white/5 rounded-[24px] sm:max-w-[500px] shadow-3xl p-0 overflow-hidden">
          <div className="bg-primary/5 p-8 border-b border-white/5 flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-2xl text-primary">
              <UserCheck className="h-8 w-8" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-white">Asset Assignment</DialogTitle>
              <DialogDescription className="text-muted-foreground mt-1">Provision {targetAsset?.asset_name} to personnel.</DialogDescription>
            </div>
          </div>
          <form onSubmit={handleAssignAsset} className="p-8 space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Target Personnel</Label>
              <select
                className="flex h-14 w-full rounded-xl border border-white/5 bg-black/40 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                value={selectedEmployeeId}
                onChange={e => setSelectedEmployeeId(e.target.value)}
                required
              >
                <option value="" disabled className="text-muted-foreground bg-[#1a1625]">Select Employee...</option>
                {employees.map(emp => (
                  <option key={emp.employee_id} value={emp.employee_id} className="bg-[#1a1625] text-white">
                    {emp.first_name} {emp.last_name} ({emp.employee_code})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Effective Date</Label>
              <Input type="date" className="bg-black/40 border-white/5 rounded-xl h-14 text-white px-5 font-bold" value={assignmentDate} onChange={e => setAssignmentDate(e.target.value)} />
            </div>
            <DialogFooter className="pt-4 flex gap-4">
              <Button type="button" variant="ghost" onClick={() => setIsAssignModalOpen(false)} className="flex-1 h-14 rounded-xl text-muted-foreground hover:text-white font-bold">Cancel</Button>
              <Button type="submit" className="flex-[2] h-14 rounded-xl bg-primary hover:bg-primary/90 text-black font-bold shadow-2xl transition-all">Complete Provisioning</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION MODAL */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="bg-[#1a1625] border border-white/5 rounded-[24px] sm:max-w-[400px] shadow-3xl p-8 space-y-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 bg-destructive/10 rounded-full text-destructive">
              <Trash2 className="h-10 w-10" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white">Purge Asset?</DialogTitle>
              <DialogDescription className="text-muted-foreground mt-2">
                This action will permanently remove <span className="text-white font-bold">{targetAsset?.asset_name}</span> from the inventory. This cannot be undone.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="flex gap-4 pt-2">
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)} className="flex-1 h-12 rounded-xl text-muted-foreground hover:text-white font-bold">Cancel</Button>
            <Button
              onClick={handleDeleteAsset}
              disabled={isDeleting}
              className="flex-1 h-12 rounded-xl bg-destructive hover:bg-destructive/90 text-white font-bold shadow-lg shadow-destructive/20"
            >
              {isDeleting ? "Purging..." : "Confirm Purge"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
