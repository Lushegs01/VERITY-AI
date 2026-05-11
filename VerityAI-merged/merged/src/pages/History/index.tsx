import { AppShell } from '@/src/components/layout/AppShell';
import { Card } from '@/src/components/ui/Card';
import { Badge as UIBadge } from '@/src/components/ui/Badge';
import { Button } from '@/src/components/ui/Button';
import { Skeleton } from '@/src/components/ui/Skeleton';
import { Search, Filter, Download, ShieldCheck, Inbox } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { trpcQuery } from '@/src/lib/axios';
import { toast } from 'react-hot-toast';

interface Certificate {
  id: number;
  publicId: string;
  certificateType: string;
  applicantName?: string;
  institutionName?: string;
  trustScore: number;
  verdict: string;
  createdAt: string;
}

const VERDICTS = ['', 'VERIFIED', 'SUSPICIOUS', 'LIKELY_FAKE'];

export function History() {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<Certificate[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [verdict, setVerdict] = useState('');
  const navigate = useNavigate();

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await trpcQuery<{ items: Certificate[]; total: number; totalPages: number }>('verification.history', {
        page,
        limit: 15,
        ...(verdict ? { verdict } : {}),
        ...(search ? { search } : {}),
      });
      setItems(data.items);
      setTotal(data.total);
    } catch {
      toast.error('Failed to load history');
    } finally {
      setIsLoading(false);
    }
  }, [page, search, verdict]);

  useEffect(() => { load(); }, [load]);

  const verdictVariant = (v: string) => {
    if (v === 'VERIFIED') return 'verified';
    if (v === 'LIKELY_FAKE') return 'fake';
    return 'suspicious';
  };

  return (
    <AppShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-display font-black tracking-tighter uppercase mb-2">Forensic Archive</h1>
          <p className="text-ink-secondary font-medium">Search and manage all historical verification records.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
            <input
              type="text"
              placeholder="Search by ID, Name or Institution..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full bg-surface-card border border-surface-border rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all font-medium"
            />
          </div>
          <select
            value={verdict}
            onChange={(e) => { setVerdict(e.target.value); setPage(1); }}
            className="bg-surface-card border border-surface-border rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-primary/50"
          >
            <option value="">All Verdicts</option>
            <option value="VERIFIED">Verified</option>
            <option value="SUSPICIOUS">Suspicious</option>
            <option value="LIKELY_FAKE">Likely Fake</option>
          </select>
        </div>

        <Card className="overflow-x-auto">
          {items.length === 0 && !isLoading ? (
            <div className="py-24 flex flex-col items-center text-center px-6">
              <div className="w-20 h-20 rounded-full bg-surface-elevated flex items-center justify-center text-ink-muted mb-6">
                <Inbox className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-display font-bold uppercase mb-2">Archive Empty</h4>
              <p className="text-ink-secondary max-w-sm mx-auto mb-8">No records found. All verification results will appear here once processed.</p>
              <Button onClick={() => navigate('/verify')}>Initialize Verification</Button>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-surface-border">
                  <th className="px-6 py-4 text-[10px] font-mono font-bold text-ink-muted uppercase tracking-widest">ID</th>
                  <th className="px-6 py-4 text-[10px] font-mono font-bold text-ink-muted uppercase tracking-widest">Applicant</th>
                  <th className="px-6 py-4 text-[10px] font-mono font-bold text-ink-muted uppercase tracking-widest">Type</th>
                  <th className="px-6 py-4 text-[10px] font-mono font-bold text-ink-muted uppercase tracking-widest">Institution</th>
                  <th className="px-6 py-4 text-[10px] font-mono font-bold text-ink-muted uppercase tracking-widest text-center">Score</th>
                  <th className="px-6 py-4 text-[10px] font-mono font-bold text-ink-muted uppercase tracking-widest">Verdict</th>
                  <th className="px-6 py-4 text-[10px] font-mono font-bold text-ink-muted uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="border-b border-surface-border/50">
                      {[...Array(8)].map((_, j) => (
                        <td key={j} className="px-6 py-4"><Skeleton className="h-4 w-full" /></td>
                      ))}
                    </tr>
                  ))
                ) : (
                  items.map((item) => (
                    <tr key={item.id} className="border-b border-surface-border/50 hover:bg-surface-elevated/30 transition-colors last:border-0">
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono font-bold text-ink-primary">{item.publicId}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold">{item.applicantName || '—'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-ink-secondary">{item.certificateType}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-ink-secondary truncate block max-w-[160px]">{item.institutionName || '—'}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={cn(
                          "font-mono text-sm font-black",
                          item.trustScore > 80 ? "text-status-verified" : item.trustScore > 50 ? "text-status-suspicious" : "text-status-fake"
                        )}>
                          {item.trustScore}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <UIBadge variant={verdictVariant(item.verdict) as any}>{item.verdict}</UIBadge>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono text-ink-muted">{new Date(item.createdAt).toLocaleDateString()}</span>
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
          )}
        </Card>

        {/* Pagination */}
        {total > 15 && (
          <div className="flex justify-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
              Previous
            </Button>
            <span className="px-4 py-2 text-sm font-mono text-ink-muted">Page {page} of {Math.ceil(total / 15)}</span>
            <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / 15)}>
              Next
            </Button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
