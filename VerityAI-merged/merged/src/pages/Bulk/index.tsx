import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Layers, 
  Upload, 
  FileText, 
  X, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  Download,
  Search,
  ArrowRight,
  ShieldCheck,
  Wallet,
  AlertTriangle
} from 'lucide-react';
import { AppShell } from '@/src/components/layout/AppShell';
import { Card } from '@/src/components/ui/Card';
import { Badge } from '@/src/components/ui/Badge';
import { Button } from '@/src/components/ui/Button';
import { DropZone } from '@/src/components/upload/DropZone';
import { cn } from '@/src/lib/utils';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useWalletStore } from '@/src/store/walletStore';

interface QueuedFile {
  id: string;
  file: File;
  type: string;
}

export function Bulk() {
  const [queuedFiles, setQueuedFiles] = useState<QueuedFile[]>([]);
  const [isInitializing, setIsInitializing] = useState(false);
  const { balance, deductFunds } = useWalletStore();
  const navigate = useNavigate();

  const handleFileDrop = (file: File | null) => {
    if (!file) return;

    const newFile: QueuedFile = {
      id: Math.random().toString(36).substring(2, 9),
      file: file,
      type: file.type || 'application/pdf'
    };
    
    setQueuedFiles(prev => [...prev, newFile]);
    toast.success('Document added to batch');
  };

  const removeFile = (id: string) => {
    setQueuedFiles(prev => prev.filter(f => f.id !== id));
  };

  const costPerUnit = 500; // ₦500
  const totalCost = queuedFiles.length * costPerUnit;
  const hasInsufficientFunds = balance < totalCost;

  const handleStartAnalysis = async () => {
    if (queuedFiles.length === 0) return;
    if (hasInsufficientFunds) {
      toast.error('Insufficient wallet balance to process this batch');
      return;
    }

    setIsInitializing(true);
    toast.loading('Initializing batch forensics...', { id: 'bulk-init' });
    
    // Deduct funds
    deductFunds(totalCost);

    // Simulate API call
    await new Promise(r => setTimeout(r, 2000));
    
    toast.success(`${queuedFiles.length} certificates queued for analysis`, { id: 'bulk-init' });
    
    const jobId = `JOB-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    navigate(`/bulk/${jobId}`, { state: { fileCount: queuedFiles.length } });
  };

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex p-2 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan mb-4">
              <Layers className="w-6 h-6" />
            </div>
            <h1 className="text-4xl font-display font-black tracking-tight uppercase">Batch Forensic Analysis</h1>
            <p className="text-ink-secondary font-medium mt-2">Upload up to 50 credentials for simultaneous institutional verification.</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-8">
            {/* Upload Area */}
            <Card className="p-8 border-dashed border-2">
              <DropZone 
                onFileSelect={handleFileDrop} 
                accept={{ 'image/jpeg': ['.jpg'], 'image/png': ['.png'], 'application/pdf': ['.pdf'] }}
              />
            </Card>

            {/* File List Table */}
            {queuedFiles.length > 0 && (
              <Card className="overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
                <div className="p-6 border-b border-surface-border flex items-center justify-between bg-surface-elevated/20">
                  <h3 className="text-sm font-mono font-black text-ink-muted uppercase tracking-widest">Documents in Queue ({queuedFiles.length})</h3>
                  <button 
                    onClick={() => setQueuedFiles([])}
                    className="text-[10px] font-mono font-bold text-status-fake hover:underline uppercase"
                  >
                    Clear All
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-surface-border">
                        <th className="px-6 py-4 text-[10px] font-mono font-bold text-ink-muted uppercase tracking-widest">Name</th>
                        <th className="px-6 py-4 text-[10px] font-mono font-bold text-ink-muted uppercase tracking-widest">Size</th>
                        <th className="px-6 py-4 text-[10px] font-mono font-bold text-ink-muted uppercase tracking-widest text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence mode="popLayout">
                        {queuedFiles.map((item) => (
                          <motion.tr 
                            key={item.id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="border-b border-surface-border/50 hover:bg-surface-elevated/30 transition-colors last:border-0"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-surface-elevated border border-surface-border flex items-center justify-center text-ink-muted">
                                  <FileText className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-bold text-ink-primary truncate max-w-[300px]">{item.file.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-xs font-mono text-ink-muted">{(item.file.size / 1024).toFixed(1)} KB</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button 
                                onClick={() => removeFile(item.id)}
                                className="p-2 text-ink-muted hover:text-status-fake transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>

          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-28">
            <Card className="p-8 space-y-8">
              <div>
                <h3 className="text-lg font-display font-bold uppercase tracking-tight mb-2">Cost Analysis</h3>
                <p className="text-xs text-ink-muted font-medium italic">Standard pricing ₦500 per document validation.</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-ink-secondary">Unit Multiplier</span>
                  <span className="font-mono font-bold text-ink-primary">× {queuedFiles.length}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-ink-secondary">Base Fee</span>
                  <span className="font-mono font-bold text-ink-primary">₦{costPerUnit.toLocaleString()}</span>
                </div>
                <div className="pt-4 border-t border-surface-border flex justify-between items-center">
                  <span className="text-sm font-bold uppercase tracking-wider">Total Payable</span>
                  <span className="text-2xl font-mono font-black text-primary">₦{totalCost.toLocaleString()}</span>
                </div>
              </div>

              {hasInsufficientFunds && queuedFiles.length > 0 && (
                <div className="p-4 rounded-xl bg-status-fake-bg border border-status-fake/20 flex gap-3 text-status-fake">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <div className="text-[10px] font-bold uppercase leading-tight">
                    Insufficient Funds. You need ₦{(totalCost - balance).toLocaleString()} more.
                    <Link to="/wallet" className="block mt-1 underline hover:text-primary transition-all">Top up Wallet</Link>
                  </div>
                </div>
              )}

              <Button 
                disabled={queuedFiles.length === 0 || hasInsufficientFunds}
                loading={isInitializing}
                onClick={handleStartAnalysis}
                className="w-full"
              >
                <Search className="w-5 h-5" />
                Initialize Batch
              </Button>

              <div className="pt-4 space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-ink-muted">
                  <ShieldCheck className="w-3 h-3 text-status-verified" />
                  INSTITUTIONAL DIRECT CONNECT
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-ink-muted">
                  <ShieldCheck className="w-3 h-3 text-status-verified" />
                  SQUAD PAYMENT PROTECTED
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-surface-elevated/30 border-dashed">
               <div className="flex items-center gap-3">
                <Wallet className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-[9px] font-mono font-bold text-ink-muted uppercase tracking-widest">Available Balance</div>
                  <div className="text-sm font-mono font-black text-ink-primary">₦{balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

