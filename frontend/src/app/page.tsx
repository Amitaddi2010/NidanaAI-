"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [user, setUser] = useState<{name: string, role: string} | null>(null);

  const handleLogout = () => {
    localStorage.removeItem('nidana_user');
    setUser(null);
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem('nidana_user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch(e) {}
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-brand-accent/30 selection:text-white">
      
      {/* Top Banner (VoidZero style announcement) */}
      <div className="relative w-full overflow-hidden bg-zinc-950 border-b border-border z-50">
        <Link href="/signup" className="group block relative w-full no-underline text-white">
          <div className="relative z-10 w-full h-10 flex px-4">
            <div className="flex items-center justify-center gap-2 w-full max-w-3xl mx-auto px-4">
              <span className="text-xs font-medium font-mono leading-snug tracking-wide uppercase whitespace-nowrap overflow-hidden text-ellipsis text-shadow-md/50">
                Announcing NidanaAI 2.0: Unified Clinical Intelligence.
              </span>
              <svg className="shrink-0 transition-transform duration-200 group-hover:translate-x-1" width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 6L14 10L10 14" stroke="white" strokeWidth="1.2" strokeLinejoin="round"></path>
                <path d="M14 10L6 10" stroke="white" strokeWidth="1.2" strokeLinejoin="round"></path>
              </svg>
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <header className="px-6 py-5 lg:py-7 flex items-center justify-between relative z-40 bg-background border-b border-border">
        <div className="flex items-center gap-10">
          <Link href="/" className="font-outfit font-black tracking-tighter text-2xl flex items-center gap-2">
             <div className="w-8 h-8 bg-foreground flex items-center justify-center rounded-lg shadow-glow">
                <span className="text-background font-black text-sm">N</span>
             </div>
             NidanaAI
          </Link>
          <nav className="hidden md:block">
            <ul className="flex gap-8 text-sm font-semibold text-muted-foreground">
              <li><Link href="#features" className="hover:text-foreground transition-colors">Features</Link></li>
              <li><Link href="#protocols" className="hover:text-foreground transition-colors">Protocols</Link></li>
              <li><Link href="/guidelines" className="hover:text-foreground transition-colors">Knowledge Hub</Link></li>
            </ul>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest hidden sm:block">
                Node: {user.name}
              </span>
              <button 
                onClick={handleLogout}
                className="text-xs font-bold text-muted-foreground hover:text-brand-danger uppercase tracking-widest transition-colors hidden sm:block"
                title="Disconnect Node"
              >
                Logout
              </button>
              <Link 
                href="/dashboard"
                className="px-6 py-2 bg-brand-accent text-white rounded-lg font-bold text-sm hover:opacity-90 transition-opacity shadow-glow"
              >
                Dashboard
              </Link>
            </div>
          ) : (
            <Link 
              href="/login"
              className="px-6 py-2 bg-foreground text-background rounded-lg font-bold text-sm hover:opacity-90 transition-opacity shadow-lg"
            >
              Sign In
            </Link>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative pt-20 pb-32 flex flex-col items-center justify-start gap-10 px-5 border-b border-border bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-background to-background">
        <div className="flex flex-col justify-start items-center gap-6 max-w-3xl text-center">
          
          <div className="px-3 py-1.5 bg-card rounded shadow-xl border border-border flex items-center gap-2 font-mono font-medium text-xs tracking-tighter mb-4">
            <div className="p-0.5 bg-brand-success/20 rounded-sm inline-flex items-center">
              <div className="size-1.5 bg-brand-success rounded-full animate-pulse"></div>
            </div>
            <span className="text-muted-foreground">clinical engine</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">online</span>
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter text-foreground font-outfit uppercase leading-[0.9]">
             The Clinical <br/>
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-brand-success">Intelligence</span><br/>
             Platform
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl text-balance font-medium mt-4">
            Making orthopedic decision-making faster, safer, and completely aligned with international consensus guidelines.
          </p>

          <div className="flex gap-4 mt-6">
             {user ? (
               <Link href="/dashboard" className="px-8 py-3 bg-brand-accent text-white rounded-lg font-bold shadow-glow hover:opacity-90 transition-all uppercase tracking-widest text-sm">
                  Access Mission Control
               </Link>
             ) : (
               <>
                 <Link href="/signup" className="px-8 py-3 bg-brand-accent text-white rounded-lg font-bold shadow-glow hover:opacity-90 transition-all uppercase tracking-widest text-sm">
                    Create Identity
                 </Link>
                 <Link href="/login" className="px-8 py-3 bg-card border border-border text-foreground rounded-lg font-bold hover:border-brand-accent/50 transition-all uppercase tracking-widest text-sm">
                    Provider Login
                 </Link>
               </>
             )}
          </div>
        </div>
        
        {/* Glow effect back */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-64 bg-brand-accent/10 blur-[100px] pointer-events-none rounded-full"></div>
      </div>

      {/* Trusted By Section (VoidZero style) */}
      <section className="border-b border-border py-12 flex flex-col items-center justify-center gap-6 bg-card text-center">
        <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest">Integrating guidelines from</p>
        <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale select-none">
           <span className="text-xl font-black font-outfit uppercase tracking-widest">Metsemakers</span>
           <span className="text-xl font-black font-outfit uppercase tracking-widest">MSIS</span>
           <span className="text-xl font-black font-outfit uppercase tracking-widest">EBJIS</span>
           <span className="text-xl font-black font-outfit uppercase tracking-widest">IDSA</span>
        </div>
      </section>

      {/* Features Showcase inside a grid layout */}
      <section id="features" className="bg-background">
        <div className="px-6 md:px-10 py-16 border-b border-border">
           <span className="text-muted-foreground text-xs font-medium font-mono uppercase tracking-wide">Infrastructure</span>
           <h2 className="text-3xl font-black text-foreground font-outfit uppercase tracking-tighter mt-4">Clinical Toolchain</h2>
           <p className="max-w-xl text-muted-foreground mt-2 font-medium">We provide a unified suite of tools designed specifically for modern surgical environments and infectious disease management.</p>
        </div>

        {/* Feature 1 */}
        <div className="grid lg:grid-cols-2 w-full border-b border-border shadow-xl shadow-black/20">
          <div className="flex flex-col p-10 justify-center gap-10 lg:gap-20 bg-card">
            <div className="flex flex-col gap-5 max-w-sm">
              <span className="text-brand-accent text-xs font-mono uppercase tracking-widest">Dashboard</span>
              <h4 className="text-3xl font-black text-foreground font-outfit uppercase tracking-tighter">Unified Mission Control</h4>
              <p className="text-muted-foreground text-base text-pretty">
                The entry point to your clinical workflow. Monitor active surveillance, track requires review cases, and launch new diagnostic protocols instantly.
              </p>
              <Link href={user ? "/dashboard" : "/login"} className="px-6 py-3 bg-foreground text-background rounded-lg uppercase text-xs font-bold w-fit mt-4 hover:opacity-90 transition-opacity shadow-glow">Access Mission Control</Link>
            </div>
          </div>
          <div className="flex flex-col min-h-[24rem] bg-secondary relative overflow-hidden p-10 lg:p-20 items-center justify-center group">
             <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/20 to-transparent group-hover:scale-110 transition-transform duration-1000"></div>
             <div className="w-full max-w-sm bg-card border border-border shadow-2xl shadow-black/50 rounded-2xl p-6 relative z-10 flex flex-col gap-5 hover:-translate-y-2 transition-transform duration-500">
                 {/* Window Controls */}
                 <div className="w-full flex items-center mb-2"> 
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 mr-2 shadow-glow"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 mr-2 shadow-glow"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-glow"></span> 
                 </div>
                 
                 {/* Mock Stats Grid */}
                 <div className="grid grid-cols-2 gap-3">
                    <div className="h-16 bg-secondary/50 rounded-xl border border-white/5 flex flex-col p-3 justify-center relative overflow-hidden">
                       <div className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mb-1 z-10">Active Cases</div>
                       <div className="text-xl font-black text-foreground z-10">142</div>
                       <div className="absolute right-0 bottom-0 w-12 h-12 bg-brand-accent/20 blur-xl"></div>
                    </div>
                    <div className="h-16 bg-secondary/50 rounded-xl border border-white/5 flex flex-col p-3 justify-center relative overflow-hidden">
                       <div className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mb-1 z-10">Infected</div>
                       <div className="text-xl font-black text-brand-danger z-10">12</div>
                       <div className="absolute right-0 bottom-0 w-12 h-12 bg-brand-danger/20 blur-xl"></div>
                    </div>
                 </div>

                 {/* Mock Activity List */}
                 <div className="space-y-2 mt-2">
                    <div className="w-full h-10 bg-secondary/30 rounded-lg flex items-center px-3 gap-3 border border-white/5">
                        <div className="w-2 h-2 rounded-full bg-brand-success animate-pulse"></div>
                        <div className="h-2 w-24 bg-muted/30 rounded-full"></div>
                        <div className="h-2 w-12 bg-muted/10 rounded-full ml-auto"></div>
                    </div>
                    <div className="w-full h-10 bg-secondary/30 rounded-lg flex items-center px-3 gap-3 border border-white/5">
                        <div className="w-2 h-2 rounded-full bg-brand-danger animate-pulse"></div>
                        <div className="h-2 w-32 bg-muted/30 rounded-full"></div>
                        <div className="h-2 w-8 bg-muted/10 rounded-full ml-auto"></div>
                    </div>
                    <div className="w-full h-10 bg-secondary/30 rounded-lg flex items-center px-3 gap-3 border border-white/5">
                        <div className="w-2 h-2 rounded-full bg-brand-warning animate-pulse delay-150"></div>
                        <div className="h-2 w-20 bg-muted/30 rounded-full"></div>
                        <div className="h-2 w-14 bg-muted/10 rounded-full ml-auto"></div>
                    </div>
                 </div>
             </div>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="grid lg:grid-cols-2 w-full border-b border-border shadow-xl shadow-black/20 lg:flex-row-reverse">
          <div className="flex flex-col p-10 justify-center gap-10 lg:gap-20 bg-background lg:order-last">
            <div className="flex flex-col gap-5 max-w-sm">
              <span className="text-brand-success text-xs font-mono uppercase tracking-widest">Knowledge Hub</span>
              <h4 className="text-3xl font-black text-foreground font-outfit uppercase tracking-tighter">Interactive Consensus</h4>
              <p className="text-muted-foreground text-base text-pretty">
                Direct query access to a RAG-indexed database of orthopedic guidelines. Get evidence-backed answers to your clinical questions in real-time.
              </p>
              <Link href={user ? "/guidelines" : "/signup"} className="px-6 py-3 bg-foreground text-background rounded-lg uppercase text-xs font-bold w-fit mt-4 hover:opacity-90 transition-opacity shadow-glow">{user ? "Ask AI Node" : "Register to Access"}</Link>
            </div>
          </div>
          <div className="flex flex-col min-h-[24rem] bg-[hsl(240_5%_8%)] relative overflow-hidden p-10 lg:p-20 items-center justify-center group">
             <div className="absolute inset-0 bg-gradient-to-bl from-brand-success/20 to-transparent group-hover:scale-110 transition-transform duration-1000"></div>
             <div className="w-full max-w-md bg-card border border-border shadow-2xl shadow-black/50 rounded-3xl p-6 relative z-10 flex flex-col gap-5 hover:-translate-y-2 transition-transform duration-500">
                 
                 {/* Chat Mock */}
                 <div className="flex items-center space-x-3 mb-2">
                    <div className="w-6 h-6 rounded-md bg-brand-success/10 border border-brand-success/20 flex items-center justify-center">
                       <div className="w-1.5 h-1.5 rounded-full bg-brand-success animate-pulse"></div>
                    </div>
                    <span className="text-[10px] font-black uppercase text-brand-success tracking-widest">NidanaAI Node</span>
                 </div>
                 
                 <div className="self-start w-5/6 p-4 bg-secondary/40 rounded-2xl rounded-tl-sm text-sm text-muted-foreground border border-border shadow-md">
                     Hello. I am the NidanaAI Clinical Node. I am calibrated against international consensus guidelines for orthopedic infections.
                 </div>

                 <div className="self-end mt-4 mb-2 flex flex-col items-end">
                     <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest mb-2 px-2">Clinician</span>
                     <div className="p-4 bg-card border border-border rounded-2xl rounded-tr-sm text-sm text-foreground shadow-xl">
                         What are the major criteria for PJI?
                     </div>
                 </div>

                 {/* Input Mock */}
                 <div className="mt-4 pt-4 border-t border-border flex items-center gap-3">
                    <div className="flex-1 h-10 bg-secondary/50 rounded-xl border border-white/5 flex items-center px-4">
                       <span className="w-0.5 h-4 bg-brand-success animate-pulse mr-2"></span>
                       <span className="text-xs text-muted-foreground/30 font-medium">Synthesizing...</span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-brand-success flex items-center justify-center shadow-glow">
                        <span className="text-white text-xs">→</span>
                    </div>
                 </div>

             </div>
          </div>
        </div>

      </section>

      {/* Protocols Section */}
      <section id="protocols" className="py-24 bg-card border-b border-border text-center flex flex-col items-center">
         <span className="text-muted-foreground text-xs font-medium font-mono uppercase tracking-wide">Methodology</span>
         <h2 className="text-4xl md:text-5xl font-black text-foreground font-outfit uppercase tracking-tighter mt-6 max-w-3xl">Clinical Logic & Protocols</h2>
         <p className="text-muted-foreground text-lg mt-6 max-w-2xl text-balance">
            Our platform doesn't guess. It uses deterministic heuristics combined with AI summarization to validate patient parameters against established infection criteria.
         </p>
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full px-6 mt-16 text-left">
            <div className="p-8 border border-border rounded-xl bg-background shadow-lg hover:-translate-y-1 transition-transform">
               <h3 className="text-xl font-bold font-outfit text-foreground mb-4">1. Data Ingestion</h3>
               <p className="text-muted-foreground text-sm leading-relaxed">Securely parse operative reports, lab values (CRP, ESR, WBC), and microbiological cultures into structured clinical parameters.</p>
            </div>
            <div className="p-8 border border-border rounded-xl bg-background shadow-lg hover:-translate-y-1 transition-transform">
               <h3 className="text-xl font-bold font-outfit text-foreground mb-4">2. Rule Evaluation</h3>
               <p className="text-muted-foreground text-sm leading-relaxed">Apply major and minor criteria as defined by Metsemakers 2018. Confirmatory sinus tracts or two positive cultures immediately flag as infected.</p>
            </div>
            <div className="p-8 border border-border rounded-xl bg-background shadow-lg hover:-translate-y-1 transition-transform">
               <h3 className="text-xl font-bold font-outfit text-foreground mb-4">3. Evidence Synthesis</h3>
               <p className="text-muted-foreground text-sm leading-relaxed">Generate a human-readable PDF report summarizing the logic trace, diagnostic confidence score, and recommended next steps.</p>
            </div>
         </div>
      </section>

      {/* About Section */}
      <section className="bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-zinc-900 via-background to-background py-32 text-center border-b border-border flex flex-col items-center px-6">
         <h2 className="text-4xl md:text-6xl font-black text-foreground font-outfit tracking-tighter uppercase mb-8 max-w-4xl text-balance leading-tight">
            Designed for <span className="text-brand-accent">Surgeons.</span><br/> Built for <span className="text-brand-success">Precision.</span>
         </h2>
         <p className="text-muted-foreground max-w-2xl text-lg font-medium">
            NidanaAI is on a mission to bring advanced, evidence-based decision support directly to the point of care. Say goodbye to ambiguity in complex orthopedic infection cases.
         </p>
         <Link href={user ? "/dashboard" : "/signup"} className="mt-10 px-8 py-4 bg-foreground text-background font-bold uppercase tracking-widest text-sm rounded-lg hover:opacity-90 shadow-glow transition-opacity">{user ? "Launch Dashboard" : "Provision Your Node"}</Link>
      </section>

      {/* Footer */}
      <footer className="py-12 flex flex-col items-center justify-center border-t border-border bg-card">
         <p className="text-muted-foreground font-mono text-[10px] tracking-[0.3em] uppercase">
            NidanaAI CDSS • 2026
         </p>
      </footer>

    </div>
  );
}
