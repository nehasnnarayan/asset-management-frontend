import { PackagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/SharedUtility";

export default function AssetsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight premium-gradient-text">Asset Inventory</h1>
          <p className="text-muted-foreground/80 mt-2 font-medium">
            Manage your high-value hardware and equipment in the digital vault.
          </p>
        </div>
        
        <Button className="h-12 px-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 transition-all active:scale-95">
          <PackagePlus className="mr-2 h-5 w-5" />
          Add New Asset
        </Button>
      </div>

      <div className="mt-10 glass-panel rounded-[2rem] p-8 shadow-2xl border-0 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full"></div>
        <EmptyState 
          title="Archive Empty" 
          description="Your digital vault is currently empty. Start building your company's infrastructure by provisioning your first hardware asset."
          action={
            <Button variant="outline" className="h-12 px-8 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 font-bold transition-all active:scale-95">
              <PackagePlus className="mr-2 h-5 w-5" />
              Provision First Asset
            </Button>
          }
        />
      </div>
    </div>
  );
}
