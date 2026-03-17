"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api/client';

export default function NewPatientPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    sex: 'Male',
    hospitalId: `MRN-${Math.floor(Math.random() * 9000) + 1000}`,
    symptoms: {} as Record<string, boolean>
  });
  const [caseId, setCaseId] = useState<number | null>(null);

  const startAnalysis = async () => {
    setLoading(true);
    try {
      let providerId = "Anonymous";
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('nidana_user');
        if (stored) {
          try { providerId = JSON.parse(stored).name; } catch(e) {}
        }
      }

      // Create Patient & Case in one go if possible, or sequential
      const res = await apiClient.createPatient({
        external_id: formData.hospitalId,
        provider_id: providerId,
        age: Number(formData.age),
        sex: formData.sex,
        comorbidities: []
      });
      
      if (res.case_id) {
          setCaseId(res.case_id);
          // Auto-submit symptoms if any selected
          await apiClient.submitSymptoms(res.case_id.toString(), formData.symptoms);
          setStep(2); // Success/Redirect Step
      }
    } catch (err) {
      console.error("Clinical submission failed", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSymptom = (id: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: { ...prev.symptoms, [id]: !prev.symptoms[id] }
    }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in slide-in-from-bottom-8 duration-700 p-4">
      {/* Header */}
      <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
            <h1 className="text-xl font-black tracking-tighter font-outfit uppercase text-foreground">Entry</h1>
            <p className="text-muted-foreground font-medium mt-1">New clinical surveillance case.</p>
        </div>
        <Link href="/dashboard" className="text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors self-end sm:self-auto">← Cancel</Link>
      </section>

      {step === 1 && !loading && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left: Identification */}
            <div className="lg:col-span-2 space-y-8">
                <div className="bg-card border border-border overflow-hidden relative shadow-xl shadow-black/20 p-6 rounded-3xl border-border space-y-8">
                    <h2 className="text-2xl font-black font-outfit uppercase tracking-tighter">Patient</h2>
                    
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">ID/MRN</label>
                            <input 
                                type="text"
                                value={formData.hospitalId}
                                readOnly
                                className="w-full bg-card border border-border rounded-2xl px-5 py-4 font-bold text-muted-foreground cursor-not-allowed"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Age</label>
                            <input 
                                type="number"
                                value={formData.age}
                                onChange={(e) => setFormData({...formData, age: e.target.value})}
                                placeholder="Patient's age"
                                className="w-full bg-card border border-border rounded-2xl px-5 py-4 font-bold text-foreground focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent outline-none transition-all placeholder:text-muted-foreground/80"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Sex</label>
                            <div className="flex gap-2">
                                {['Male', 'Female', 'Other'].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setFormData({...formData, sex: s})}
                                        className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all ${
                                            formData.sex === s ? 'bg-foreground text-background shadow-glow' : 'bg-card text-muted-foreground border border-border'
                                        }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Clinical Indicators */}
            <div className="lg:col-span-3">
                <div className="bg-card border border-border overflow-hidden relative shadow-xl shadow-black/20 p-6 rounded-3xl border-border">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-8 sm:mb-10">
                        <h2 className="text-2xl font-black font-outfit uppercase tracking-tighter text-foreground">Clinical Indicators</h2>
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Select All Present</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { id: 'sinus', label: 'Sinus Tract', desc: 'Direct communication with bone', icon: '🕳️' },
                            { id: 'discharge', label: 'Pus/Discharge', desc: 'Opaque wound drainage', icon: '💧' },
                            { id: 'pain', label: 'Chronic Pain', desc: 'Persistent local discomfort', icon: '⚡' },
                            { id: 'fever', label: 'Febrile State', desc: 'Systemic temperature >38.3', icon: '🌡️' },
                            { id: 'healing', label: 'Poor Healing', desc: 'Delayed surgical wound closure', icon: '⏳' },
                            { id: 'redness', label: 'Erythema', desc: 'Localized inflammation', icon: '🔴' }
                        ].map((indicator) => (
                            <div 
                                key={indicator.id}
                                onClick={() => toggleSymptom(indicator.id)}
                                className={`p-6 rounded-3xl border transition-all cursor-pointer group flex items-start space-x-4 ${
                                    formData.symptoms[indicator.id] ? 'bg-brand-accent/5 border-brand-accent shadow-inner' : 'bg-card border-border hover:bg-secondary hover:border-border shadow-sm'
                                }`}
                            >
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm transition-all ${
                                    formData.symptoms[indicator.id] ? 'bg-brand-accent text-white' : 'bg-secondary'
                                }`}>
                                    {indicator.icon}
                                </div>
                                <div>
                                    <p className={`font-black uppercase tracking-tight text-sm ${formData.symptoms[indicator.id] ? 'text-brand-accent' : 'text-foreground'}`}>{indicator.label}</p>
                                    <p className="text-[10px] font-bold text-muted-foreground mt-0.5 leading-tight">{indicator.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button 
                        onClick={startAnalysis}
                        disabled={loading || !formData.age}
                        className={`w-full mt-10 py-3 rounded-3xl font-black text-xl uppercase tracking-widest transition-all ${
                            loading ? 'bg-secondary text-white/30 cursor-wait' : 'bg-brand-accent text-white shadow-2xl shadow-brand-accent/30 hover:scale-[1.02] active:scale-95'
                        }`}
                    >
                        {loading ? 'Consulting Guidelines...' : 'Generate AI Diagnosis'}
                    </button>
                </div>
            </div>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-32 bg-card border border-border shadow-xl shadow-black/20 rounded-3xl animate-in zoom-in-95 duration-500 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-accent/10 blur-[80px] rounded-full"></div>
          <div className="relative z-10 flex flex-col items-center">
             <div className="w-16 h-16 border-4 border-brand-accent/20 border-t-brand-accent rounded-full animate-spin mb-8 shadow-glow"></div>
             <h2 className="text-2xl font-black font-outfit uppercase tracking-tighter text-foreground mb-4">Synthesizing Guidelines</h2>
             <div className="flex items-center space-x-2 text-muted-foreground font-bold uppercase tracking-[0.3em] text-[10px] animate-pulse">
                <span>Running deterministic analysis</span>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-success"></span>
             </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="max-w-2xl mx-auto text-center py-20 animate-in zoom-in-95 duration-700">
            <div className="w-24 h-24 bg-brand-success text-white rounded-2xl flex items-center justify-center text-2xl mx-auto mb-10 shadow-3xl shadow-brand-success/20 animate-bounce">
              ✓
            </div>
            <h2 className="text-xl font-black font-outfit uppercase tracking-tighter text-foreground mb-6">Case Registered</h2>
            <p className="text-muted-foreground font-medium text-lg leading-relaxed max-w-sm mx-auto">
              Heuristic analysis complete. The diagnostic report is now available for review.
            </p>
            <div className="mt-12">
              <Link 
                href={`/reports/${caseId}`}
                className="inline-block px-8 py-3 bg-foreground text-background rounded-3xl font-black text-xl uppercase tracking-widest hover:opacity-90 shadow-glow transition-all active:scale-95"
              >
                View Report
              </Link>
            </div>
        </div>
      )}
    </div>
  );
}
