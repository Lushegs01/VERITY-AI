import { motion } from 'motion/react';
import { 
  ShieldCheck, AlertTriangle, FileText, Wallet, ArrowUpRight, ArrowRight,
  Loader2, Clock, MoreVertical, Plus, ArrowDownLeft, Layers, RotateCcw,
  Search, Layout, Info, ExternalLink, ChevronDown, Download, Share2, Inbox
} from 'lucide-react';
import { AppShell } from '@/src/components/layout/AppShell';
import { Card } from '@/src/components/ui/Card';
import { Badge } from '@/src/components/ui/Badge';
import { Button } from '@/src/components/ui/Button';
import { ActivityChart } from '@/src/components/charts/ActivityChart';
import { Counter } from '@/src/components/ui/Counter';
import { Skeleton } from '@/src/components/ui/Skeleton';
import { useAuthStore } from '@/src/store/authStore';
import { useWalletStore } from '@/src/store/walletStore';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { cn } from '@/src/lib/utils';
import { TopUpModal } from '@/src/components/wallet/TopUpModal';
import { trpcQuery } from '@/src/lib/axios';

interface DashboardStats {
  totalVerified: number;
  totalSuspicious: number;
  totalFake: number;
}

interface Certificate {
  id: number;
  publicId: string;
  certificateType: string;
  institutionName?: string;
  trustScore: number;
  verdict: string;
  createdAt: string;
}

interface ActivityPoint { date: string; count: number; }

export function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const { balance, setBalance } = useWalletStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recent, setRecent] = useState<Certificate[]>([]);
  const [activity, setActivity] = useState<ActivityPoint[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const [statsData, recentData, activityData, walletData] = await Promise.all([
          trpcQuery<DashboardStats>('dashboard.stats'),
          trpcQuery<Certificate[]>('dashboard.recent'),
          trpcQuery<ActivityPoint[]>('dashboard.activity'),
          trpcQuery<{ balance: number }>('wallet.balance'),
        ]);
        setStats(statsData);
        setRecent(recentData);
        setActivity(activityData);
        setBalance(walletData.balance);
      } catch (e) {
        console.error('Dashboard load error:', e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [setBalance]);

  const totalVerifications = (stats?.totalVerified ?? 0) + (stats?.totalSuspicious ?? 0) + (stats?.totalFake ?? 0);

  const statsList = [
    { label: 'Wallet Balance', value: balance, icon: Wallet, color: 'text-primary', prefix: '₦' },
    { label: 'Total Verifications', value: totalVerifications, icon: Layers, color: 'text-accent-cyan' },
    { label: 'Verified Count', value: stats?.totalVerified ?? 0, icon: ShieldCheck, color: 'text-status-verified' },
    { label: 'Flagged Count', value: (stats?.totalSuspicious ?? 0) + (stats?.totalFake ?? 0), icon: AlertTriangle, color: 'text-status-fake' },
  ];

  const verdictVariant = (v: string) => {
    if (v === 'VERIFIED') return 'verified';
    if (v === 'LIKELY_FAKE') return 'fake';
    return 'suspicious';
  };

  return (
    <AppShell>
      <div className="space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-display font-black tracking-tighter uppercase mb-2">Forensics Node</h1>
            <p className="text-ink-secondary font-medium">
              Identity verified: <span className="text-primary">{user?.fullName || user?.name}</span> ⚡ System live
            </p>
          </div>
          <div className="flex gap-4">
            <Button onClick={() => navigate('/verify')} className="min-w-[160px]">
              <ShieldCheck className="w-5 h-5" />
              New Scan
            </Button>
            <Button variant="outline" onClick={() => navigate('/bulk')} className="min-w-[160px]">
              <Layers className="w-5 h-5" />
              Bulk Upload
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsList.map((stat, i) => (
            <Card key={i} className="p-6 relative group overflow-hidden">
              {isLoading ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <Skeleton className="h-4 w-4" />
                  </div>
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              ) : (
                <>
                  <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                    <stat.icon className="w-32 h-32" />
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={cn("p-2 rounded-xl bg-surface-elevated", stat.color)}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-ink-muted hover:text-ink-primary transition-colors cursor-pointer" />
                  </div>
                  <div className="text-2xl font-mono font-black text-ink-primary mb-1">
                    {stat.prefix}<Counter value={stat.value} />
                  </div>
                  <div className="text-[10px] font-mono font-bold text-ink-muted uppercase tracking-widest">{stat.label}</div>
                </>
              )}
            </Card>
          ))}
        </div>

        {/* Chart Section */}
        <div className="grid lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-display font-bold uppercase tracking-tight mb-1">Verification Activity</h3>
                <p className="text-xs font-mono text-ink-muted uppercase tracking-wider">30-day frequency log</p>
              </div>
            </div>
            {isLoading ? (
              <div className="h-[300px] flex items-end gap-2 px-4 pb-4">
                {[...Array(12)].map((_, i) => (
                  <Skeleton key={i} className="flex-1 rounded-t-lg" style={{ height: `${Math.random() * 80 + 20}%` }} />
                ))}
              </div>
            ) : (
              <ActivityChart data={activity} />
            )}
          </Card>

          <Card className="p-8">
            <h3 className="text-xl font-display font-bold uppercase tracking-tight mb-6">Quick Stats</h3>
            <div className="space-y-6">
              {[
                { label: 'Verified', value: stats?.totalVerified ?? 0, color: 'bg-status-verified' },
                { label: 'Suspicious', value: stats?.totalSuspicious ?? 0, color: 'bg-status-suspicious' },
                { label: 'Likely Fake', value: stats?.totalFake ?? 0, color: 'bg-status-fake' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-bold">{item.label}</span>
                    <span className="text-sm font-mono font-black">{item.value}</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-elevated rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full", item.color)}
                      style={{ width: totalVerifications > 0 ? `${(item.value / totalVerifications) * 100}%` : '0%' }}
                    />
                  </div>
                </div>
              ))}
              <Link to="/bulk" className="block text-center py-3 rounded-xl border border-dashed border-surface-border text-[10px] font-mono font-bold text-ink-muted hover:text-primary hover:border-primary transition-all uppercase tracking-widest">
                View All Active Jobs
              </Link>
            </div>
          </Card>
        </div>

        {/* Recent Verifications Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-display font-bold uppercase tracking-tight">Recent Forensic Logs</h3>
            <Link to="/history" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
              Full Archive <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <Card className="overflow-hidden">
            {recent.length === 0 && !isLoading ? (
              <div className="py-20 flex flex-col items-center text-center px-6">
                <div className="w-16 h-16 rounded-full bg-surface-elevated flex items-center justify-center text-ink-muted mb-4">
                  <Inbox className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-display font-bold uppercase mb-2">No verifications yet</h4>
                <p className="text-sm text-ink-secondary max-w-xs mx-auto mb-6">Start by uploading a document to verify its authenticity with AI-powered forensics.</p>
                <Button variant="outline" size="sm" onClick={() => navigate('/verify')}>
                  Verify First Document
                </Button>
              </div>
            ) : (
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-surface-border">
                      <th className="px-6 py-4 text-[10px] font-mono font-bold text-ink-muted uppercase tracking-widest">ID</th>
                      <th className="px-6 py-4 text-[10px] font-mono font-bold text-ink-muted uppercase tracking-widest">Type</th>
                      <th className="px-6 py-4 text-[10px] font-mono font-bold text-ink-muted uppercase tracking-widest">Institution</th>
                      <th className="px-6 py-4 text-[10px] font-mono font-bold text-ink-muted uppercase tracking-widest text-center">Score</th>
                      <th className="px-6 py-4 text-[10px] font-mono font-bold text-ink-muted uppercase tracking-widest">Verdict</th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      [...Array(5)].map((_, i) => (
                        <tr key={i} className="border-b border-surface-border/50 last:border-0">
                          <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                          <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                          <td className="px-6 py-4"><Skeleton className="h-4 w-48" /></td>
                          <td className="px-6 py-4"><Skeleton className="h-4 w-12 mx-auto" /></td>
                          <td className="px-6 py-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                          <td className="px-6 py-4 text-right"><Skeleton className="h-8 w-24 rounded-lg ml-auto" /></td>
                        </tr>
                      ))
                    ) : (
                      recent.slice(0, 5).map((item) => (
                        <tr key={item.id} className="border-b border-surface-border/50 hover:bg-surface-elevated/30 transition-colors last:border-0 group">
                          <td className="px-6 py-4">
                            <div className="text-xs font-mono font-bold text-ink-primary">{item.publicId}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-bold text-ink-primary">{item.certificateType}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-xs font-bold text-ink-primary truncate max-w-[200px]">{item.institutionName || '—'}</div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className={cn(
                              "font-mono text-sm font-black",
                              item.trustScore > 80 ? "text-status-verified" : item.trustScore > 50 ? "text-status-suspicious" : "text-status-fake"
                            )}>
                              {item.trustScore}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={verdictVariant(item.verdict) as any}>{item.verdict}</Badge>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Link
                              to={`/verify/${item.publicId}/result`}
                              className="px-4 py-2 rounded-lg bg-surface-elevated border border-surface-border text-[10px] font-mono font-bold text-ink-muted hover:text-primary hover:border-primary transition-all uppercase tracking-widest inline-block"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        {/* Wallet Section */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card className="p-8 h-full bg-gradient-to-br from-primary via-primary to-primary-dark text-white relative overflow-hidden group">
              <Wallet className="absolute -right-8 -bottom-8 w-48 h-48 opacity-10 group-hover:scale-110 transition-transform duration-700" />
              <div className="relative z-10 space-y-8">
                <div>
                  <div className="text-xs font-mono font-bold uppercase tracking-[0.3em] opacity-80 mb-2">Current Balance</div>
                  <div className="text-4xl font-mono font-black">
                    ₦{balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <Button
                  className="bg-white text-primary hover:bg-white/90 w-full"
                  onClick={() => setIsTopUpOpen(true)}
                >
                  <Plus className="w-5 h-5" />
                  Top Up Wallet
                </Button>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="p-8 h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-display font-bold uppercase tracking-tight">Recent Transactions</h3>
                <Link to="/wallet" className="text-xs font-bold text-primary hover:underline">View Ledger</Link>
              </div>
              <WalletTransactions />
            </Card>
          </div>
        </div>
      </div>

      <TopUpModal isOpen={isTopUpOpen} onClose={() => setIsTopUpOpen(false)} />
    </AppShell>
  );
}

function WalletTransactions() {
  const [txs, setTxs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trpcQuery<any[]>('wallet.transactions', { limit: 5 })
      .then(setTxs)
      .catch(() => setTxs([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center justify-between p-4 bg-surface-elevated/20 rounded-2xl border border-surface-border animate-pulse">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20 ml-auto" />
            <Skeleton className="h-3 w-16 ml-auto" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      {txs.map((tx, i) => (
        <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-surface-elevated/50 border border-surface-border hover:bg-surface-elevated transition-colors">
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center border",
              tx.type === 'topup' ? "bg-status-verified-bg text-status-verified border-status-verified/20" : "bg-primary/5 text-primary border-primary/20"
            )}>
              {tx.type === 'topup' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
            </div>
            <div>
              <div className="text-sm font-bold text-ink-primary truncate max-w-[200px]">{tx.description}</div>
              <div className="text-[10px] font-mono text-ink-muted uppercase">
                {new Date(tx.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className={cn(
              "text-sm font-mono font-black",
              tx.type === 'topup' ? "text-status-verified" : "text-ink-primary"
            )}>
              {tx.type === 'topup' ? '+' : '-'}₦{Number(tx.amount).toLocaleString()}
            </div>
            <div className="text-[9px] font-mono font-bold text-ink-muted uppercase">{tx.status}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
