"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api/client';
import Link from 'next/link';

export default function DynamicReportPage() {
  const { id } = useParams();
  const router = useRouter();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReport() {
      try {
        const data = await apiClient.getDiagnosis(id as string);
        setReport(data);
      } catch (err) {
        console.error("Failed to load report", err);
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, [id]);

  const handleArchive = async () => {
    if (!confirm('Are you sure you want to archive this clinical case?')) return;
    try {
      await apiClient.archiveCase(id as string);
      router.push('/dashboard');
    } catch (err) {
      console.error('Failed to archive case', err);
      alert('Failed to archive case. Please try again.');
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[70vh] max-w-2xl mx-auto p-4">
        <div className="w-full flex flex-col items-center justify-center py-32 bg-card border border-border shadow-xl shadow-black/20 rounded-3xl animate-in zoom-in-95 duration-500 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-accent/10 blur-[80px] rounded-full"></div>
          <div className="relative z-10 flex flex-col items-center">
             <div className="w-16 h-16 border-4 border-brand-accent/20 border-t-brand-accent rounded-full animate-spin mb-8 shadow-glow"></div>
             <h2 className="text-2xl font-black font-outfit uppercase tracking-tighter text-foreground mb-4">Synthesizing Evidence</h2>
             <div className="flex items-center space-x-2 text-muted-foreground font-bold uppercase tracking-[0.3em] text-[10px] animate-pulse">
                <span>Gathering Clinical Context</span>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-success"></span>
             </div>
          </div>
        </div>
    </div>
  );
  
  if (!report || report.detail) return (
    <div className="max-w-xl mx-auto text-center py-20 space-y-6">
        <div className="text-2xl">🔍</div>
        <h2 className="text-2xl font-black font-outfit uppercase tracking-tighter">Case Not Found</h2>
        <p className="text-muted-foreground font-medium">Unable to locate the clinical record with ID: {id}</p>
        <Link href="/reports" className="inline-block px-6 py-4 bg-white text-slate-950 rounded-2xl font-black uppercase text-xs tracking-widest transition-all hover:scale-105 active:scale-95">Return to Database</Link>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 p-4">
      {/* Report Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-100 pb-10">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="text-[10px] font-black bg-brand-accent/10 text-brand-accent px-4 py-1.5 rounded-full uppercase tracking-widest border border-brand-accent/20">Protocol Validated</span>
            <span className="text-[10px] font-black bg-brand-success/10 text-brand-success px-4 py-1.5 rounded-full uppercase tracking-widest border border-brand-success/20">Assessment Complete</span>
            <span className="text-[10px] font-black bg-slate-100 text-muted-foreground px-4 py-1.5 rounded-full uppercase tracking-widest">ID: {id}</span>
          </div>
          <h1 className="text-2xl font-black tracking-tighter font-outfit uppercase text-foreground">Evidence Report</h1>
        </div>
        <div className="bg-card border border-border overflow-hidden relative shadow-2xl shadow-brand-success/10 px-8 py-5 rounded-3xl border-brand-success/30 w-full md:w-80 group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-success/10 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-end mb-4">
               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Confidence Match</p>
               <p className="text-3xl font-black text-brand-success font-outfit tracking-tighter leading-none drop-shadow-sm">{report.diagnostic_confidence}</p>
            </div>
            <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden shadow-inner">
               <div className="h-full bg-brand-success rounded-full shadow-[0_0_10px_rgba(var(--brand-success),0.5)]" style={{ width: report.diagnostic_confidence || '0%' }}></div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">
          {/* Main Diagnosis */}
          <div className="bg-card border border-border overflow-hidden relative shadow-xl shadow-black/20 rounded-3xl p-8 border-border relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 text-2xl opacity-10 grayscale">{report.diagnosis?.includes('High') ? '⚠️' : '✅'}</div>
             <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4">AI Heuristic Outcome</h3>
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
               <p className="text-2xl font-black text-foreground font-outfit uppercase tracking-tighter leading-none">{report.diagnosis}</p>
               <div className="flex space-x-3 print:hidden">
                 <button className="px-5 py-2.5 bg-brand-success/10 text-brand-success rounded-xl font-bold text-xs hover:bg-brand-success hover:text-white transition-colors border border-brand-success/20">Verify</button>
                 <button className="px-5 py-2.5 bg-brand-danger/10 text-brand-danger rounded-xl font-bold text-xs hover:bg-brand-danger hover:text-white transition-colors border border-brand-danger/20">Flag</button>
               </div>
             </div>
             
             <div className="space-y-6">
                <h4 className="font-black text-xs uppercase tracking-[0.2em] text-muted-foreground flex items-center space-x-2">
                   <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
                   <span>Clinical Logic Trace</span>
                </h4>
                <div className="bg-secondary/30 border border-border p-6 rounded-2xl text-base sm:text-lg leading-relaxed text-muted-foreground font-medium font-outfit shadow-inner">
                  {report.management_plan}
                </div>
             </div>

             {/* Recommended Actions */}
             {report.recommended_tests && report.recommended_tests.length > 0 && (
                <div className="mt-10 space-y-6">
                   <h4 className="font-black text-xs uppercase tracking-[0.2em] text-muted-foreground flex items-center space-x-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-brand-warning"></span>
                     <span>Required Next Steps</span>
                   </h4>
                   <div className="grid gap-3">
                     {report.recommended_tests.map((test: string, i: number) => (
                        <div key={i} className="flex items-start space-x-4 p-4 rounded-2xl border border-border bg-card hover:bg-secondary/50 transition-colors group">
                           <div className="w-5 h-5 mt-0.5 rounded border-2 border-muted-foreground/30 flex items-center justify-center group-hover:border-brand-accent transition-colors"></div>
                           <span className="font-bold text-sm text-foreground">{test}</span>
                        </div>
                     ))}
                   </div>
                </div>
             )}
             
             {/* Clinical Annotations (Human-in-the-loop) */}
             <div className="mt-10 space-y-4">
                <div className="flex items-center justify-between">
                   <h4 className="font-black text-xs uppercase tracking-[0.2em] text-muted-foreground">Attending Physician Notes</h4>
                   <span className="text-[10px] font-bold text-brand-accent bg-brand-accent/10 px-3 py-1 rounded-full print:hidden">Optional</span>
                </div>
                <textarea 
                  className="w-full bg-card border border-border rounded-3xl p-6 text-foreground placeholder-muted-foreground/50 resize-y min-h-[120px] focus:outline-none focus:ring-2 focus:ring-brand-accent/50 transition-all font-medium"
                  placeholder="Add clinical context, differential considerations, or surgical planning notes here. These will be included in the final exported record."
                ></textarea>
                <div className="hidden print:block border-b border-foreground/20 w-full mt-10"></div>
             </div>
          </div>

          {/* Guideline Tracking */}
          <div className="bg-card border border-border overflow-hidden relative shadow-xl shadow-black/20 rounded-3xl p-6 border-border">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black font-outfit uppercase tracking-tighter">Consensus References</h3>
                <span className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-xl">📚</span>
             </div>
             <div className="flex flex-wrap gap-3">
                {report.guideline_references?.map((ref: string, i: number) => (
                  <Link href={`/guidelines?query=${encodeURIComponent(ref)}`} key={i} className="text-[10px] font-black text-brand-accent bg-brand-accent/5 px-6 py-3 rounded-full border border-brand-accent/10 uppercase tracking-widest hover:bg-brand-accent hover:text-white transition-colors cursor-pointer group flex items-center print:hidden">
                    <span>{ref}</span>
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                ))}
                {/* Print version of refs */}
                <div className="hidden print:flex flex-wrap gap-3">
                  {report.guideline_references?.map((ref: string, i: number) => (
                    <span key={i} className="text-[10px] font-black text-brand-accent bg-brand-accent/5 px-6 py-3 rounded-full border border-brand-accent/10 uppercase tracking-widest">{ref}</span>
                  ))}
                </div>
             </div>
          </div>
        </div>

        <div className="space-y-8 print:hidden">
           <div className="bg-card border border-border overflow-hidden relative shadow-xl shadow-black/20 rounded-3xl p-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-10">Case Management</h3>
              <div className="grid gap-4">
                 <button onClick={() => window.print()} className="w-full py-2.5 bg-foreground text-background rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-glow hover:opacity-90">Export PDF Report</button>
                 <button onClick={handleArchive} className="w-full py-2.5 bg-card border border-border text-foreground rounded-xl font-black text-sm uppercase tracking-widest transition-all hover:bg-secondary">Archive Case</button>
              </div>
           </div>
           
           <div className="p-8 rounded-2xl bg-brand-accent/5 border border-brand-accent/10 text-brand-accent relative overflow-hidden group">
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-brand-accent/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
              <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-3">Model Insight</h4>
              <p className="text-[11px] font-bold leading-relaxed opacity-70">
                Reasoning generated via Llama-3.1 clinical node. Validation against Metsemakers (2018) Fracture-Related Infection Consensus.
              </p>
           </div>
           
           <Link href="/dashboard" className="block text-center text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] hover:text-foreground transition-colors">
              Return to Surveillance Hub
           </Link>
        </div>
      </div>

      {/* --- PRINT ONLY METADATA --- */}
      <div className="hidden print:block fixed bottom-0 left-0 w-full text-center py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-t border-border mt-10">
        CONFIDENTIAL MEDICAL RECORD • GENERATED BY NIDANA AI • PAGE 1 OF 1
        <br />
        <span className="opacity-50 mt-1 block">Diagnosis support tool. Not a replacement for clinical judgment.</span>
      </div>
    </div>
  );
}
