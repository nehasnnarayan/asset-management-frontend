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
      <Card className="shadow-sm border-0 ring-1 ring-border/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold tracking-tight">Total Assets</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight">1,245</div>
          <p className="text-xs text-muted-foreground mt-1 font-medium">+20 from last month</p>
        </CardContent>
      </Card>
      <Card className="shadow-sm border-0 ring-1 ring-border/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold tracking-tight">Assigned Assets</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight">890</div>
          <p className="text-xs text-muted-foreground mt-1 font-medium">+54 assigned this week</p>
        </CardContent>
      </Card>
      <Card className="shadow-sm border-0 ring-1 ring-border/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold tracking-tight">Available Assets</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight">230</div>
          <p className="text-xs text-muted-foreground mt-1 font-medium">-12 from last week</p>
        </CardContent>
      </Card>
      <Card className="shadow-sm border-0 ring-1 ring-border/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold tracking-tight">Maintenance</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight">125</div>
          <p className="text-xs text-muted-foreground mt-1 font-medium">+2 currently repairing</p>
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
    <Card className="col-span-3 shadow-sm border-0 ring-1 ring-border/10">
      <CardHeader>
        <CardTitle className="font-bold tracking-tight">Recent Assignments</CardTitle>
        <CardDescription className="font-medium">
          Tracking the latest 5 asset provisions across the organization.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-border/10">
              <TableHead className="w-[100px] font-bold text-foreground">Asset ID</TableHead>
              <TableHead className="font-bold text-foreground">Asset Name</TableHead>
              <TableHead className="font-bold text-foreground">Employee</TableHead>
              <TableHead className="text-right font-bold text-foreground">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentAssignments.map((assignment) => (
              <TableRow key={assignment.id} className="border-border/10 font-medium">
                <TableCell>{assignment.id}</TableCell>
                <TableCell>{assignment.asset}</TableCell>
                <TableCell>{assignment.employee}</TableCell>
                <TableCell className="text-right">
                  <Badge className="rounded-full shadow-none" variant={assignment.status === "Active" ? "default" : assignment.status === "Returned" ? "outline" : "secondary"}>
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
