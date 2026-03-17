"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate login delay
    setTimeout(() => {
      localStorage.setItem('nidana_user', JSON.stringify({
        name: formData.email.split('@')[0],
        role: 'Provider'
      }));
      setLoading(false);
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 liquid-bg animate-in fade-in duration-1000">
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-accent/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-primary/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block group">
            <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-brand-accent to-brand-success tracking-tighter mb-2 group-hover:opacity-80 transition-opacity">
              NidanaAI
            </h1>
          </Link>
          <p className="text-muted-foreground font-bold uppercase tracking-[0.3em] text-[10px]">
            Clinical Authorization Node
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-card/80 backdrop-blur-xl border border-border p-8 sm:p-10 rounded-[2.5rem] shadow-2xl shadow-black/40">
           <div className="mb-8">
              <h2 className="text-2xl font-black text-foreground font-outfit uppercase tracking-tighter mb-2">Welcome Back</h2>
              <p className="text-sm text-muted-foreground font-medium">Authenticate to access the clinical surveillance dashboard.</p>
           </div>

           <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">Provider Email</label>
                 <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    placeholder="doctor@hospital.org"
                    className="w-full bg-background/50 border border-border rounded-2xl px-5 py-4 font-bold text-foreground focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent outline-none transition-all placeholder:text-muted-foreground/40"
                 />
              </div>

              <div className="space-y-2">
                 <div className="flex justify-between items-center ml-2 mr-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Passkey</label>
                    <Link href="#" className="text-[10px] font-bold text-brand-accent hover:underline">Forged Identity?</Link>
                 </div>
                 <input 
                    type="password" 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                    placeholder="••••••••••••"
                    className="w-full bg-background/50 border border-border rounded-2xl px-5 py-4 font-bold text-foreground focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent outline-none transition-all placeholder:text-muted-foreground/40 text-xl tracking-[0.2em]"
                 />
              </div>

              <div className="pt-4 flex flex-col items-center gap-6">
                 <button 
                    type="submit"
                    disabled={loading || !formData.email || !formData.password}
                    className="w-full py-4 bg-foreground text-background rounded-2xl font-black text-sm uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all shadow-glow flex items-center justify-center gap-3 relative overflow-hidden group"
                 >
                    {loading ? (
                       <>
                          <div className="w-4 h-4 border-2 border-background/20 border-t-background rounded-full animate-spin"></div>
                          <span>Authenticating...</span>
                       </>
                    ) : (
                       <>
                          <span className="relative z-10">Access Node</span>
                          <span className="relative z-10 group-hover:translate-x-1 transition-transform">→</span>
                       </>
                    )}
                 </button>

                 <p className="text-xs text-muted-foreground font-medium">
                    New provider? <Link href="/signup" className="text-foreground font-bold hover:underline">Request authorization</Link>
                 </p>
              </div>
           </form>
        </div>
      </div>
    </div>
  );
}
