"use client";

import { useState, useEffect, FormEvent } from "react";
import { PackagePlus, Search, Filter, MoreHorizontal, Loader2 } from "lucide-react";
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
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Form State
  const [newAsset, setNewAsset] = useState({
    asset_code: "",
    asset_name: "",
    asset_category: "HARDWARE",
    purchase_cost: 0,
    asset_condition: "NEW",
    purchase_date: new Date().toISOString().split('T')[0]
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/api/assets/`, {
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

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleCreateAsset = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/api/assets/`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newAsset)
      });
      if (!res.ok) throw new Error("Failed to create asset");
      toast.success("Asset added to vault!");
      setIsAddModalOpen(false);
      fetchAssets(); // Refresh list
    } catch (err) {
      toast.error("Error creating asset");
    }
  };

  const filteredAssets = assets.filter(asset => 
    asset.asset_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.asset_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight premium-gradient-text">Asset Inventory</h1>
          <p className="text-muted-foreground/80 mt-2 font-medium">
            Manage your high-value hardware and equipment in the digital vault.
          </p>
        </div>
        
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="h-12 px-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 transition-all active:scale-95">
              <PackagePlus className="mr-2 h-5 w-5" />
              Add New Asset
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] glass-panel border-white/10 rounded-[2rem]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">New Inventory Entry</DialogTitle>
              <DialogDescription>
                Enter the details of the new hardware asset.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateAsset} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="asset_code">Asset Code</Label>
                  <Input 
                    id="asset_code" 
                    placeholder="Ex: ASSET-001" 
                    className="bg-muted/50 border-0 rounded-xl px-4 h-12"
                    value={newAsset.asset_code}
                    onChange={e => setNewAsset({...newAsset, asset_code: e.target.value})}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="asset_name">Asset Name</Label>
                  <Input 
                    id="asset_name" 
                    placeholder="Ex: MacBook Pro" 
                    className="bg-muted/50 border-0 rounded-xl px-4 h-12"
                    value={newAsset.asset_name}
                    onChange={e => setNewAsset({...newAsset, asset_name: e.target.value})}
                    required 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="asset_category">Category</Label>
                  <Input 
                    id="asset_category" 
                    className="bg-muted/50 border-0 rounded-xl px-4 h-12"
                    value={newAsset.asset_category}
                    onChange={e => setNewAsset({...newAsset, asset_category: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purchase_cost">Cost ($)</Label>
                  <Input 
                    id="purchase_cost" 
                    type="number" 
                    className="bg-muted/50 border-0 rounded-xl px-4 h-12"
                    value={newAsset.purchase_cost}
                    onChange={e => setNewAsset({...newAsset, purchase_cost: parseFloat(e.target.value) || 0})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="purchase_date">Purchase Date</Label>
                <Input 
                  id="purchase_date" 
                  type="date" 
                  className="bg-muted/50 border-0 rounded-xl px-4 h-12"
                  value={newAsset.purchase_date}
                  onChange={e => setNewAsset({...newAsset, purchase_date: e.target.value})}
                />
              </div>
              <DialogFooter className="pt-4">
                <Button type="submit" className="w-full h-12 rounded-xl bg-primary font-bold text-lg">Register Asset</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters & Table Section */}
      <div className="glass-panel rounded-[2rem] shadow-2xl border-0 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row gap-4 justify-between bg-white/5">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search assets by name or code..." 
              className="pl-10 h-11 bg-muted/30 border-0 rounded-xl ring-1 ring-white/10 focus-visible:ring-primary"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-white/10 bg-white/5">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center gap-4 text-muted-foreground/30">
             <Loader2 className="h-12 w-12 animate-spin" />
             <p className="font-bold text-lg">Scanning Vault...</p>
          </div>
        ) : filteredAssets.length === 0 ? (
          <EmptyState 
            title={searchQuery ? "No Matches Found" : "Archive Empty"} 
            description={searchQuery ? "Try adjusting your filters." : "Your digital vault is currently empty."}
            className="border-0 bg-transparent min-h-[500px]"
            action={!searchQuery && (
              <Button 
                onClick={() => setIsAddModalOpen(true)}
                variant="outline" 
                className="h-12 px-8 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 font-bold"
              >
                Provision First Asset
              </Button>
            )}
          />
        ) : (
          <ScrollArea className="h-[600px] w-full">
            <Table>
              <TableHeader className="bg-white/5 sticky top-0 z-10 backdrop-blur-md">
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="w-[120px] font-bold text-foreground py-6 pl-8">Code</TableHead>
                  <TableHead className="font-bold text-foreground py-6">Asset Name</TableHead>
                  <TableHead className="font-bold text-foreground py-6 text-center">Category</TableHead>
                  <TableHead className="font-bold text-foreground py-6 text-center">Status</TableHead>
                  <TableHead className="font-bold text-foreground py-6 text-right pr-8">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.map((asset) => (
                  <TableRow key={asset.asset_id} className="border-white/5 hover:bg-white/5 transition-colors group">
                    <TableCell className="font-mono font-bold text-primary pl-8 py-5">{asset.asset_code}</TableCell>
                    <TableCell className="font-semibold text-foreground py-5">{asset.asset_name}</TableCell>
                    <TableCell className="text-center py-5">
                      <Badge variant="outline" className="rounded-md border-white/10 bg-white/5 font-medium">
                        {asset.asset_category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center py-5">
                      <Badge 
                        className="rounded-md px-3 py-1 shadow-none font-bold" 
                        variant={asset.asset_status === 'AVAILABLE' ? 'default' : 'secondary'}
                        style={asset.asset_status === 'AVAILABLE' ? { backgroundColor: '#10b981' } : {}}
                      >
                        {asset.asset_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-8 py-5">
                      <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
