"use client";

import { Activity, CreditCard, DollarSign, Users, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    fetch(`${apiUrl}/api/dashboard/summary`)
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
          <Card key={i} className="h-32 flex items-center justify-center animate-pulse bg-muted/20 border-0">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground/30" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card 
        onClick={() => router.push("/assets")}
        className="shadow-lg border-0 bg-gradient-to-br from-purple-700 to-fuchsia-600 text-white overflow-hidden relative cursor-pointer hover:scale-[1.02] transition-transform"
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white/80">Total Assets</CardTitle>
          <div className="p-1.5 bg-white/10 rounded-md">
            <DollarSign className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold mt-2">{stats?.total_assets || 0}</div>
          <div className="flex items-center gap-2 mt-4">
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">LIVE</span>
            <span className="text-xs text-white/70 font-medium">Real-time count</span>
          </div>
        </CardContent>
      </Card>
      <Card 
        onClick={() => router.push("/assets")}
        className="shadow-lg border-[0.5px] border-teal-500/20 bg-gradient-to-br from-background to-teal-950/30 text-card-foreground cursor-pointer hover:bg-teal-500/5 transition-colors"
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Assigned Assets</CardTitle>
          <div className="p-1.5 bg-secondary rounded-md border border-border/50">
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold mt-2 text-foreground">{stats?.assigned_assets || 0}</div>
          <div className="flex items-center gap-2 mt-4">
            <span className="text-xs bg-teal-500/20 text-teal-500 px-2 py-0.5 rounded-full">ACTIVE</span>
            <span className="text-xs text-muted-foreground font-medium">In use</span>
          </div>
        </CardContent>
      </Card>
      <Card 
        onClick={() => router.push("/assets")}
        className="shadow-lg border-[0.5px] border-purple-500/20 bg-gradient-to-br from-background to-purple-950/20 text-card-foreground cursor-pointer hover:bg-purple-500/5 transition-colors"
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Available Assets</CardTitle>
          <div className="p-1.5 bg-secondary rounded-md border border-border/50">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold mt-2 text-foreground">{stats?.available_assets || 0}</div>
          <div className="flex items-center gap-2 mt-4">
            <span className="text-xs bg-purple-500/20 text-purple-500 px-2 py-0.5 rounded-full">READY</span>
            <span className="text-xs text-muted-foreground font-medium">Available to assign</span>
          </div>
        </CardContent>
      </Card>
      <Card 
        onClick={() => router.push("/employees")}
        className="shadow-lg border-[0.5px] border-orange-500/20 bg-gradient-to-br from-background to-orange-950/20 text-card-foreground cursor-pointer hover:bg-orange-500/5 transition-colors"
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Directory</CardTitle>
          <div className="p-1.5 bg-secondary rounded-md border border-border/50">
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold mt-2 text-foreground">{stats?.total_employees || stats?.maintenance_assets || 0}</div>
          <div className="flex items-center gap-2 mt-4">
            <span className="text-xs bg-orange-500/20 text-orange-500 px-2 py-0.5 rounded-full">STAFF</span>
            <span className="text-xs text-muted-foreground font-medium">Manage members</span>
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
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    fetch(`${apiUrl}/api/dashboard/recent-activities`)
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
    <Card className="col-span-3 shadow-lg border-[0.5px] border-border/50 bg-background/50 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="font-semibold tracking-tight text-foreground">Recent Assignments</CardTitle>
        <CardDescription className="text-muted-foreground">
          Tracking the latest 5 asset provisions across the organization.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-48 flex flex-col items-center justify-center gap-2 text-muted-foreground/50">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="text-sm font-medium">Fetching recent assignments...</span>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="w-[100px] font-medium text-muted-foreground">Asset ID</TableHead>
                <TableHead className="font-medium text-muted-foreground">Asset Name</TableHead>
                <TableHead className="font-medium text-muted-foreground">Employee</TableHead>
                <TableHead className="text-right font-medium text-muted-foreground">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    No recent assignments found.
                  </TableCell>
                </TableRow>
              ) : (
                activities.map((assignment, index) => (
                  <TableRow key={index} className="border-border/10 font-medium text-foreground hover:bg-muted/50">
                    <TableCell>{assignment.id}</TableCell>
                    <TableCell>{assignment.asset}</TableCell>
                    <TableCell>{assignment.employee}</TableCell>
                    <TableCell className="text-right">
                      <Badge className="rounded-md px-2 py-1 shadow-none" variant={assignment.status === "Active" || assignment.status === "ASSIGNED" ? "default" : assignment.status === "Returned" ? "outline" : "secondary"}>
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
