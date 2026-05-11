import { Chrome, Loader2, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/src/components/ui/Button';

export function LoginModal() {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = () => {
    setLoading(true);
    window.location.href = '/api/oauth/google';
  };

  return (
    <div className="space-y-6">
      <div className="text-center md:text-left">
        <h2 className="text-3xl font-display font-black tracking-tighter uppercase">Welcome Back</h2>
        <p className="text-ink-secondary text-sm font-medium">Sign in to your Verity account</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-surface-elevated border border-surface-border text-sm text-ink-secondary">
          <ShieldCheck className="w-5 h-5 text-status-verified shrink-0" />
          <span>Verity uses Google OAuth for secure, passwordless authentication.</span>
        </div>

        <Button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-4 text-base"
        >
          {loading
            ? <Loader2 className="w-5 h-5 animate-spin" />
            : <Chrome className="w-5 h-5" />
          }
          {loading ? 'Redirecting…' : 'Continue with Google'}
        </Button>
      </div>

      <p className="text-center text-xs text-ink-muted">
        By continuing, you agree to Verity's Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}
