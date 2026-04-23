"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Laptop, Loader2, CheckCircle2, ShieldAlert, X, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Asset {
  asset_id: number;
  asset_code: string;
  asset_name: string;
  asset_category: string;
  asset_status: string;
  asset_condition: string;
}

interface Assignment {
  assignment_id: number;
  asset_id: number;
  asset: Asset;
  assignment_date: string;
}

export default function MyAssetsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [issueReason, setIssueReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://asset-management-backend-zjco.onrender.com/api";

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const employeeId = localStorage.getItem("employeeId");
      const token = localStorage.getItem("token");
      if (!employeeId || !token) return;

      const res = await fetch(`${apiUrl}/employees/${employeeId}/assignments`, {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });
      
      if (!res.ok) throw new Error("Sync failed.");
      
      const data = await res.json();
      setAssignments(data);
    } catch (err: any) {
      if (!silent) toast.error("Could not load your assigned assets.");
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  const openReportPopup = (asset: Asset) => {
    setSelectedAsset(asset);
    setIssueReason("");
    setShowPopup(true);
  };

  const submitReport = async () => {
    if (!selectedAsset || !issueReason.trim()) {
      toast.error("Please enter a reason for the report.");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/assets/${selectedAsset.asset_id}/report-issue`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ description: issueReason.trim() }),
      });

      if (!res.ok) throw new Error("Submission rejected.");

      toast.success("Issue reported successfully!");
      setShowPopup(false);
      
      // Update local state immediately for instant feedback
      setAssignments(prev => prev.map(a => 
        a.asset_id === selectedAsset.asset_id 
          ? { ...a, asset: { ...a.asset, asset_status: 'MAINTENANCE' } } 
          : a
      ));
      
      // Background refresh without showing global loader
      fetchAssignments(true);
    } catch (err: any) {
      toast.error("Error reporting issue. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return "Active";
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-primary/30" />
      </div>
    );
  }

  return (
    <div className="p-12 space-y-12 animate-in fade-in duration-500">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-white tracking-tight">My Assigned Gear</h1>
        <p className="text-[#94a3b8] text-sm font-medium opacity-80">
          Review the equipment issued to you. Report any issues or request maintenance.
        </p>
      </div>

      <div className="mt-16 flex flex-wrap gap-10">
        {assignments.length === 0 ? (
          <div className="w-full bg-[#13111c] border border-white/5 p-20 rounded-[16px] text-center shadow-2xl">
            <p className="text-muted-foreground font-medium">No assets currently assigned to your account.</p>
          </div>
        ) : (
          assignments.map((assignment) => (
            <div 
              key={assignment.assignment_id} 
              style={{ width: '400px', padding: '20px', borderRadius: '16px' }}
              className="bg-[#13111c] border border-white/5 shadow-2xl space-y-12 flex flex-col justify-between transition-all hover:border-white/10"
            >
              <div>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      {assignment.asset?.asset_name || "Enterprise Device"}
                    </h3>
                    <p className="text-xs font-semibold text-[#64748b] tracking-widest uppercase">
                      TAG: {assignment.asset?.asset_code || "---"}
                    </p>
                  </div>
                  <div className="text-[#475569]">
                    <Laptop className="h-6 w-6" />
                  </div>
                </div>

                <div className="mt-16 space-y-4">
                  <div className="flex text-[15px] font-medium">
                    <span className="text-[#94a3b8] w-48">TYPE:</span>
                    <span className="text-[#cbd5e1] font-bold">{assignment.asset?.asset_category || "HARDWARE"}</span>
                  </div>
                  <div className="flex text-[15px] font-medium">
                    <span className="text-[#94a3b8] w-48">ASSIGNED:</span>
                    <span className="text-[#cbd5e1] font-bold">{formatDate(assignment.assignment_date)}</span>
                  </div>
                </div>

                <div className="mt-10 flex items-center gap-3">
                  <div 
                    className={`inline-flex items-center rounded-full border px-5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                      assignment.asset?.asset_status === 'MAINTENANCE' 
                      ? 'border-amber-500 text-amber-500 bg-amber-500/5'
                      : 'border-[#10b981] text-[#10b981] bg-transparent'
                    }`}
                  >
                    {assignment.asset?.asset_status === 'MAINTENANCE' ? 'UNDER MAINTENANCE' : (assignment.asset?.asset_condition ? `${assignment.asset.asset_condition} CONDITION` : 'EXCELLENT CONDITION')}
                  </div>
                  {assignment.asset?.asset_status === 'MAINTENANCE' && (
                    <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                  )}
                </div>
              </div>

              <div className="pt-4">
                <button 
                  disabled={assignment.asset?.asset_status === 'MAINTENANCE' || isSubmitting}
                  onClick={() => assignment.asset && openReportPopup(assignment.asset)}
                  className={`w-full border-0 rounded-xl h-14 flex items-center justify-center gap-3 transition-all active:scale-[0.98] cursor-pointer font-bold text-sm uppercase tracking-wide shadow-xl ${
                    assignment.asset?.asset_status === 'MAINTENANCE'
                    ? 'bg-amber-500/10 text-amber-500 opacity-50 cursor-not-allowed'
                    : 'bg-[#1c1a27] hover:bg-[#252233] text-[#f59e0b] hover:shadow-amber-500/5'
                  }`}
                >
                  <AlertTriangle className="h-5 w-5" />
                  {assignment.asset?.asset_status === 'MAINTENANCE' ? 'UNDER MAINTENANCE' : 'REPORT ISSUE'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* POPUP MODAL */}
      {showPopup && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300 p-4">
          <div className="bg-[#1a1625] border border-white/10 w-full max-w-lg rounded-[24px] shadow-3xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-amber-500/10 p-8 border-b border-white/5 flex justify-between items-center">
              <div className="space-y-1">
                <h2 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-tighter">
                  <ShieldAlert className="h-7 w-7 text-amber-500" />
                  Issue Report
                </h2>
                <p className="text-[#64748b] text-xs font-bold uppercase tracking-widest">Asset: {selectedAsset?.asset_name}</p>
              </div>
              <button onClick={() => setShowPopup(false)} className="text-[#475569] hover:text-white transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-[#475569] uppercase tracking-widest ml-1">Reason for Maintenance</label>
                <textarea
                  autoFocus
                  className="w-full h-48 bg-black/40 border border-white/5 rounded-2xl p-6 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all placeholder:text-white/10 font-medium"
                  placeholder="Describe the technical fault in detail..."
                  value={issueReason}
                  onChange={(e) => setIssueReason(e.target.value)}
                />
              </div>
              
              <div className="flex gap-4 pt-2">
                <button 
                  onClick={() => setShowPopup(false)}
                  className="flex-1 h-14 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-widest transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={submitReport}
                  disabled={isSubmitting}
                  className="flex-[2] h-14 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-black uppercase tracking-widest shadow-2xl shadow-amber-500/20 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? "Processing..." : "Commit Report"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
