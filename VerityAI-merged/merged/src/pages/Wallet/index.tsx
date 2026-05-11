import { AppShell } from '@/src/components/layout/AppShell';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Skeleton } from '@/src/components/ui/Skeleton';
import { useWalletStore } from '@/src/store/walletStore';
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useState, useEffect } from 'react';
import { trpcQuery } from '@/src/lib/axios';
import { TopUpModal } from '@/src/components/wallet/TopUpModal';
import { toast } from 'react-hot-toast';

export function WalletPage() {
  const { balance, setBalance, transactions, setTransactions } = useWalletStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [walletData, txData] = await Promise.all([
          trpcQuery<{ balance: number }>('wallet.balance'),
          trpcQuery<any[]>('wallet.transactions', { limit: 20 }),
        ]);
        setBalance(walletData.balance);
        setTransactions(txData);
      } catch {
        toast.error('Failed to load wallet data');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [setBalance, setTransactions]);

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-display font-black tracking-tighter uppercase mb-2">Vault & Credits</h1>
            <p className="text-ink-secondary font-medium">Manage your verification credits and transaction history.</p>
          </div>
          <Button onClick={() => setIsTopUpOpen(true)} className="w-full sm:w-auto">
            <Plus className="w-5 h-5" />
            Add Funds
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 p-6 sm:p-10 bg-gradient-to-br from-primary via-primary to-primary-dark text-white relative overflow-hidden">
            <Wallet className="absolute -right-8 -bottom-8 w-48 h-48 opacity-10" />
            <div className="relative z-10 space-y-8">
              <div>
                <div className="text-xs font-mono font-bold uppercase tracking-[0.3em] opacity-80 mb-2">Available Credits</div>
                {isLoading ? (
                  <Skeleton className="h-12 w-48 bg-white/20" />
                ) : (
                  <div className="text-3xl sm:text-5xl font-mono font-black">
                    ₦{balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-8 flex flex-col justify-center items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <div>
              <div className="text-sm font-bold mb-1">Top Up Wallet</div>
              <p className="text-xs text-ink-secondary">Add funds to continue verifying certificates.</p>
            </div>
            <Button onClick={() => setIsTopUpOpen(true)} className="w-full">
              Add Funds
            </Button>
          </Card>
        </div>

        {/* Transactions */}
        <Card className="overflow-hidden">
          <div className="p-6 border-b border-surface-border">
            <h3 className="text-xl font-display font-bold uppercase tracking-tight">Transaction Ledger</h3>
          </div>
          <div className="divide-y divide-surface-border">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <div className="space-y-2 text-right">
                    <Skeleton className="h-4 w-24 ml-auto" />
                    <Skeleton className="h-3 w-16 ml-auto" />
                  </div>
                </div>
              ))
            ) : transactions.length === 0 ? (
              <div className="py-16 text-center text-ink-secondary">No transactions yet.</div>
            ) : (
              transactions.map((tx: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-6 hover:bg-surface-elevated/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center border",
                      tx.type === 'topup' ? "bg-status-verified-bg text-status-verified border-status-verified/20" : "bg-primary/5 text-primary border-primary/20"
                    )}>
                      {tx.type === 'topup' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-ink-primary">{tx.description}</div>
                      <div className="text-[10px] font-mono text-ink-muted uppercase">
                        {new Date(tx.createdAt).toLocaleDateString()} · {tx.status}
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
                    <div className="text-[10px] font-mono text-ink-muted">
                      Balance: ₦{Number(tx.balanceAfter).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <TopUpModal isOpen={isTopUpOpen} onClose={() => setIsTopUpOpen(false)} />
    </AppShell>
  );
}
