import { StatCards, RecentActivityTable } from "@/components/DashboardWidgets";

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500 relative z-10">
      <StatCards />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
        <div className="col-span-4 lg:col-span-7">
           <RecentActivityTable />
        </div>
      </div>
    </div>
  );
}
