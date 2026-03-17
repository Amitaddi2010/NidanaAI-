"use client";

import React, { useState, useRef, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';
import ReactMarkdown from 'react-markdown';

type Message = {
  id: string;
  role: 'user' | 'ai';
  content: string;
};

type ChatSession = {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
};

const DEFAULT_MESSAGE: Message = { 
  id: '1', 
  role: 'ai', 
  content: '**Hello. I am the NidanaAI Clinical Node.**\n\nI am calibrated against international consensus guidelines for orthopedic infections (e.g., Metsemakers 2018, MSIS).\n\nHow can I assist your clinical reasoning today?' 
};

export default function GuidelinesPage() {
  const getStorageKey = () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('nidana_user');
      if (user) {
        try {
          return `nidana_chat_sessions_${JSON.parse(user).name}`;
        } catch(e) {}
      }
    }
    return 'nidana_chat_sessions';
  };
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(getStorageKey());
    let loadedSessions: ChatSession[] = [];
    if (saved) {
      try {
        loadedSessions = JSON.parse(saved);
        
        // Clean up any existing duplicate keys from old local storage data
        const seenSessionIds = new Set<string>();
        
        loadedSessions.forEach(session => {
            if (seenSessionIds.has(session.id)) {
               session.id = `session-remedy-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
            }
            seenSessionIds.add(session.id);
            
            const seenMsgIds = new Set<string>();
            session.messages.forEach(msg => {
                if (seenMsgIds.has(msg.id)) {
                    msg.id = `msg-remedy-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
                }
                seenMsgIds.add(msg.id);
            });
        });
        
        setSessions(loadedSessions);
      } catch(e) {}
    }
    
    if (loadedSessions.length > 0) {
      setCurrentSessionId(loadedSessions[0].id);
    } else {
      createNewSession();
    }
  }, []);

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      title: "New Discourse",
      messages: [{ ...DEFAULT_MESSAGE, id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}` }],
      updatedAt: Date.now()
    };
    setSessions(prev => {
      const updated = [newSession, ...prev];
      localStorage.setItem(getStorageKey(), JSON.stringify(updated));
      return updated;
    });
    setCurrentSessionId(newSession.id);
  };

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions(prev => {
      const updated = prev.filter(s => s.id !== id);
      localStorage.setItem(getStorageKey(), JSON.stringify(updated));
      if (currentSessionId === id) {
        if (updated.length > 0) {
          setCurrentSessionId(updated[0].id);
        } else {
          // If empty, create a new one immediately
          const newSession: ChatSession = {
            id: `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            title: "New Discourse",
            messages: [{ ...DEFAULT_MESSAGE, id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}` }],
            updatedAt: Date.now()
          };
          updated.push(newSession);
          localStorage.setItem(getStorageKey(), JSON.stringify(updated));
          setCurrentSessionId(newSession.id);
        }
      }
      return updated;
    });
  };

  const currentMessages = sessions.find(s => s.id === currentSessionId)?.messages || [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentMessages, loading]);

  const handleQuery = async () => {
    if (!query.trim() || !currentSessionId) return;
    
    const userMsg: Message = { id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, role: 'user', content: query };
    const currentQuery = query; // save for local scope
    
    setSessions(prev => {
       const newSessions = [...prev];
       const idx = newSessions.findIndex(s => s.id === currentSessionId);
       if (idx !== -1) {
           const updatedSession = { ...newSessions[idx] };
           const isFirstQuery = updatedSession.messages.length === 1;
           if (isFirstQuery) {
              updatedSession.title = currentQuery.slice(0, 30) + (currentQuery.length > 30 ? '...' : '');
           }
           updatedSession.messages = [...updatedSession.messages, userMsg];
           updatedSession.updatedAt = Date.now();
           newSessions[idx] = updatedSession;
       }
       // Sort by latest
       newSessions.sort((a,b) => b.updatedAt - a.updatedAt);
       localStorage.setItem(getStorageKey(), JSON.stringify(newSessions));
       return newSessions;
    });
    
    setQuery("");
    setLoading(true);

    try {
      const res = await apiClient.queryGuidelines(currentQuery);
      const aiMsg: Message = { id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, role: 'ai', content: res.response };
      
      setSessions(prev => {
         const newSessions = [...prev];
         const idx = newSessions.findIndex(s => s.id === currentSessionId);
         if (idx !== -1) {
             const updatedSession = { ...newSessions[idx] };
             updatedSession.messages = [...updatedSession.messages, aiMsg];
             updatedSession.updatedAt = Date.now();
             newSessions[idx] = updatedSession;
         }
         localStorage.setItem(getStorageKey(), JSON.stringify(newSessions));
         return newSessions;
      });
    } catch (err) {
      console.error("Query failed", err);
      const errMsg: Message = { id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, role: 'ai', content: "**Error**: Unable to reach the knowledge engine. Please ensure the clinical node is online." };
      setSessions(prev => {
         const newSessions = [...prev];
         const idx = newSessions.findIndex(s => s.id === currentSessionId);
         if (idx !== -1) {
             const updatedSession = { ...newSessions[idx] };
             updatedSession.messages = [...updatedSession.messages, errMsg];
             newSessions[idx] = updatedSession;
         }
         localStorage.setItem(getStorageKey(), JSON.stringify(newSessions));
         return newSessions;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] flex gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Session History Sidebar */}
      <div className="hidden lg:flex w-72 shrink-0 flex-col bg-card border border-border rounded-[2.5rem] shadow-xl shadow-black/20 overflow-hidden">
         <div className="p-6 border-b border-border bg-gradient-to-b from-secondary/50 to-transparent">
            <h1 className="text-xl font-black tracking-tighter font-outfit uppercase text-foreground mb-1">Knowledge Hub</h1>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Sessions</p>
         </div>
         <div className="p-4 border-b border-border">
            <button 
              onClick={createNewSession} 
              className="w-full py-3 px-4 rounded-xl bg-foreground text-background font-black text-xs uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-glow"
            >
               <span>+ New Discourse</span>
            </button>
         </div>
         <div className="flex-1 overflow-y-auto p-3 space-y-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 hover:[&::-webkit-scrollbar-thumb]:bg-white/20 transition-all font-outfit">
             {sessions.map(s => (
                <div 
                  key={s.id} 
                  onClick={() => setCurrentSessionId(s.id)}
                  className={`w-full group text-left px-5 py-4 rounded-2xl transition-all cursor-pointer border ${currentSessionId === s.id ? 'bg-secondary/80 border-white/10 shadow-md' : 'border-transparent text-muted-foreground hover:bg-white/5 hover:border-white/5'}`}
                >
                   <div className="flex justify-between items-start">
                     <p className={`text-sm font-bold truncate pr-3 ${currentSessionId === s.id ? 'text-brand-accent' : ''}`}>{s.title}</p>
                     <button 
                       onClick={(e) => deleteSession(s.id, e)}
                       className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-brand-danger transition-all"
                     >
                       ×
                     </button>
                   </div>
                   <p className="text-[9px] uppercase tracking-wider opacity-60 mt-2 font-bold">{new Date(s.updatedAt).toLocaleDateString()} • {new Date(s.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
             ))}
         </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Mobile Header (Hidden on large screens since sidebar has title) */}
        <section className="lg:hidden mb-6 pb-6 border-b border-border flex justify-between items-end flex-shrink-0">
          <div>
            <h1 className="text-3xl font-black tracking-tighter font-outfit uppercase text-foreground">Knowledge Hub Node</h1>
          </div>
          <button 
              onClick={createNewSession} 
              className="py-2 px-4 rounded-xl bg-foreground text-background font-black text-xs uppercase tracking-widest hover:opacity-90"
          >
              + New
          </button>
        </section>

        {/* Quick Tag Queries */}
        <div className="hidden sm:flex space-x-3 mb-6 flex-shrink-0 justify-end">
            <button 
              onClick={() => setQuery("What are the Metsemakers 2018 criteria for bone infections?")}
              className="text-[10px] font-black bg-card border border-border px-4 py-2 rounded-xl text-muted-foreground uppercase tracking-widest hover:bg-secondary hover:text-foreground transition-all shadow-md cursor-pointer"
            >
              Query Metsemakers 2018
            </button>
            <button 
              onClick={() => setQuery("What is the EBJIS definition of PJI?")}
              className="text-[10px] font-black bg-card border border-border px-4 py-2 rounded-xl text-muted-foreground uppercase tracking-widest hover:bg-secondary hover:text-foreground transition-all shadow-md cursor-pointer"
            >
              Query EBJIS Criteria
            </button>
        </div>

        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto space-y-8 pr-4 pb-6 scroll-smooth [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20 transition-all font-outfit"
        >
          {currentMessages.map((m) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
               <div className={`w-full max-w-[90%] sm:max-w-[80%] p-6 lg:p-8 rounded-[2rem] ${
                   m.role === 'user' 
                   ? 'bg-secondary/40 border border-white/5 text-foreground rounded-tr-sm ml-auto shadow-md' 
                   : 'bg-card border border-border text-foreground rounded-tl-sm mr-auto relative overflow-hidden shadow-xl shadow-black/20'
               }`}>
                  {m.role === 'ai' && <div className="absolute top-0 left-0 w-1 bg-brand-accent h-full shadow-glow"></div>}
                  
                  <div className="flex items-center space-x-3 mb-5">
                     {m.role === 'ai' ? (
                         <>
                           <div className="w-7 h-7 rounded-lg bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center shadow-glow">
                             <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse"></div>
                           </div>
                           <span className="text-xs font-black uppercase text-brand-accent tracking-[0.2em]">NidanaAI Node</span>
                         </>
                     ) : (
                         <>
                           <div className="w-7 h-7 rounded-lg bg-secondary border border-border flex items-center justify-center text-[11px] shadow-sm">
                             👤
                           </div>
                           <span className="text-xs font-bold uppercase text-muted-foreground tracking-[0.2em]">Clinician</span>
                         </>
                     )}
                  </div>
                  <div className="prose prose-invert max-w-none text-base prose-p:leading-loose prose-li:leading-relaxed font-medium marker:text-brand-accent">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
               </div>
            </div>
          ))}
          {loading && (
             <div className="flex justify-start">
                <div className="w-full max-w-[90%] sm:max-w-[80%] bg-card border border-border rounded-[2rem] p-6 lg:p-8 rounded-tl-sm text-foreground relative overflow-hidden shadow-xl shadow-black/20">
                    <div className="absolute top-0 left-0 w-1 bg-brand-accent h-full shadow-glow"></div>
                    
                    <div className="flex items-center space-x-3 mb-5">
                       <div className="w-7 h-7 rounded-lg bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center">
                         <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse"></div>
                       </div>
                       <span className="text-xs font-black uppercase text-brand-accent tracking-[0.2em]">NidanaAI Node</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                        <div className="w-2.5 h-2.5 bg-brand-accent rounded-full animate-bounce shadow-glow"></div>
                        <div className="w-2.5 h-2.5 bg-brand-accent rounded-full animate-bounce shadow-glow delay-100"></div>
                        <div className="w-2.5 h-2.5 bg-brand-accent rounded-full animate-bounce shadow-glow delay-200"></div>
                        <span className="text-xs font-bold uppercase text-muted-foreground tracking-widest ml-3">Synthesizing Evidence...</span>
                    </div>
                </div>
             </div>
          )}
        </div>

        {/* Input Area */}
        <div className="pt-6 pb-2 relative shrink-0">
           <div className="absolute -inset-4 bg-gradient-to-t from-background via-background to-transparent pointer-events-none -z-10"></div>
           <div className="flex items-center space-x-4 bg-card border border-border p-2 pr-2 pl-6 rounded-[2.5rem] shadow-2xl focus-within:border-brand-accent/50 focus-within:ring-4 focus-within:ring-brand-accent/10 transition-all">
              <span className="text-brand-accent font-black opacity-80 text-lg">/</span>
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
                placeholder="Ask about biofilm formation timeframe, DAIR indications..." 
                className="flex-1 bg-transparent py-3 outline-none text-base font-medium text-foreground placeholder:text-muted-foreground/40"
              />
              <button 
                onClick={handleQuery}
                disabled={loading || !query.trim()}
                className="px-6 py-4 bg-brand-accent text-white rounded-[2rem] font-black text-xs uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all shadow-glow group flex items-center space-x-2"
              >
                <span>Send</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
           </div>
           <div className="text-center mt-5">
               <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.3em]">AI responses are generated based on deterministic guidelines. Always verify clinically.</span>
           </div>
        </div>
      </div>

    </div>
  );
}
