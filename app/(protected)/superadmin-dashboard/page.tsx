import { ShieldAlert, UserPlus, Users, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/SharedUtility";
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

export default function SuperadminDashboardPage() {
  // Mock data for the static UI
  const mockAdmins = [
    { id: "ADMIN_001", name: "Sarah Collins", email: "sarah@hoperise.org", status: "Active" },
    { id: "ADMIN_002", name: "David Chen", email: "david.c@hoperise.org", status: "Active" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500 relative z-10">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 lg:col-span-7 shadow-sm border-0 ring-1 ring-border/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="font-bold tracking-tight text-xl">Active Administrators</CardTitle>
              <CardDescription className="font-medium mt-1">
                The personnel authorized to manage assets and standard employees.
              </CardDescription>
            </div>
            <Button className="font-bold rounded-full px-6">
              <UserPlus className="mr-2 h-4 w-4" />
              Provision Admin
            </Button>
          </CardHeader>
          <CardContent className="mt-4">
            <Table>
              <TableHeader>
                <TableRow className="border-border/10">
                  <TableHead className="w-[120px] font-bold text-foreground">Admin ID</TableHead>
                  <TableHead className="font-bold text-foreground">Name</TableHead>
                  <TableHead className="font-bold text-foreground">Email</TableHead>
                  <TableHead className="font-bold text-foreground text-center">Status</TableHead>
                  <TableHead className="text-right font-bold text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAdmins.map((admin) => (
                  <TableRow key={admin.id} className="border-border/10 font-medium">
                    <TableCell className="font-bold">{admin.id}</TableCell>
                    <TableCell>{admin.name}</TableCell>
                    <TableCell className="text-muted-foreground">{admin.email}</TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-0 rounded-full font-bold">
                        {admin.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors rounded-full">
                          <Trash2 className="h-4 w-4" />
                       </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
