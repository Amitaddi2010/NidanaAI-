"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api/client';

export default function ReportsHistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await apiClient.fetchPatients();
        setHistory(data);
      } catch (err) {
        console.error("Failed to fetch history", err);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh]">
            <div className="w-16 h-16 border-4 border-brand-accent/20 border-t-brand-accent rounded-full animate-spin mb-4 shadow-glow"></div>
            <div className="text-muted-foreground font-bold animate-pulse text-sm uppercase tracking-[0.3em]">Loading Clinical Database...</div>
        </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-top-4 duration-700 p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tighter font-outfit uppercase text-foreground">Patient Records</h1>
          <p className="text-muted-foreground mt-1 text-sm">Historical diagnostic reasoning and clinical entries.</p>
        </div>
        <Link href="/new-patient" className="px-6 py-2.5 bg-foreground text-background rounded-xl text-sm font-black shadow-glow hover:opacity-90 transition-all uppercase tracking-widest w-full sm:w-auto text-center">
          New Entry +
        </Link>
      </div>

      <div className="bg-card border border-border overflow-hidden relative shadow-xl shadow-black/20 rounded-3xl w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="px-6 py-4 text-[11px] font-black uppercase text-muted-foreground tracking-widest">ID / MRN</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase text-muted-foreground tracking-widest">Patient Name</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase text-muted-foreground tracking-widest">Date</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase text-muted-foreground tracking-widest">AI Status</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase text-muted-foreground tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {history.length === 0 ? (
                <tr>
                   <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground font-medium">No clinical cases found in the database.</td>
                </tr>
              ) : (
                history.map((record) => (
                  <tr key={record.id} className="hover:bg-secondary/20 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-bold text-foreground">{record.mrn}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-sm text-foreground">{record.name}</p>
                      <p className="text-xs text-muted-foreground">{record.age}y • {record.sex}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-muted-foreground">{record.date}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                         <span className={`w-2 h-2 rounded-full ${record.type === 'danger' ? 'bg-brand-danger shadow-glow' : record.type === 'warning' ? 'bg-brand-warning' : 'bg-brand-success'}`}></span>
                         <span className={`text-[10px] font-black ${record.type === 'danger' ? 'text-brand-danger' : record.type === 'warning' ? 'text-brand-warning' : 'text-brand-success'} uppercase tracking-[0.2em] truncate max-w-[150px]`}>
                           {record.status}
                         </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/reports/${record.id}`} className="text-sm font-bold text-brand-accent opacity-50 group-hover:opacity-100 transition-opacity uppercase tracking-wider hover:underline">
                        View Report →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
