import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, Globe, CheckCircle2, MoreHorizontal } from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Badge } from '@/src/components/ui/Badge';
import { TrustScoreRing } from '@/src/components/trust/TrustScoreRing';
import { Button } from '@/src/components/ui/Button';
import { QRCodeSVG } from 'qrcode.react';
import { cn } from '@/src/lib/utils';
import { useEffect, useState } from 'react';

export function BadgePage() {
  const { token } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [badgeData, setBadgeData] = useState<any>(null);

  useEffect(() => {
    if (!token) return;
    import('@/src/lib/axios').then(({ trpcQuery }) => {
      trpcQuery('public.badge', { token })
        .then((d) => setBadgeData(d))
        .catch(() => setBadgeData(null))
        .finally(() => setIsLoading(false));
    });
  }, [token]);

  const data = badgeData ? {
    applicant: badgeData.applicantName || '—',
    institution: badgeData.institutionName || '—',
    type: badgeData.certificateType || '—',
    trust_score: badgeData.trustScore,
    verdict: badgeData.verdict,
    issued: badgeData.verifiedAt ? new Date(badgeData.verifiedAt).toLocaleDateString('en', { month: 'short', year: 'numeric' }).toUpperCase() : '—',
    expires: badgeData.expiresAt ? new Date(badgeData.expiresAt).toLocaleDateString() : 'PERPETUAL',
    badge_id: token?.toUpperCase() || '—',
  } : null;

  return (
    <div className="min-h-screen bg-surface-base flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-[radial-gradient(circle_at_50%_0%,rgba(0,212,255,0.08)_0%,transparent_70%)] pointer-events-none" />
      
      <Card className="w-full max-w-lg relative z-10 p-0 overflow-hidden border-accent-cyan/20 shadow-[0_40px_100px_-20px_rgba(0,212,255,0.15)] rounded-[2.5rem]">
        {isLoading ? (
          <div className="p-24 flex flex-col items-center gap-8 bg-surface-card">
            <div className="relative">
              <ShieldCheck className="w-16 h-16 text-primary animate-pulse" />
              <div className="absolute inset-0 bg-primary/20 blur-2xl animate-pulse rounded-full" />
            </div>
            <div className="space-y-3 text-center">
              <div className="h-6 w-48 bg-surface-elevated animate-pulse rounded-full mx-auto" />
              <div className="h-3 w-32 bg-surface-elevated animate-pulse rounded-full mx-auto" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            {/* Header / Brand Bar */}
            <div className="bg-primary/5 border-b border-surface-border px-8 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2 text-primary">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-sm font-display font-black tracking-tighter uppercase">Verity Verified</span>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-1 h-1 rounded-full bg-primary/30" />
                ))}
              </div>
            </div>

            <div className="bg-surface-card p-10 md:p-12 text-center space-y-10">
              {/* Profile / Identity */}
              <div className="space-y-2">
                <h2 className="text-3xl font-display font-black text-ink-primary uppercase tracking-tight leading-none">{data.applicant}</h2>
                <div className="text-[10px] font-mono font-bold text-ink-muted uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-ink-muted/30" />
                  Authorized Recipient
                  <span className="w-1 h-1 rounded-full bg-ink-muted/30" />
                </div>
              </div>

              {/* Central Badge Graphic */}
              <div className="relative flex flex-col items-center">
                <div className="absolute inset-0 bg-primary/5 blur-[100px] rounded-full scale-150" />
                <div className="relative group">
                  <TrustScoreRing score={data.trust_score} size={220} />
                </div>
                
                <div className="mt-8">
                  <Badge 
                    variant="verified" 
                    className="px-8 py-2 text-xs tracking-[0.3em] bg-status-verified text-white border-0 shadow-lg shadow-status-verified/20 rounded-full"
                  >
                    {data.verdict}
                  </Badge>
                </div>
              </div>

              {/* Verification Context */}
              <div className="grid grid-cols-2 gap-8 text-left pt-4">
                <div className="space-y-1.5">
                  <div className="text-[9px] font-mono font-bold text-ink-muted uppercase tracking-widest">Institution</div>
                  <div className="text-sm font-black text-ink-primary leading-tight line-clamp-2">{data.institution}</div>
                </div>
                <div className="space-y-1.5">
                  <div className="text-[9px] font-mono font-bold text-ink-muted uppercase tracking-widest">Qualification</div>
                  <div className="text-sm font-black text-ink-primary leading-tight">{data.type}</div>
                </div>
                <div className="space-y-1.5">
                  <div className="text-[9px] font-mono font-bold text-ink-muted uppercase tracking-widest">Issued</div>
                  <div className="text-sm font-black text-ink-primary">{data.issued}</div>
                </div>
                <div className="space-y-1.5">
                  <div className="text-[9px] font-mono font-bold text-ink-muted uppercase tracking-widest">Validity</div>
                  <div className="text-sm font-black text-status-verified">{data.expires}</div>
                </div>
              </div>

              {/* Technical / Trust Footer */}
              <div className="pt-8 border-t border-surface-border flex flex-col items-center gap-6">
                <div className="flex items-center justify-between w-full">
                  <div className="text-left">
                    <div className="text-[8px] font-mono font-bold text-ink-muted uppercase tracking-widest mb-0.5">Verification ID</div>
                    <div className="text-[11px] font-mono font-black text-primary tracking-wider">{data.badge_id}</div>
                  </div>
                  <div className="p-2 border border-surface-border rounded-lg bg-surface-elevated group cursor-pointer hover:border-primary transition-colors">
                    <MoreHorizontal className="w-4 h-4 text-ink-muted group-hover:text-primary" />
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full p-4 rounded-2xl bg-surface-elevated/50 border border-surface-border">
                  <div className="p-2 bg-white rounded-xl shadow-inner shrink-0">
                    <QRCodeSVG 
                      value={typeof window !== 'undefined' ? window.location.href : `https://verity.app/badge/${token}`} 
                      size={64} 
                      level="H" 
                      includeMargin={false}
                    />
                  </div>
                  <div className="text-left space-y-1">
                    <div className="text-[9px] font-mono font-bold text-ink-muted uppercase tracking-[0.2em] flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-status-verified" /> 
                      Live Forensic Check
                    </div>
                    <p className="text-[10px] text-ink-secondary leading-tight opacity-70"> Scan this code to verify the cryptographic history of this badge in real-time.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification CTA */}
            <div className="p-8 bg-surface-elevated flex flex-col gap-4">
              <Link to="/">
                <Button className="w-full py-7 text-lg rounded-2xl shadow-2xl shadow-primary/30">
                  <ShieldCheck className="w-5 h-5" />
                  Verify on Verity
                </Button>
              </Link>
              <div className="flex items-center justify-center gap-6 opacity-30">
                <Globe className="w-4 h-4" />
                <div className="h-4 w-px bg-ink-muted" />
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
          </div>
        )}
      </Card>

      {!isLoading && (
        <div className="mt-12 text-center">
          <p className="text-[10px] font-mono font-bold text-ink-muted uppercase tracking-[0.5em] mb-4">Secured by Verity Proof-of-Trust Protocol</p>
          <div className="text-[9px] text-ink-muted flex items-center justify-center gap-2">
            <span>© 2026 Verity Forensic Inc.</span>
            <span className="w-1 h-1 rounded-full bg-ink-muted/30" />
            <a href="#" className="hover:text-primary">Terms</a>
            <span className="w-1 h-1 rounded-full bg-ink-muted/30" />
            <a href="#" className="hover:text-primary">Privacy</a>
          </div>
        </div>
      )}
    </div>
  );
}


