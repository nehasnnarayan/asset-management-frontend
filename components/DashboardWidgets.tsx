"use client";

import { LayoutGrid, Users, Loader2, Package, CheckCircle2, DollarSign, CreditCard, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function StatCards() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://asset-management-backend-zjco.onrender.com/api";
    fetch(`${apiUrl}/dashboard/summary`)
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch dashboard stats", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="h-32 animate-pulse bg-[#13111c] border-white/5 rounded-2xl">
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Assets - Purple Card */}
      <Card 
        onClick={() => router.push("/assets")}
        className="bg-primary border-0 shadow-xl cursor-pointer hover:scale-[1.02] transition-transform rounded-[1.5rem] overflow-hidden group"
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white/90">Total Assets</CardTitle>
          <div className="p-1.5 bg-white/10 rounded-lg">
            <DollarSign className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white mt-1">{stats?.total_assets || 0}</div>
          <div className="flex items-center gap-2 mt-6">
            <Badge className="rounded-md px-2 py-0 bg-white/20 hover:bg-white/20 text-[10px] font-bold text-white border-0">
              LIVE
            </Badge>
            <span className="text-[10px] text-white/80 font-medium tracking-tight">Real-time count</span>
          </div>
        </CardContent>
      </Card>

      {/* Assigned Assets */}
      <Card 
        onClick={() => router.push("/assets?status=ASSIGNED")}
        className="bg-[#0c0a0f] border border-teal-500/20 shadow-xl cursor-pointer hover:bg-white/5 transition-all rounded-[1.5rem] overflow-hidden group"
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Assigned Assets</CardTitle>
          <div className="p-1.5 bg-white/5 rounded-lg border border-white/5">
            <Users className="h-4 w-4 text-muted-foreground group-hover:text-white transition-colors" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white mt-1">{stats?.assigned_assets || 0}</div>
          <div className="flex items-center gap-2 mt-6">
            <Badge variant="outline" className="rounded-md px-2 py-0 border-0 bg-teal-500/10 text-teal-500 text-[10px] font-bold">
              ACTIVE
            </Badge>
            <span className="text-[10px] text-muted-foreground font-medium tracking-tight">In use</span>
          </div>
        </CardContent>
      </Card>

      {/* Available Assets */}
      <Card 
        onClick={() => router.push("/assets?status=AVAILABLE")}
        className="bg-[#0c0a0f] border border-purple-500/20 shadow-xl cursor-pointer hover:bg-white/5 transition-all rounded-[1.5rem] overflow-hidden group"
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Available Assets</CardTitle>
          <div className="p-1.5 bg-white/5 rounded-lg border border-white/5">
            <CreditCard className="h-4 w-4 text-muted-foreground group-hover:text-white transition-colors" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white mt-1">{stats?.available_assets || 0}</div>
          <div className="flex items-center gap-2 mt-6">
            <Badge variant="outline" className="rounded-md px-2 py-0 border-0 bg-purple-500/10 text-purple-500 text-[10px] font-bold">
              READY
            </Badge>
            <span className="text-[10px] text-muted-foreground font-medium tracking-tight">Available to assign</span>
          </div>
        </CardContent>
      </Card>

      {/* Directory */}
      <Card 
        onClick={() => router.push("/employees")}
        className="bg-[#0c0a0f] border border-orange-500/20 shadow-xl cursor-pointer hover:bg-white/5 transition-all rounded-[1.5rem] overflow-hidden group"
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Directory</CardTitle>
          <div className="p-1.5 bg-white/5 rounded-lg border border-white/5">
            <Users className="h-4 w-4 text-muted-foreground group-hover:text-white transition-colors" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white mt-1">{stats?.total_employees || 0}</div>
          <div className="flex items-center gap-2 mt-6">
            <Badge variant="outline" className="rounded-md px-2 py-0 border-0 bg-orange-500/10 text-orange-500 text-[10px] font-bold">
              STAFF
            </Badge>
            <span className="text-[10px] text-muted-foreground font-medium tracking-tight">Manage members</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function RecentActivityTable() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://asset-management-backend-zjco.onrender.com/api";
    fetch(`${apiUrl}/dashboard/recent-activities`)
      .then(res => res.json())
      .then(data => {
        setActivities(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch recent activities", err);
        setLoading(false);
      });
  }, []);

  return (
    <Card className="bg-[#0c0a0f]/40 border-0 shadow-2xl rounded-[1.5rem] overflow-hidden mt-8">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold text-white">Recent Assignments</CardTitle>
        <CardDescription className="text-sm text-muted-foreground font-medium">
          Tracking the latest 5 asset provisions across the organization.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-2 text-muted-foreground/30">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="font-medium text-muted-foreground text-sm pl-8 py-4">Asset ID</TableHead>
                <TableHead className="font-medium text-muted-foreground text-sm py-4">Asset Name</TableHead>
                <TableHead className="font-medium text-muted-foreground text-sm py-4">Employee</TableHead>
                <TableHead className="text-right font-medium text-muted-foreground text-sm pr-8 py-4">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-48 text-center text-muted-foreground font-medium">
                    No recent activities recorded.
                  </TableCell>
                </TableRow>
              ) : (
                activities.map((assignment, index) => (
                  <TableRow key={index} className="border-white/5 hover:bg-white/5 transition-colors group">
                    <TableCell className="font-mono font-bold text-muted-foreground/80 text-sm pl-8 py-4">{assignment.asset_code || 'A-1029'}</TableCell>
                    <TableCell className="font-bold text-white text-sm py-4">{assignment.asset}</TableCell>
                    <TableCell className="font-bold text-white text-sm py-4">{assignment.employee}</TableCell>
                    <TableCell className="text-right pr-8 py-4">
                      <Badge 
                        variant="outline"
                        className={cn(
                          "rounded-full px-4 py-0.5 border-0 text-[10px] font-bold transition-all",
                          (assignment.status === 'Active' || assignment.status === 'ASSIGNED') 
                            ? 'bg-primary text-white shadow-lg shadow-purple-900/20' 
                            : 'bg-transparent border border-white/20 text-muted-foreground'
                        )}
                      >
                        {assignment.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
