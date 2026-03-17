"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ 
      name: '', 
      role: 'physician',
      email: '', 
      password: '' 
  });

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate signup success
    setTimeout(() => {
      localStorage.setItem('nidana_user', JSON.stringify({
        name: formData.name,
        role: formData.role
      }));
      setLoading(false);
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 liquid-bg animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-accent/20 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-brand-success/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="w-full max-w-lg relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block group">
            <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-brand-accent to-brand-success tracking-tighter mb-2 group-hover:opacity-80 transition-opacity">
              NidanaAI
            </h1>
          </Link>
          <p className="text-muted-foreground font-bold uppercase tracking-[0.3em] text-[9px]">
            New Identity Registry
          </p>
        </div>

        {/* Signup Form Card */}
        <div className="bg-card/80 backdrop-blur-xl border border-border p-8 sm:p-10 rounded-[2.5rem] shadow-2xl shadow-black/40">
           <div className="mb-8">
              <h2 className="text-2xl font-black text-foreground font-outfit uppercase tracking-tighter mb-2">Request Authorization</h2>
              <p className="text-sm text-muted-foreground font-medium">Register a clinical node identity to access guidelines.</p>
           </div>

           <form onSubmit={handleSignup} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">Full Name</label>
                     <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                        placeholder="Dr. John Doe"
                        className="w-full bg-background/50 border border-border rounded-2xl px-5 py-4 font-bold text-foreground focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent outline-none transition-all placeholder:text-muted-foreground/40"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">Role</label>
                     <select 
                         value={formData.role}
                         onChange={(e) => setFormData({...formData, role: e.target.value})}
                         className="w-full bg-background/50 border border-border rounded-2xl px-5 py-4 font-bold text-foreground focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent outline-none transition-all placeholder:text-muted-foreground/40 appearance-none cursor-pointer"
                     >
                        <option value="physician">Primary Physician</option>
                        <option value="surgeon">Surgeon</option>
                        <option value="nurse">Nurse</option>
                        <option value="resident">Resident</option>
                     </select>
                  </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">Provider Email</label>
                 <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    placeholder="clinical@hospital.org"
                    className="w-full bg-background/50 border border-border rounded-2xl px-5 py-4 font-bold text-foreground focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent outline-none transition-all placeholder:text-muted-foreground/40"
                 />
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">Generate Passkey</label>
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
                    disabled={loading || !formData.email || !formData.password || !formData.name}
                    className="w-full py-4 bg-foreground text-background rounded-2xl font-black text-sm uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all shadow-glow flex items-center justify-center gap-3 relative overflow-hidden group"
                 >
                    {loading ? (
                       <>
                          <div className="w-4 h-4 border-2 border-background/20 border-t-background rounded-full animate-spin"></div>
                          <span>Provisioning Identity...</span>
                       </>
                    ) : (
                       <>
                          <span className="relative z-10">Register Node</span>
                          <span className="relative z-10 group-hover:translate-x-1 transition-transform">→</span>
                       </>
                    )}
                 </button>

                 <p className="text-xs text-muted-foreground font-medium">
                    Pre-existing identity? <Link href="/login" className="text-brand-accent font-bold hover:underline">Access node here.</Link>
                 </p>
              </div>

           </form>
        </div>
      </div>
    </div>
  );
}
