import { Chrome, Loader2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useModalStore } from '@/src/store/modalStore';
import { Button } from '@/src/components/ui/Button';

export function CreateAccountModal() {
  const [loading, setLoading] = useState(false);
  const { openLogin } = useModalStore();

  const handleGoogleSignup = () => {
    setLoading(true);
    window.location.href = '/api/oauth/google';
  };

  return (
    <div className="space-y-6">
      <div className="text-center md:text-left">
        <h2 className="text-3xl font-display font-black tracking-tighter uppercase">Create Your Account</h2>
        <p className="text-ink-secondary text-sm font-medium">Join employers verifying smarter with Verity</p>

        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-status-verified uppercase tracking-wider">
            <CheckCircle2 className="w-3 h-3" />
            No credit card required
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-status-verified uppercase tracking-wider">
            <CheckCircle2 className="w-3 h-3" />
            First verify free
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-surface-elevated border border-surface-border text-sm text-ink-secondary">
          <ShieldCheck className="w-5 h-5 text-status-verified shrink-0" />
          <span>Account creation is handled securely via Google. No password needed.</span>
        </div>

        <Button
          onClick={handleGoogleSignup}
          disabled={loading}
          className="w-full py-4 text-base"
        >
          {loading
            ? <Loader2 className="w-5 h-5 animate-spin" />
            : <Chrome className="w-5 h-5" />
          }
          {loading ? 'Redirecting…' : 'Sign up with Google'}
        </Button>
      </div>

      <div className="text-center pt-2">
        <p className="text-sm text-ink-secondary">
          Already have an account?{' '}
          <button
            type="button"
            onClick={openLogin}
            className="text-primary font-bold hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
