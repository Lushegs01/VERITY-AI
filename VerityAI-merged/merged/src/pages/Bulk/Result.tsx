import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Search, 
  Download, 
  FileText, 
  ExternalLink,
  Loader2,
  ChevronRight,
  TrendingUp,
  FileDown,
  ShieldCheck,
  X,
  Info
} from 'lucide-react';
import { AppShell } from '@/src/components/layout/AppShell';
import { Card } from '@/src/components/ui/Card';
import { Badge } from '@/src/components/ui/Badge';
import { Button } from '@/src/components/ui/Button';
import { cn } from '@/src/lib/utils';
import { toast } from 'react-hot-toast';

interface BulkResultItem {
  id: string;
  filename: string;
  institution: string;
  score: number;
  verdict: 'VERIFIED' | 'SUSPICIOUS' | 'FAKE';
  applicant: string;
}

export function BulkResult() {
  const { jobId } = useParams();
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [totalFiles] = useState(location.state?.fileCount || 12);
  const [processedFiles, setProcessedFiles] = useState<BulkResultItem[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedResult, setSelectedResult] = useState<BulkResultItem | null>(null);

  // Mock SSE for progress
  useEffect(() => {
    if (isComplete) return;

    const interval = setInterval(() => {
      setProcessedFiles(prev => {
        if (prev.length >= totalFiles) {
          clearInterval(interval);
          setIsComplete(true);
          toast.success('Batch verification completed. Report ready.', {
            icon: <CheckCircle2 className="text-status-verified" />
          });
          return prev;
        }

        const nextId = prev.length + 1;
        const institutions = ['University of Lagos', 'Covenant University', 'WAEC Board', 'Ahmadu Bello University', 'Obafemi Awolowo University'];
        const names = ['Adewale Johnson', 'Blessing Okoro', 'Chidi Okafor', 'Damilola Adeyemi', 'Emeka Nwosu'];
        
        const newResult: BulkResultItem = {
          id: `B-${nextId}-${Math.random().toString(36).substring(7).toUpperCase()}`,
          filename: `Credential_${nextId}_${Math.random().toString(36).substring(2, 6)}.pdf`,
          applicant: names[Math.floor(Math.random() * names.length)],
          institution: institutions[Math.floor(Math.random() * institutions.length)],
          score: Math.floor(Math.random() * 80) + 20,
          verdict: 'VERIFIED'
        };

        if (newResult.score < 40) newResult.verdict = 'FAKE';
        else if (newResult.score < 70) newResult.verdict = 'SUSPICIOUS';
        else newResult.verdict = 'VERIFIED';

        setProgress(Math.round(((prev.length + 1) / totalFiles) * 100));
        return [newResult, ...prev];
      });
    }, 800); // 800ms as requested

    return () => clearInterval(interval);
  }, [totalFiles, isComplete]);

  const stats = {
    verified: processedFiles.filter(f => f.verdict === 'VERIFIED').length,
    suspicious: processedFiles.filter(f => f.verdict === 'SUSPICIOUS').length,
    fake: processedFiles.filter(f => f.verdict === 'FAKE').length,
  };

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center text-accent-cyan shadow-lg shadow-accent-cyan/5">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono font-bold text-ink-muted uppercase tracking-[0.2em]">Batch Processing</span>
                <Badge variant={isComplete ? 'verified' : 'suspicious'} className="py-0 px-2 text-[8px]">
                  {isComplete ? 'Analysis Completed' : 'Live Analysis'}
                </Badge>
              </div>
              <h1 className="text-3xl font-display font-black tracking-tight uppercase">Job ID: {jobId}</h1>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={() => toast.success('Preparing Excel report...')}>
              <FileDown className="w-4 h-4 text-primary" />
              Excel Report
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.success('Preparing PDF summary...')}>
              <FileText className="w-4 h-4 text-primary" />
              PDF Summary
            </Button>
          </div>
        </div>

        {/* Live Progress Section */}
        <Card className="p-8 relative overflow-hidden">
          {!isComplete && (
            <div className="absolute top-0 left-0 w-full h-1 bg-surface-base">
              <motion.div 
                className="h-full bg-accent-cyan shadow-[0_0_15px_rgba(8,145,178,0.4)]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
          )}
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-1">
              <div className="text-[10px] font-mono text-ink-muted uppercase tracking-widest flex items-center gap-2">
                <TrendingUp className="w-3 h-3" /> Job Progress
              </div>
              <div className="text-2xl font-mono font-black text-ink-primary">
                {processedFiles.length} / {totalFiles}
                <span className="text-xs font-bold text-ink-muted ml-2">({progress}%)</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] font-mono text-ink-muted uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3 text-status-verified" /> Verified
              </div>
              <div className="text-2xl font-mono font-black text-status-verified">{stats.verified}</div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] font-mono text-ink-muted uppercase tracking-widest flex items-center gap-2">
                <AlertTriangle className="w-3 h-3 text-status-suspicious" /> Suspicious
              </div>
              <div className="text-2xl font-mono font-black text-status-suspicious">{stats.suspicious}</div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] font-mono text-ink-muted uppercase tracking-widest flex items-center gap-2">
                <XCircle className="w-3 h-3 text-status-fake" /> Fake
              </div>
              <div className="text-2xl font-mono font-black text-status-fake">{stats.fake}</div>
            </div>
          </div>
        </Card>

        {/* Results Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-surface-border">
                  <th className="px-6 py-4 text-[10px] font-mono font-bold text-ink-muted uppercase tracking-widest">#</th>
                  <th className="px-6 py-4 text-[10px] font-mono font-bold text-ink-muted uppercase tracking-widest">Filename</th>
                  <th className="px-6 py-4 text-[10px] font-mono font-bold text-ink-muted uppercase tracking-widest">Institution</th>
                  <th className="px-6 py-4 text-[10px] font-mono font-bold text-ink-muted uppercase tracking-widest text-center">Score</th>
                  <th className="px-6 py-4 text-[10px] font-mono font-bold text-ink-muted uppercase tracking-widest">Verdict</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout" initial={false}>
                  {processedFiles.map((file, i) => (
                    <motion.tr 
                      key={file.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={() => setSelectedResult(file)}
                      className="border-b border-surface-border/50 hover:bg-surface-elevated/30 transition-colors last:border-0 group cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <div className="text-xs font-mono font-bold text-ink-muted">{totalFiles - i}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border",
                            file.verdict === 'VERIFIED' ? "bg-status-verified-bg text-status-verified border-status-verified/20" :
                            file.verdict === 'FAKE' ? "bg-status-fake-bg text-status-fake border-status-fake/20" :
                            "bg-status-suspicious-bg text-status-suspicious border-status-suspicious/20"
                          )}>
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="text-sm font-bold text-ink-primary truncate max-w-[200px]">{file.filename}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs font-bold text-ink-secondary">{file.institution}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className={cn(
                          "font-mono text-sm font-black",
                          file.score > 70 ? "text-status-verified" : file.score > 40 ? "text-status-suspicious" : "text-status-fake"
                        )}>
                          {file.score}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={file.verdict.toLowerCase() as any}>{file.verdict}</Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div 
                          className="px-4 py-2 rounded-lg bg-surface-elevated border border-surface-border text-[9px] font-mono font-bold text-ink-muted group-hover:text-primary group-hover:border-primary transition-all uppercase tracking-widest flex items-center gap-2 w-fit ml-auto"
                        >
                          Details <ChevronRight className="w-3 h-3" />
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {!isComplete && (
                  <tr className="border-b border-surface-border/50">
                    <td colSpan={6} className="px-6 py-12">
                      <div className="flex flex-col items-center gap-4 text-ink-muted italic text-xs animate-pulse">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        <span className="font-mono font-bold tracking-widest uppercase">Processing next record in batch...</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Result Detail Modal */}
      <AnimatePresence>
        {selectedResult && (
          <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedResult(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-surface-card border border-surface-border rounded-3xl p-8 shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center border shadow-lg",
                    selectedResult.verdict === 'VERIFIED' ? "bg-status-verified-bg text-status-verified border-status-verified/20" :
                    selectedResult.verdict === 'FAKE' ? "bg-status-fake-bg text-status-fake border-status-fake/20" :
                    "bg-status-suspicious-bg text-status-suspicious border-status-suspicious/20"
                  )}>
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-black tracking-tight uppercase">{selectedResult.verdict} VERDICT</h2>
                    <p className="text-ink-secondary text-xs font-medium font-mono">REF: {selectedResult.id}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedResult(null)} className="p-2 rounded-full hover:bg-surface-elevated transition-colors">
                  <X className="w-6 h-6 text-ink-muted" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono font-bold text-ink-muted uppercase tracking-widest">Applicant</div>
                    <div className="text-sm font-bold text-ink-primary">{selectedResult.applicant}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono font-bold text-ink-muted uppercase tracking-widest">Institution</div>
                    <div className="text-sm font-bold text-ink-primary">{selectedResult.institution}</div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-surface-elevated/50 border border-surface-border">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm font-bold uppercase tracking-tight">Trust Indicator</div>
                    <div className={cn(
                      "text-2xl font-mono font-black",
                      selectedResult.score > 70 ? "text-status-verified" : selectedResult.score > 40 ? "text-status-suspicious" : "text-status-fake"
                    )}>
                      {selectedResult.score}%
                    </div>
                  </div>
                  <div className="w-full h-2 bg-surface-base rounded-full overflow-hidden">
                    <motion.div 
                      className={cn(
                        "h-full rounded-full",
                        selectedResult.score > 70 ? "bg-status-verified" : selectedResult.score > 40 ? "bg-status-suspicious" : "bg-status-fake"
                      )}
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedResult.score}%` }}
                      transition={{ delay: 0.2, duration: 1 }}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                   <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <Info className="w-4 h-4 text-primary mt-0.5" />
                    <p className="text-xs text-ink-secondary leading-relaxed">
                      Verification against {selectedResult.institution} database successfully matched biometric 
                      metadata and cryptographic seals. Analysis confirms 0.00% anomaly detected in layout density.
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <Link 
                    to={`/verify/${selectedResult.id}/result`}
                    className="flex-1 py-4 rounded-xl bg-primary text-white font-bold text-center hover:bg-primary-light transition-all shadow-xl shadow-primary/20"
                  >
                    View Full Report
                  </Link>
                  <Button variant="outline" className="flex-1" onClick={() => toast.success('Downloading report...')}>
                    <Download className="w-5 h-5" />
                    PDF
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
