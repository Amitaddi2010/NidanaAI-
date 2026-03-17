"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expandedProtocol, setExpandedProtocol] = useState<number | null>(null);

  const protocolsData = [
    { 
        title: "Metsemakers 2018", 
        status: "Active", 
        desc: "Fracture-Related Infection (FRI) consensus guidelines. Applies confirmatory tests (sinus tract, purulence, positive cultures) and suggestive criteria (clinical signs, elevated CRP/WBC, radiological signs).",
    },
    { 
        title: "MSIS Criteria", 
        status: "Active", 
        desc: "Musculoskeletal Infection Society definitions for Periprosthetic Joint Infection (PJI). Evaluates major criteria (sinus tract, identical pathogens) against minor criteria scoring (elevated CRP, ESR, synovial fluid WBC).",
    },
    { 
        title: "Groq LLM Llama-3.1", 
        status: "Healthy", 
        desc: "High-speed reasoning engine processing clinical logic. Connects to RAG vectors for instant medical retrieval and executes deterministic rule-based algorithms to compute the diagnostic confidence score.",
    }
  ];

  useEffect(() => {
    async function loadData() {
      try {
        let providerId = "Anonymous";
        const stored = localStorage.getItem('nidana_user');
        if (stored) {
          try { providerId = JSON.parse(stored).name; } catch(e) {}
        }
        
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
        const statsRes = await fetch(`${apiUrl}/stats?provider_id=${encodeURIComponent(providerId)}`);
        if (!statsRes.ok) throw new Error("API Offline");
        const statsData = await statsRes.json();
        setStats([
          { label: 'Active Surveillance', value: statsData.active_cases || 0, color: 'brand-accent', icon: '📡' },
          { label: 'Requires Review', value: statsData.pending_diagnosis || 0, color: 'brand-warning', icon: '⚠️' },
          { label: 'Case History', value: statsData.total_cases || 0, color: 'brand-primary', icon: '📂' },
        ]);
      } catch (err) {
        console.error("Failed to fetch dash stats", err);
        setError(true);
        // Fallback for demo if API is truly unreachable during polish
        setStats([
            { label: 'Active Surveillance', value: '--', color: 'brand-accent', icon: '📡' },
            { label: 'Requires Review', value: '--', color: 'brand-warning', icon: '⚠️' },
            { label: 'Case History', value: '--', color: 'brand-primary', icon: '📂' },
        ]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] liquid-bg">
      <div className="w-16 h-16 border-4 border-brand-accent/20 border-t-brand-accent rounded-full animate-spin mb-4"></div>
      <div className="text-muted-foreground font-bold animate-pulse text-sm uppercase tracking-[0.3em]">Calibrating Clinical Engine</div>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 p-4 md:p-8">
      {/* Welcome Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-xl font-black tracking-tighter text-foreground font-outfit uppercase">
            Surveillance
          </h1>
          <p className="text-muted-foreground mt-2 font-medium max-w-md">
            Real-time monitoring of clinical cases and diagnostic reasoning status.
          </p>
        </div>
        <Link 
          href="/new-patient"
          className="group relative px-6 py-2.5 bg-foreground text-background rounded-xl font-black text-lg overflow-hidden transition-all hover:opacity-90 shadow-glow"
        >
          <span className="relative z-10 block">New Clinical Entry <span className="text-brand-accent">+</span></span>
        </Link>
      </section>

      {/* Simplified Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat: any) => (
          <div key={stat.label} className="bg-card border border-border overflow-hidden relative shadow-xl shadow-black/20 p-6 rounded-3xl border-border hover:border-brand-accent/30 transition-all duration-500 group">
            <div className="flex justify-between items-center mb-8">
              <span className="text-2xl bg-secondary w-10 h-10 flex items-center justify-center rounded-2xl shadow-inner border border-border">{stat.icon}</span>
              <div className={`w-3 h-3 rounded-full bg-${stat.color} animate-pulse`}></div>
            </div>
            <p className="text-xl font-black tracking-tighter font-outfit text-foreground group-hover:text-brand-accent transition-colors">{stat.value}</p>
            <p className="text-xs text-muted-foreground font-black mt-3 uppercase tracking-[0.2em]">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Action Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
         <div className="lg:col-span-3 bg-card border border-border overflow-hidden relative shadow-xl shadow-black/20 rounded-3xl p-6 border-border">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-10">
                <h3 className="text-2xl font-black font-outfit uppercase tracking-tighter">Clinical Protocols</h3>
                <span className="text-[10px] font-black bg-brand-accent/10 text-brand-accent px-4 py-1.5 rounded-full uppercase tracking-widest self-start sm:self-auto">Live Engine</span>
            </div>
            <div className="space-y-6">
               {protocolsData.map((item, i) => (
                   <div 
                     key={i} 
                     onClick={() => setExpandedProtocol(expandedProtocol === i ? null : i)}
                     className={`flex flex-col p-6 rounded-2xl border transition-all cursor-pointer group ${expandedProtocol === i ? 'bg-secondary shadow-lg shadow-black/10 border-brand-accent/30' : 'bg-secondary/30 border-border hover:bg-secondary'}`}
                   >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center space-x-4">
                             <div className={`w-10 h-10 border rounded-xl shadow-sm flex shrink-0 items-center justify-center font-bold text-xs transition-colors ${expandedProtocol === i ? 'bg-brand-accent text-white border-brand-accent' : 'bg-background border-border text-foreground'}`}>0{i+1}</div>
                             <span className="font-bold text-foreground lead-tight">{item.title}</span>
                          </div>
                          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-6 pl-14 sm:pl-0">
                             <span className="text-[10px] font-black text-brand-success uppercase tracking-widest">{item.status}</span>
                             <span className={`text-muted-foreground transition-all duration-300 ${expandedProtocol === i ? 'rotate-90 text-brand-accent' : 'group-hover:text-brand-accent group-hover:translate-x-1'}`}>→</span>
                          </div>
                      </div>
                      
                      {expandedProtocol === i && (
                          <div className="mt-6 pt-6 border-t border-border/50 animate-in fade-in slide-in-from-top-2 duration-300">
                              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                                  {item.desc}
                              </p>
                          </div>
                      )}
                   </div>
               ))}
            </div>
         </div>
         
         <div className="lg:col-span-2 bg-brand-accent rounded-3xl p-6 text-white relative overflow-hidden group shadow-2xl shadow-brand-accent/20">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-secondary rounded-full blur-[80px] group-hover:scale-125 transition-transform duration-1000"></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-xl mb-8">💡</div>
                    <h3 className="text-xl font-black font-outfit uppercase tracking-tighter leading-none mb-4">Smart <br/>Knowledge</h3>
                    <p className="text-white/70 font-medium text-sm leading-relaxed max-w-xs">
                        Query international guidelines directly. Our RAG engine provides instant, evidence-backed answers.
                    </p>
                </div>
                <Link href="/guidelines" className="mt-12 py-2.5 bg-white text-brand-accent rounded-[24px] font-black text-center shadow-xl hover:scale-105 transition-transform active:scale-95">
                    Launch Hub
                </Link>
            </div>
         </div>
      </div>
    </div>
  );
}
