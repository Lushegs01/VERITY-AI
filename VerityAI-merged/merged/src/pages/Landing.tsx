import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Upload, 
  Search, 
  BarChart3, 
  ArrowRight, 
  Menu, 
  X,
  Zap, 
  Layers, 
  Share2, 
  CheckCircle2,
  Lock,
  Globe,
  Database,
  Cpu
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrustScoreRing } from '@/src/components/trust/TrustScoreRing';
import { Counter } from '@/src/components/ui/Counter';
import { AnimatedBackground } from '@/src/components/animations/AnimatedBackground';
import { useModalStore } from '@/src/store/modalStore';
import { useAuthStore } from '@/src/store/authStore';

export function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { openLogin, openGetStarted, openCreateAccount } = useModalStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const handleResize = () => setWindowWidth(window.innerWidth);
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleOpenAuth = (type: 'login' | 'getStarted' | 'createAccount') => {
    if (isAuthenticated) {
      navigate('/dashboard');
      return;
    }

    if (type === 'login') openLogin();
    else if (type === 'getStarted') openGetStarted();
    else if (type === 'createAccount') openCreateAccount();
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const ringSize = windowWidth < 640 ? 240 : windowWidth < 1024 ? 280 : 320;

  const features = [
    { 
      icon: Cpu, 
      title: 'GPT-4o Vision Analysis', 
      desc: 'Multimodal AI forensic pipeline that cross-examines typography, layout consistency, and paper quality.' 
    },
    { 
      icon: Zap, 
      title: 'Squad-Powered Payments', 
      desc: 'Seamless Paystack-built wallet system for per-verification credits. Instant top-ups via card or transfer.' 
    },
    { 
      icon: Layers, 
      title: 'Bulk Verification', 
      desc: 'Upload 500+ certificates in a single ZIP. Real-time progress tracking with detailed Excel/PDF reports.' 
    },
    { 
      icon: Share2, 
      title: 'Shareable Trust Badge', 
      desc: 'Applicants can self-verify and generate a dynamic, QR-linked trust badge to embed on LinkedIn or CVs.' 
    },
  ];

  const pricing = [
    { 
      name: 'Single Verify', 
      price: '500', 
      desc: 'Deep forensic analysis of one Nigerian certificate.',
      features: ['GPT-4 Vision Analysis', 'Rule-based validation', 'PDF Forensic Report', '15-second turnaround'],
      cta: 'Verify Now'
    },
    { 
      name: 'Cached Result', 
      price: '200', 
      desc: 'Instant verification if the certificate has been scanned before.',
      features: ['Fingerprint fingerprinting', '0.1s response time', 'Original result access', 'Reduced cost'],
      cta: 'Check Cache',
      popular: true
    },
    { 
      name: 'Self-Verify Badge', 
      price: '1,000', 
      desc: 'For students and job seekers looking to prove their credentials.',
      features: ['Permanent QR Badge', '90-day expiry', 'LinkedIn Integration', 'Direct HR Lookup'],
      cta: 'Apply for Badge'
    },
  ];

  return (
    <div className="relative min-h-screen bg-surface-base text-ink-primary selection:bg-primary/30">
      {/* Grain Overlay */}
      <div className="fixed inset-0 noise-overlay pointer-events-none z-[9999]" />

      {/* Navigation */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-300 border-b",
        scrolled 
          ? "bg-surface-base/80 backdrop-blur-xl border-surface-border py-4" 
          : "bg-transparent border-transparent py-6"
      )}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-primary shadow-[0_0_15px_rgba(5,150,105,0.2)]" />
            <span className="text-2xl font-display font-extrabold tracking-tighter uppercase mr-4">Verity</span>
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-surface-elevated border border-surface-border">
              <span className="w-1.5 h-1.5 rounded-full bg-status-verified animate-pulse" />
              <span className="text-[8px] font-mono font-bold text-ink-muted uppercase tracking-widest">Demo Mode</span>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center space-x-10 text-sm font-medium">
            {['Features', 'How It Works', 'Pricing', 'API Docs'].map((item) => (
              <button 
                key={item} 
                onClick={() => scrollToSection(item.toLowerCase().replace(/ /g, '-'))}
                className="text-ink-secondary hover:text-ink-primary transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all group-hover:w-full" />
              </button>
            ))}
            <button 
              onClick={() => handleOpenAuth('login')}
              className="text-ink-primary hover:text-primary transition-colors font-semibold"
            >
              Log In
            </button>
            <button 
              onClick={() => handleOpenAuth('getStarted')}
              className={cn(
                "px-6 py-2.5 rounded-full bg-primary text-white font-bold transition-all transform",
                "hover:bg-primary-light hover:shadow-[0_0_20px_rgba(5,150,105,0.2)] active:scale-95"
              )}
            >
              Get Started
            </button>
          </div>

          <button className="lg:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[110] bg-surface-base lg:hidden p-6 flex flex-col items-center justify-center space-y-8"
          >
            <button className="absolute top-8 right-8 p-3 rounded-full bg-surface-elevated border border-surface-border" onClick={() => setMobileMenuOpen(false)}>
              <X className="w-8 h-8 text-ink-primary" />
            </button>
            <div className="flex flex-col items-center space-y-8">
              {['Features', 'How It Works', 'Pricing', 'API Docs'].map((item) => (
                <button 
                  key={item} 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setTimeout(() => scrollToSection(item.toLowerCase().replace(/ /g, '-')), 300);
                  }} 
                  className="text-4xl font-display font-black tracking-tighter uppercase"
                >
                  {item}
                </button>
              ))}
              <div className="pt-8 flex flex-col gap-4 w-full">
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleOpenAuth('login');
                  }}
                  className="text-xl font-display font-bold text-ink-secondary"
                >
                  Log In
                </button>
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleOpenAuth('getStarted');
                  }}
                  className="w-full py-5 rounded-full bg-primary text-white text-xl font-black uppercase tracking-widest shadow-xl"
                >
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-6 overflow-hidden">
        <AnimatedBackground />
        
        <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-20">
          <div className="flex-1 text-center lg:text-left space-y-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[8.5vw] sm:text-[6.5vw] lg:text-[5.5vw] font-display font-black tracking-[-0.02em] leading-[1.1] text-ink-primary uppercase"
          >
            Nigeria's Certification <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-light to-accent-cyan leading-tight">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                Authentication System.
              </motion.span>
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-ink-secondary max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium"
          >
            Upload any Nigerian academic certificate. Get a forensic trust score and detailed verdict in under 15 seconds. Built for HR teams and institutions.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
          >
            <button 
              onClick={() => handleOpenAuth('getStarted')}
              className="group relative w-full sm:w-auto px-10 py-5 rounded-full bg-primary text-white font-bold text-lg overflow-hidden transform transition-all hover:scale-105 active:scale-95 shadow-[0_10px_40px_rgba(5,150,105,0.15)]"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Verify a Certificate <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-light to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="w-full sm:w-auto px-10 py-5 rounded-full border border-surface-border bg-surface-elevated/30 hover:bg-surface-elevated transition-all text-ink-primary font-bold text-lg active:scale-95"
            >
              See How It Works
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="pt-10 grid grid-cols-2 sm:flex sm:flex-wrap justify-center lg:justify-start gap-x-8 gap-y-8"
          >
            {[
              { label: 'Certificates Verified', value: 12400, suffix: '+' },
              { label: 'Accuracy Rate', value: 98.2, suffix: '%', decimals: 1 },
              { label: 'Average Speed', value: 15, prefix: '< ', suffix: 's' }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col">
                <div className="text-2xl font-mono font-bold text-ink-primary">
                  {stat.prefix}<Counter value={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
                </div>
                <div className="text-[10px] font-mono text-ink-muted uppercase tracking-[0.2em]">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', damping: 15 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full animate-pulse" />
          <div className="relative p-10 rounded-[3rem] bg-surface-card/60 border border-surface-border shadow-2xl backdrop-blur-xl group">
            {/* SVG Scanner Line Animation */}
            <motion.div 
              className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent z-20 pointer-events-none"
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
            <TrustScoreRing score={91} size={ringSize} />
            <div className="mt-12 space-y-4">
              <div className="h-2 w-3/4 bg-surface-elevated rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '91%' }} transition={{ delay: 1, duration: 1 }} className="h-full bg-status-verified" />
              </div>
              <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-ink-muted">
                <span>Visual Integrity</span>
                <span className="text-status-verified">94%</span>
              </div>
            </div>
          </div>

          {/* Decorative floating elements */}
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-10 -right-10 p-4 rounded-2xl bg-surface-elevated border border-surface-border shadow-xl backdrop-blur-md"
          >
            <Lock className="w-8 h-8 text-accent-cyan" />
          </motion.div>
          <motion.div 
             animate={{ y: [0, 20, 0] }}
             transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
             className="absolute -bottom-6 -left-10 p-5 rounded-2xl bg-surface-elevated border border-surface-border shadow-xl backdrop-blur-md"
          >
            <Database className="w-6 h-6 text-primary" />
          </motion.div>
        </motion.div>
      </div>
    </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 lg:py-40 bg-surface-card/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-24 text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-display font-black tracking-tight mb-6 uppercase">High-Speed Forensic Loop.</h2>
            <p className="text-ink-secondary text-lg">We've automated institutional trust. No more waiting weeks for manual verification. Our AI evaluates certificates with a sub-second eye for detail.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: '01', icon: Upload, title: 'Upload Document', desc: 'Securely upload a photo or PDF of the academic certificate. We support WAEC, NECO, and all major Nigerian university degrees.' },
              { step: '02', icon: Search, title: 'AI Forensic Scan', desc: 'Our engine cross-checks typography, layout, seals, and ink consistency against our database of confirmed institutional formats.' },
              { step: '03', icon: BarChart3, title: 'Instant Score', desc: 'Receive a score out of 100 with a detailed report explaining any anomalies, red flags, or missing security features.' }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative p-10 rounded-[2.5rem] bg-surface-elevated/50 border border-surface-border hover:border-primary/40 transition-all group"
              >
                <div className="absolute top-8 right-10 text-5xl font-display font-black text-ink-muted/10 group-hover:text-primary/10 transition-colors">{item.step}</div>
                <div className="w-16 h-16 rounded-2xl bg-surface-base border border-surface-border flex items-center justify-center mb-8 group-hover:bg-primary/20 group-hover:border-primary/30 transition-all">
                  <item.icon className="w-8 h-8 text-ink-secondary group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-4 tracking-tight uppercase">{item.title}</h3>
                <p className="text-ink-secondary leading-relaxed font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 lg:py-40 max-w-7xl mx-auto px-6 relative">
        {/* Animated Background SVG Decoration */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.05] pointer-events-none overflow-hidden">
          <motion.svg 
            width="800" height="800" viewBox="0 0 800 800"
            animate={{ rotate: 360 }}
            transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          >
            <circle cx="400" cy="400" r="300" stroke="var(--color-primary)" strokeWidth="1" fill="none" strokeDasharray="10 20" />
            <circle cx="400" cy="400" r="200" stroke="var(--color-primary)" strokeWidth="1" fill="none" strokeDasharray="5 15" />
            <path d="M 400 0 L 400 800 M 0 400 L 800 400" stroke="var(--color-primary)" strokeWidth="0.5" />
          </motion.svg>
        </div>

        <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-display font-black tracking-tight uppercase leading-[0.95]">
              Built for <span className="text-primary">Architects of Trust.</span>
            </h2>
            <p className="text-ink-secondary text-lg max-w-lg font-medium leading-relaxed">
              Verity is not just a scanner. It's an end-to-end credential management platform designed for the complex Nigerian hiring landscape.
            </p>
            <div className="space-y-4 pt-4">
              {['99.2% Verification Accuracy', 'AES-256 Data Encryption', 'Institutional API Access', 'Real-time Fraud Alerts'].map((text) => (
                <div key={text} className="flex items-center gap-3 text-sm font-mono font-bold tracking-wider text-ink-primary uppercase">
                  <CheckCircle2 className="w-5 h-5 text-status-verified" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <div 
                key={i} 
                className={cn(
                  "p-8 rounded-3xl border transition-all hover:bg-surface-elevated group",
                  "bg-surface-card border-surface-border hover:border-primary/50 hover:shadow-[0_15px_40px_rgba(5,150,105,0.08)]"
                )}
              >
                <div className="w-12 h-12 rounded-xl bg-surface-elevated flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                  <f.icon className="w-6 h-6 text-ink-secondary group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-lg font-display font-bold mb-3 tracking-tight uppercase">{f.title}</h3>
                <p className="text-sm text-ink-secondary leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 lg:py-40 bg-surface-card/20 border-y border-surface-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24 space-y-4">
            <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight">Scale-Based Pricing.</h2>
            <p className="text-ink-secondary text-lg">Choose the tier that fits your verification frequency.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricing.map((tier, i) => (
              <div 
                key={i} 
                className={cn(
                  "relative p-10 rounded-[2.5rem] border flex flex-col transition-all hover:scale-[1.02]",
                  tier.popular 
                    ? "bg-surface-elevated border-primary/50 shadow-[0_20px_50px_rgba(5,150,105,0.12)] ring-1 ring-primary/20 scale-[1.05] z-10" 
                    : "bg-surface-card border-surface-border hover:border-ink-secondary/30"
                )}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-white text-[10px] font-mono font-black uppercase tracking-[0.2em] shadow-lg">
                    Most Popular
                  </div>
                )}
                <div className="mb-8">
                  <h3 className="text-xl font-display font-bold text-ink-muted mb-2 uppercase">{tier.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-display font-black text-ink-primary">₦{tier.price}</span>
                    <span className="text-ink-muted text-sm font-mono uppercase tracking-widest">/ scan</span>
                  </div>
                </div>
                <p className="text-sm text-ink-secondary mb-8 font-medium leading-relaxed">{tier.desc}</p>
                <div className="space-y-4 mb-10 flex-1">
                  {tier.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-3 text-sm font-medium text-ink-primary">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => handleOpenAuth('getStarted')}
                  className={cn(
                    "w-full py-4 rounded-full font-bold text-lg transition-all",
                    tier.popular 
                      ? "bg-primary text-white hover:bg-primary-light shadow-lg" 
                      : "bg-surface-base text-ink-primary border border-surface-border hover:bg-surface-elevated"
                  )}
                >
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-40 px-6">
        <div className="max-w-4xl mx-auto rounded-[3rem] bg-gradient-to-br from-primary via-primary-dark to-surface-card p-1 text-center shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-surface-base m-[2px] rounded-[2.9rem] z-0" />
          <div className="relative z-10 py-16 lg:py-24 px-8 space-y-10 bg-surface-base/50 backdrop-blur-sm rounded-[2.9rem]">
            <h2 className="text-4xl md:text-6xl font-display font-black tracking-tight text-ink-primary uppercase leading-none">
              Ready to verify <br /> the <span className="text-primary italic">Undeniable?</span>
            </h2>
            <p className="text-ink-secondary text-lg lg:text-xl max-w-xl mx-auto font-medium">
              Join 1,200+ companies who trust Verity for their academic forensic needs. High-stakes hiring requires high-speed truth.
            </p>
            <div className="pt-6">
              <button 
                onClick={() => handleOpenAuth('getStarted')}
                className="w-full sm:w-auto px-12 py-6 rounded-full bg-primary text-white font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-[0_15px_40px_rgba(5,150,105,0.2)]"
              >
                Create Free Account
              </button>
            </div>
            <div className="flex flex-wrap justify-center gap-8 lg:gap-12 pt-8">
              {[
                { icon: Globe, label: 'Global Standards' },
                { icon: Lock, label: 'Secure Storage' },
                { icon: Zap, label: 'Instant API' }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <item.icon className="w-6 h-6 text-ink-muted" />
                  <span className="text-[10px] font-mono text-ink-muted uppercase tracking-widest">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-border bg-surface-base py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-24">
            <div className="col-span-2 space-y-6">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-8 h-8 text-primary" />
                <span className="text-2xl font-display font-black tracking-tighter uppercase">Verity</span>
              </div>
              <p className="max-w-xs text-ink-secondary text-sm font-medium leading-relaxed">
                Nigeria's AI-Powered Truth Engine for Academic Credentials. We automate institutional trust with forensic precision.
              </p>
              <div className="flex gap-4">
                {['Twitter', 'LinkedIn', 'App'].map((platform) => (
                  <div key={platform} className="w-10 h-10 rounded-full bg-surface-card border border-surface-border flex items-center justify-center hover:border-primary transition-colors cursor-pointer group">
                    <span className="text-[10px] font-mono font-bold text-ink-muted group-hover:text-primary transition-colors">{platform[0]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-mono font-black text-ink-muted uppercase tracking-[0.3em] mb-8">Solution</h4>
              <ul className="space-y-4 text-sm font-medium text-ink-secondary">
                <li><a href="#" className="hover:text-primary transition-colors">For Employers</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">For Universities</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Self-Verify</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Batch API</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-mono font-black text-ink-muted uppercase tracking-[0.3em] mb-8">Resources</h4>
              <ul className="space-y-4 text-sm font-medium text-ink-secondary">
                <li><a href="#" className="hover:text-primary transition-colors">API Docs</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Case Studies</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Support</a></li>
              </ul>
            </div>

            <div className="col-span-2">
              <h4 className="text-[10px] font-mono font-black text-ink-muted uppercase tracking-[0.3em] mb-8">The Engine Room</h4>
              <div className="p-6 rounded-2xl bg-surface-card border border-surface-border space-y-4">
                <div className="flex justify-between items-center text-[10px] font-mono font-bold tracking-widest text-ink-muted">
                  <span>SYSTEM STATUS</span>
                  <span className="text-status-verified flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-status-verified animate-pulse" />
                    OPERATIONAL
                  </span>
                </div>
                <div className="h-1 w-full bg-surface-elevated rounded-full overflow-hidden">
                  <div className="h-full w-full bg-gradient-to-r from-status-verified to-accent-cyan" />
                </div>
                <p className="text-[10px] font-mono text-ink-muted leading-tight">Forensic cluster: US-EAST | AI Latency: 142ms | Database: 24.1M records</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-surface-border">
            <p className="text-[10px] font-mono font-bold text-ink-muted tracking-widest uppercase">&copy; 2026 VERITY INDUSTRIES. ALL TRUTHS RESERVED.</p>
            <div className="flex gap-8 text-[10px] font-mono font-bold text-ink-muted tracking-widest uppercase">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors">Cookies</a>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded bg-surface-card border border-surface-border">
              <span className="text-[10px] font-mono font-bold text-ink-muted tracking-widest">POWERED BY</span>
              <span className="text-[10px] font-mono font-bold text-ink-primary">SQUAD</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
