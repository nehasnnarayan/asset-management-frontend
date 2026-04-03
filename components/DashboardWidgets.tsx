import { Activity, CreditCard, DollarSign, Users } from "lucide-react";

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
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-700 to-fuchsia-600 text-white overflow-hidden relative">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white/80">Total Assets</CardTitle>
          <div className="p-1.5 bg-white/10 rounded-md">
            <DollarSign className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold mt-2">1,245</div>
          <div className="flex items-center gap-2 mt-4">
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">+20</span>
            <span className="text-xs text-white/70 font-medium">from last month</span>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-lg border-[0.5px] border-teal-500/20 bg-gradient-to-br from-background to-teal-950/30 text-card-foreground">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Assigned Assets</CardTitle>
          <div className="p-1.5 bg-secondary rounded-md border border-border/50">
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold mt-2 text-foreground">890</div>
          <div className="flex items-center gap-2 mt-4">
            <span className="text-xs bg-secondary/80 text-foreground px-2 py-0.5 rounded-full">+54</span>
            <span className="text-xs text-muted-foreground font-medium">this week</span>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-lg border-[0.5px] border-purple-500/20 bg-gradient-to-br from-background to-purple-950/20 text-card-foreground">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Available Assets</CardTitle>
          <div className="p-1.5 bg-secondary rounded-md border border-border/50">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold mt-2 text-foreground">230</div>
          <div className="flex items-center gap-2 mt-4">
            <span className="text-xs bg-secondary/80 text-foreground px-2 py-0.5 rounded-full">-12</span>
            <span className="text-xs text-muted-foreground font-medium">from last week</span>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-lg border-[0.5px] border-orange-500/20 bg-gradient-to-br from-background to-orange-950/20 text-card-foreground">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Maintenance</CardTitle>
          <div className="p-1.5 bg-secondary rounded-md border border-border/50">
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold mt-2 text-foreground">125</div>
          <div className="flex items-center gap-2 mt-4">
            <span className="text-xs bg-secondary/80 text-foreground px-2 py-0.5 rounded-full">+2</span>
            <span className="text-xs text-muted-foreground font-medium">currently repairing</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const recentAssignments = [
  { id: "A-1029", asset: "MacBook Pro 16", employee: "John Doe", date: "2026-03-05", status: "Active" },
  { id: "A-1030", asset: "Dell UltraSharp 27", employee: "Jane Smith", date: "2026-03-04", status: "Active" },
  { id: "A-1031", asset: "ErgoChair Pro", employee: "Alice Webb", date: "2026-03-04", status: "Pending" },
  { id: "A-1032", asset: "Lenovo ThinkPad X1", employee: "Bob Martin", date: "2026-03-02", status: "Active" },
  { id: "A-1033", asset: "Apple Magic Keyboard", employee: "Charlie Day", date: "2026-03-01", status: "Returned" },
];

export function RecentActivityTable() {
  return (
    <Card className="col-span-3 shadow-lg border-[0.5px] border-border/50 bg-background/50 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="font-semibold tracking-tight text-foreground">Recent Assignments</CardTitle>
        <CardDescription className="text-muted-foreground">
          Tracking the latest 5 asset provisions across the organization.
        </CardDescription>
      </CardHeader>
      <CardContent>
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
            {recentAssignments.map((assignment) => (
              <TableRow key={assignment.id} className="border-border/10 font-medium text-foreground hover:bg-muted/50">
                <TableCell>{assignment.id}</TableCell>
                <TableCell>{assignment.asset}</TableCell>
                <TableCell>{assignment.employee}</TableCell>
                <TableCell className="text-right">
                  <Badge className="rounded-md px-2 py-1 shadow-none" variant={assignment.status === "Active" ? "default" : assignment.status === "Returned" ? "outline" : "secondary"}>
                    {assignment.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
