import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Search, 
  Loader2, 
  ArrowRight, 
  AlertCircle,
  FileText,
  Fingerprint,
  Cpu,
  Database,
  CheckCircle2,
  Layout,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/src/store/authStore';
import { useWalletStore } from '@/src/store/walletStore';
import { trpcMutation } from '@/src/lib/axios';
import { AppShell } from '@/src/components/layout/AppShell';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { DropZone } from '@/src/components/upload/DropZone';
import { cn } from '@/src/lib/utils';
import { toast } from 'react-hot-toast';

const verifySchema = z.object({
  certificateType: z.enum(['WAEC', 'NECO', 'NABTEB', 'BSc', 'HND', 'OND', 'MSc', 'PhD', 'NYSC', 'ICAN', 'other']),
  applicantName: z.string().optional(),
  applicantEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
});

type VerifyFormValues = z.infer<typeof verifySchema>;

export function Verify() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();
  const { balance, deductBalance } = useWalletStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyFormValues>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      certificateType: 'BSc',
    }
  });

  const processingSteps = [
    { icon: Fingerprint, text: 'Uploading certificate…' },
    { icon: Layout, text: 'Reading document structure…' },
    { icon: FileText, text: 'Analyzing visual integrity…' },
    { icon: Cpu, text: 'Running AI forensics…' },
    { icon: ShieldCheck, text: 'Calculating trust score…' }
  ];

  const onSubmit = async (data: VerifyFormValues) => {
    if (!selectedFile) {
      toast.error('Please upload a document to verify');
      return;
    }

    if (balance < 500) {
      toast.error('Insufficient balance. Top up your wallet to continue.', {
        icon: <AlertCircle className="text-status-fake" />,
        duration: 4000,
      });
      return;
    }

    setIsProcessing(true);
    toast.loading('Initializing forensic stream...', { id: 'verify-init' });

    try {
      // Convert file to base64
      const fileData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]); // strip data URL prefix
        };
        reader.onerror = reject;
        reader.readAsDataURL(selectedFile);
      });

      // Animate processing steps while API runs
      const stepInterval = setInterval(() => {
        setActiveStep(prev => Math.min(prev + 1, processingSteps.length - 1));
      }, 1800);

      const result = await trpcMutation('verification.process', {
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileData,
        certificateType: data.certificateType,
        applicantName: data.applicantName || undefined,
      });

      clearInterval(stepInterval);
      setActiveStep(processingSteps.length - 1);
      await new Promise(r => setTimeout(r, 500));

      deductBalance(500);
      toast.success('Analysis complete!', { id: 'verify-init' });
      navigate(\`/verify/\${result.publicId}/result\`, {
        state: { result }
      });
    } catch (err: any) {
      toast.error(err?.response?.data?.error?.message || 'Verification failed. Please try again.', { id: 'verify-init' });
      setIsProcessing(false);
      setActiveStep(0);
    }
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex p-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary mb-2"
          >
            <Search className="w-8 h-8" />
          </motion.div>
          <h1 className="text-3xl md:text-5xl font-display font-black tracking-tight uppercase">Single Verification</h1>
          <p className="text-ink-secondary text-lg max-w-2xl mx-auto font-medium">
            Upload any academic credential for immediate forensic AI analysis. 
            Estimated processing time: <span className="text-primary font-bold">12 seconds</span>.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3 space-y-8">
            <Card className="p-8">
              <div className="mb-8 p-4 rounded-2xl bg-surface-elevated border border-surface-border text-[10px] font-mono text-ink-muted uppercase tracking-[0.2em] flex items-center justify-between">
                <span>Phase 01: File Intake</span>
                <span className="text-primary">Required System Input</span>
              </div>
              <DropZone onFileSelect={setSelectedFile} />
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card className="p-8 h-full flex flex-col">
              <div className="mb-8 p-4 rounded-2xl bg-surface-elevated border border-surface-border text-[10px] font-mono text-ink-muted uppercase tracking-[0.2em] flex items-center justify-between">
                <span>Phase 02: Metadata</span>
                <span className="text-accent-cyan">Contextual Shield</span>
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex-1">
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold text-ink-muted uppercase tracking-widest block ml-1">Credential Type</label>
                  <select
                    {...register('certificateType')}
                    className="w-full bg-surface-base border border-surface-border rounded-xl px-4 py-3 text-ink-primary font-bold focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
                  >
                    <option value="BSc">B.Sc. / Degree</option>
                    <option value="WAEC">WAEC Result</option>
                    <option value="NECO">NECO Result</option>
                    <option value="NYSC">NYSC Certificate</option>
                    <option value="MSc">Master's Degree</option>
                    <option value="PhD">Doctorate (PhD)</option>
                    <option value="ICAN">ICAN Professional</option>
                    <option value="HND">HND / Polytechnic</option>
                    <option value="other">Other Credential</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold text-ink-muted uppercase tracking-widest block ml-1">Applicant Name (Optional)</label>
                  <input
                    {...register('applicantName')}
                    type="text"
                    placeholder="Full Legal Name"
                    className="w-full bg-surface-base border border-surface-border rounded-xl px-4 py-3 text-ink-primary font-medium focus:outline-none focus:border-primary/50 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold text-ink-muted uppercase tracking-widest block ml-1">Applicant Email (Optional)</label>
                  <input
                    {...register('applicantEmail')}
                    type="email"
                    placeholder="name@example.com"
                    className={cn(
                      "w-full bg-surface-base border rounded-xl px-4 py-3 text-ink-primary font-medium focus:outline-none transition-all",
                      errors.applicantEmail ? "border-status-fake" : "border-surface-border focus:border-primary/50"
                    )}
                  />
                  {errors.applicantEmail && <p className="text-status-fake text-[10px] font-mono mt-1">{errors.applicantEmail.message}</p>}
                </div>

                <div className="pt-6 mt-auto">
                  <Button
                    type="submit"
                    disabled={!selectedFile}
                    loading={isProcessing}
                    className="w-full"
                  >
                    Initialize Analysis <ArrowRight className="w-5 h-5" />
                  </Button>
                  <p className="mt-4 text-center text-[10px] font-mono text-ink-muted uppercase tracking-widest">
                    Cost: <span className="text-primary font-bold">₦500.00</span> / verification
                  </p>
                </div>
              </form>
            </Card>
          </div>
        </div>

        {/* Processing Modal Overlay */}
        <AnimatePresence>
          {isProcessing && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-surface-base/90 backdrop-blur-md"
            >
              <div className="fixed inset-0 noise-overlay pointer-events-none opacity-5" />
              <Card className="w-full max-w-lg p-6 sm:p-10 relative overflow-hidden">
                {/* SVG Scanner Ray */}
                <motion.div 
                  className="absolute inset-0 z-[1] pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div 
                    className="absolute left-0 right-0 h-[2px] bg-primary/40 shadow-[0_0_20px_var(--color-primary)]"
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  />
                  <svg className="absolute inset-0 w-full h-full">
                    <defs>
                      <linearGradient id="scanner-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0" />
                        <stop offset="50%" stopColor="var(--color-primary)" stopOpacity="0.05" />
                        <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <motion.rect
                      width="100%"
                      height="100"
                      fill="url(#scanner-grad)"
                      animate={{ y: [-100, 600, -100] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                  </svg>
                </motion.div>

                <div className="absolute top-0 left-0 w-full h-1 bg-surface-elevated z-[10]">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(activeStep + 1) * 20}%` }}
                    className="h-full bg-primary shadow-[0_0_15px_rgba(5,150,105,0.4)]"
                    transition={{ duration: 0.5 }}
                  />
                </div>

                <div className="flex flex-col items-center text-center space-y-8">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-surface-border flex items-center justify-center">
                      <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    </div>
                    <div className="absolute -inset-4 border border-primary/20 rounded-full animate-ping opacity-20" />
                  </div>

                  <div>
                    <h2 className="text-3xl font-display font-black tracking-tight uppercase mb-2">Analyzing Credential</h2>
                    <p className="text-ink-secondary text-sm font-medium">Verity Forensic Engine Node #842 Active</p>
                  </div>

                  <div className="w-full space-y-3 sm:space-y-4">
                    {processingSteps.map((step, i) => (
                      <div 
                        key={i} 
                        className={cn(
                          "flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl border transition-all",
                          i === activeStep 
                            ? "bg-primary/5 border-primary/30 text-ink-primary" 
                            : i < activeStep 
                              ? "bg-surface-elevated border-surface-border text-ink-muted"
                              : "bg-transparent border-transparent text-ink-muted/30"
                        )}
                      >
                        <step.icon className={cn(
                          "w-5 h-5 shrink-0",
                          i === activeStep ? "text-primary animate-pulse" : i < activeStep ? "text-status-verified" : "text-ink-muted/20"
                        )} />
                        <span className="text-xs font-mono font-bold uppercase tracking-wider">{step.text}</span>
                        {i < activeStep && <CheckCircle2 className="w-4 h-4 ml-auto text-status-verified" />}
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 text-[10px] font-mono text-ink-muted uppercase tracking-[0.3em] flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Cpu className="w-3 h-3 text-status-verified" />
                      GPU: 84%
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-accent-cyan" />
                      EST: {(5 - activeStep) * 2}s
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}

