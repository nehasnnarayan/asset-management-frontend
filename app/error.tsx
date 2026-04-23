'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen charity-bg flex flex-col items-center justify-center p-4">
      <div className="bg-[#1a1625] border border-white/10 p-12 rounded-[2rem] shadow-3xl max-w-lg w-full text-center space-y-8 animate-in zoom-in-95 duration-500">
        <div className="flex justify-center">
          <div className="p-6 bg-destructive/10 rounded-full text-destructive shadow-[0_0_20px_rgba(220,38,38,0.2)]">
            <AlertCircle className="h-16 w-16" />
          </div>
        </div>
        
        <div className="space-y-3">
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">System Exception</h1>
          <p className="text-[#94a3b8] font-medium">
            Something went wrong with the interface rendering. The system has intercepted a critical failure to prevent data loss.
          </p>
        </div>

        <div className="p-4 bg-black/40 rounded-xl border border-white/5">
          <p className="text-[10px] font-bold text-destructive uppercase tracking-widest mb-1">Diagnostic Detail</p>
          <p className="text-xs font-mono text-white/50 truncate">
            {error.message || "Unknown Runtime Error"}
          </p>
        </div>
        
        <div className="flex gap-4 pt-4">
          <Button 
            onClick={() => window.location.href = '/'}
            variant="ghost" 
            className="flex-1 h-14 rounded-xl text-white font-bold hover:bg-white/5"
          >
            Go Home
          </Button>
          <Button 
            onClick={reset}
            className="flex-[2] h-14 rounded-xl bg-primary hover:bg-primary/90 text-black font-bold shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <RotateCcw className="h-5 w-5" />
            Try Recovery
          </Button>
        </div>
      </div>
    </div>
  );
}
