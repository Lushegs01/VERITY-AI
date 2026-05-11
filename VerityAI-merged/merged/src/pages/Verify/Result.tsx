import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Download, 
  Share2, 
  AlertTriangle, 
  ArrowLeft,
  Copy,
  ChevronDown,
  Info,
  ExternalLink,
  RotateCcw,
  FileText
} from 'lucide-react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { trpcQuery } from '@/src/lib/axios';
import { Skeleton } from '@/src/components/ui/Skeleton';
import { AppShell } from '@/src/components/layout/AppShell';
import { Card } from '@/src/components/ui/Card';
import { Badge } from '@/src/components/ui/Badge';
import { Button } from '@/src/components/ui/Button';
import { TrustScoreRing } from '@/src/components/trust/TrustScoreRing';
import { ForensicBar } from '@/src/components/trust/ForensicBar';
import { cn } from '@/src/lib/utils';
import { toast } from 'react-hot-toast';

export function Result() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [cert, setCert] = useState<any>(location.state?.result || null);
  const [isLoading, setIsLoading] = useState(!location.state?.result);

  useEffect(() => {
    if (!cert && id) {
      trpcQuery('verification.getById', { publicId: id })
        .then((data) => { if (data) setCert(data); })
        .catch(() => toast.error('Failed to load result'))
        .finally(() => setIsLoading(false));
    }
  }, [id, cert]);

  const handleCopyId = () => {
    navigator.clipboard.writeText(id || '');
    toast.success('System Reference ID copied');
  };

  const handleShareBadge = () => {
    const url = `${window.location.origin}/badge/${id || 'VRT-DEMO'}`;
    navigator.clipboard.writeText(url);
    toast.success('Badge URL copied to clipboard!', {
      icon: <Share2 className="text-primary" />
    });
  };

  if (isLoading) {
    return (
      <AppShell>
        <div className="max-w-5xl mx-auto space-y-8">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full rounded-2xl" />
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-40 rounded-2xl" />)}
          </div>
        </div>
      </AppShell>
    );
  }

  if (!cert) {
    return (
      <AppShell>
        <div className="max-w-5xl mx-auto py-24 text-center">
          <h2 className="text-2xl font-display font-bold uppercase mb-4">Result Not Found</h2>
          <p className="text-ink-secondary mb-8">This verification record doesn't exist or you don't have access.</p>
          <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
      </AppShell>
    );
  }

  const reportData = {
    id: cert.publicId || id,
    type: cert.certificateType,
    institution: cert.institutionName || '—',
    name: cert.applicantName || '—',
    fileName: cert.originalFilename || 'document.pdf',
    year: cert.graduationYear?.toString() || '—',
    regNumber: cert.regNumber || '—',
    trustScore: cert.trustScore,
    verdict: cert.aiVerdict || cert.verdict,
    aiScores: {
      visual: cert.aiVisualIntegrity,
      data: cert.aiDataPlausibility,
      institution: cert.aiInstitution,
      anomaly: 100 - cert.aiAnomaly,
      security: cert.aiSecurityFeatures,
    },
    reasoning: cert.aiReasoning,
    flags: cert.aiFlags || [],
    grades: [],
  };

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Back Link */}
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-ink-secondary hover:text-primary transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          System Dashboard
        </Link>

        {/* Hero Result Header */}
        <div className="grid lg:grid-cols-3 gap-10">
          <Card className="lg:col-span-2 p-10 flex flex-col md:flex-row items-center gap-12 bg-gradient-to-br from-surface-card via-surface-card to-status-verified/5">
            <TrustScoreRing score={reportData.trustScore} size={240} />
            
            <div className="flex-1 space-y-6 text-center md:text-left">
              <div>
                <div className="text-[10px] font-mono font-bold text-ink-muted uppercase tracking-[0.3em] mb-2">Forensic Outcome</div>
                <h1 className={cn(
                  "text-5xl font-display font-black tracking-tight uppercase",
                  reportData.trustScore > 70 ? "text-status-verified" : reportData.trustScore > 40 ? "text-status-suspicious" : "text-status-fake"
                )}>
                  {reportData.trustScore > 70 ? "Authentic." : reportData.trustScore > 40 ? "Suspicious." : "Likely Fake."}
                </h1>
                <Badge 
                  variant={reportData.trustScore > 70 ? 'verified' : reportData.trustScore > 40 ? 'suspicious' : 'fake'} 
                  className="mt-4 scale-125 origin-left"
                >
                  {reportData.verdict.replace('_', ' ')}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-center md:justify-start gap-4">
                  <div className="text-xs font-mono font-bold text-ink-muted uppercase tracking-widest">Node ID:</div>
                  <div className="flex items-center gap-2 px-2 py-1 rounded bg-surface-elevated font-mono text-sm font-bold text-ink-primary border border-surface-border">
                    {reportData.id}
                    <button onClick={handleCopyId} className="hover:text-primary transition-colors">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-ink-secondary font-medium leading-relaxed">
                  Verification completed in 14.8 seconds. PII hash stored. Final report generated with 98.4% confidence rating.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8 flex flex-col justify-between border-primary/20 bg-primary/5">
            <div className="space-y-6">
              <h3 className="text-lg font-display font-bold uppercase tracking-tight flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                Actions
              </h3>
              <div className="space-y-3">
                <Button className="w-full" onClick={() => toast.success('Preparing forensic PDF report for download...')}>
                  <Download className="w-5 h-5" />
                  Download PDF Report
                </Button>
                <Button variant="outline" className="w-full" onClick={handleShareBadge}>
                  <Share2 className="w-5 h-5" />
                  Share Badge
                </Button>
                <Button variant="danger" className="w-full" onClick={() => toast.error('Dispute ticket opened. Verity agent will contact you.')}>
                  <AlertTriangle className="w-5 h-5" />
                  Dispute Verdict
                </Button>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/verify')}
              className="mt-8 text-xs font-mono font-bold text-ink-muted hover:text-ink-primary flex items-center justify-center gap-2 uppercase tracking-widest group"
            >
              <RotateCcw className="w-3 h-3 group-hover:rotate-[-45deg] transition-transform" /> 
              Start New Analysis
            </button>
          </Card>
        </div>

        {/* Detailed Report Layout */}
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Extracted Information */}
          <div className="space-y-6">
            <h2 className="text-xl font-display font-bold uppercase tracking-tight flex items-center gap-2">
              <Info className="w-5 h-5 text-accent-cyan" />
              Extracted Information
            </h2>
            <Card className="divide-y divide-surface-border">
              {[
                { label: 'Candidate Name', value: reportData.name, bold: true },
                { label: 'Institution Name', value: reportData.institution, badge: true },
                { label: 'Credential Type', value: reportData.type },
                { label: 'Year Issued', value: reportData.year },
                { label: 'Registration Number', value: reportData.regNumber, mono: true },
              ].map((row, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-2">
                  <span className="text-xs font-mono font-bold text-ink-muted uppercase tracking-widest">{row.label}</span>
                  <div className="flex items-center gap-2">
                    {row.badge ? (
                      <div className="flex items-center gap-2 text-status-verified bg-status-verified-bg px-2.5 py-1 rounded-full border border-status-verified/20">
                        <ShieldCheck className="w-3 h-3" />
                        <span className="text-[10px] font-mono font-black uppercase">{row.value}</span>
                      </div>
                    ) : (
                      <span className={cn(
                        "text-sm", 
                        row.bold ? "font-bold text-ink-primary text-lg" : "font-medium text-ink-secondary",
                        row.mono && "font-mono font-bold"
                      )}>
                        {row.value}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Grades Table */}
              <div className="p-6 space-y-4">
                <button className="w-full flex items-center justify-between group">
                  <span className="text-xs font-mono font-bold text-ink-muted uppercase tracking-widest">Academic Records</span>
                  <ChevronDown className="w-4 h-4 text-ink-muted group-hover:text-primary transition-colors" />
                </button>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {reportData.grades.map((g, i) => (
                    <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-surface-elevated border border-surface-border">
                      <span className="text-[10px] font-bold text-ink-secondary truncate pr-2 uppercase">{g.course}</span>
                      <span className="text-xs font-mono font-black text-primary">{g.grade}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* AI Analysis & Flags */}
          <div className="space-y-10">
            <div className="space-y-6">
              <h2 className="text-xl font-display font-bold uppercase tracking-tight flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Forensic Analysis
              </h2>
              <Card className="p-8 space-y-8">
                <div className="grid gap-6">
                  <ForensicBar label="Visual Integrity" score={reportData.aiScores.visual} />
                  <ForensicBar label="Data Plausibility" score={reportData.aiScores.data} />
                  <ForensicBar label="Institution Recognition" score={reportData.aiScores.institution} />
                  <ForensicBar label="Anomaly Detection" score={reportData.aiScores.anomaly} />
                  <ForensicBar label="Security Features" score={reportData.aiScores.security} />
                </div>
                
                <div className="pt-6 border-t border-surface-border space-y-3">
                  <span className="text-[10px] font-mono font-bold text-ink-muted uppercase tracking-[0.2em]">AI Reasoning Verdict</span>
                  <p className="text-sm italic font-medium text-ink-secondary leading-relaxed border-l-2 border-primary/30 pl-4 py-1">
                    "{reportData.reasoning}"
                  </p>
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-display font-bold uppercase tracking-tight flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-status-suspicious" />
                Forensic Flags
              </h2>
              <div className="space-y-4">
                {reportData.flags.map((flag, i) => (
                  <Card key={i} className="p-6 border-status-suspicious/20 bg-status-suspicious-bg/5 group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-status-suspicious-bg border border-status-suspicious/20">
                          <AlertTriangle className="w-4 h-4 text-status-suspicious" />
                        </div>
                        <div>
                          <div className="text-[10px] font-mono font-black text-status-suspicious uppercase tracking-widest">{flag.type}</div>
                          <h4 className="text-sm font-bold text-ink-primary">Flag on {flag.field}</h4>
                        </div>
                      </div>
                      <Badge variant="suspicious">{flag.severity}</Badge>
                    </div>
                    <p className="text-xs text-ink-secondary leading-relaxed font-medium">
                      {flag.description}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* System Footer Info */}
        <div className="pt-12 border-t border-surface-border text-center space-y-6">
          <div className="flex flex-col items-center gap-2">
            <div className="text-[10px] font-mono text-ink-muted uppercase tracking-[0.4em]">Node Transaction Receipt</div>
            <div className="px-4 py-2 rounded-xl bg-surface-elevated border border-surface-border inline-flex items-center gap-4">
              <span className="text-xs font-mono font-bold text-ink-primary">₦500.00 DEDUCTED</span>
              <div className="w-px h-3 bg-surface-border" />
              <span className="text-[10px] font-mono text-ink-muted uppercase">Ref: SQ-{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
            </div>
          </div>
          
          <div className="flex justify-center gap-8">
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-ink-muted">
              <div className="w-1.5 h-1.5 rounded-full bg-status-verified" />
              SQUAD API: CONNECTED
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-ink-muted">
              <div className="w-1.5 h-1.5 rounded-full bg-status-verified" />
              AI ENGINE: OPTIMAL
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

