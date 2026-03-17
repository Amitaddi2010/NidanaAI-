"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const sidebarItems = [
  { name: 'Dashboard', icon: '📊', path: '/dashboard' },
  { name: 'New Patient', icon: '👤', path: '/new-patient' },
  { name: 'Patient Records', icon: '📋', path: '/reports' },
  { name: 'Knowledge Hub', icon: '📖', path: '/guidelines' },
  { name: 'Settings', icon: '⚙️', path: '/settings' },
];

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLanding = pathname === '/';
  const isAuth = pathname.startsWith('/login') || pathname.startsWith('/signup');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState({ name: 'Dr. Adam Smith', role: 'Ortho Surgeon', initials: 'AS' });

  const handleLogout = () => {
    localStorage.removeItem('nidana_user');
    router.push('/login');
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    
    // Check for user info from successful login/signup
    try {
      const stored = localStorage.getItem('nidana_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        const name = parsed.name || 'User';
        const role = parsed.role || 'Clinician';
        const initials = name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
        setUser({ name, role, initials });
      }
    } catch(e) {}
  }, [pathname]);

  if (isLanding || isAuth) return <>{children}</>;

  return (
    <div className="flex h-screen overflow-hidden neo-blur text-foreground bg-background">
      
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border overflow-hidden shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-accent to-brand-success tracking-tight">
              NidanaAI
            </h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1 font-bold">
              Clinical Node
            </p>
          </div>
          <button 
            className="lg:hidden p-2 text-muted-foreground hover:bg-secondary rounded-lg"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            ✕
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group hover:shadow-glow ${
                  isActive 
                    ? 'bg-brand-accent text-white shadow-lg shadow-brand-accent/20 border border-brand-accent/50' 
                    : 'text-muted-foreground hover:bg-secondary hover:text-white'
                }`}
              >
                <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border mt-auto shrink-0">
          <div className="flex items-center justify-between p-3 rounded-xl bg-secondary border border-border">
            <div className="flex items-center space-x-3 overflow-hidden">
               <div className="w-10 h-10 shrink-0 rounded-full bg-brand-accent flex items-center justify-center text-white font-bold tracking-widest">
                 {user.initials}
               </div>
               <div className="flex-1 overflow-hidden">
                 <p className="text-sm font-semibold truncate capitalize">{user.name}</p>
                 <p className="text-xs text-muted-foreground truncate capitalize">{user.role}</p>
               </div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-muted-foreground hover:text-brand-danger hover:bg-white/5 rounded-lg transition-colors ml-2 shrink-0 group"
              title="Logout Node"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-16 shrink-0 bg-card border-b border-border shadow-md flex items-center justify-between px-4 lg:px-8 z-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-muted-foreground hover:bg-secondary rounded-lg focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <h2 className="text-lg font-bold text-muted-foreground hidden sm:block">
              {sidebarItems.find(i => i.path === pathname)?.name || 'Patient Case'}
            </h2>
          </div>
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="px-3 py-1.5 rounded-full bg-brand-success/10 text-brand-success text-[10px] sm:text-xs font-black uppercase border border-brand-success/20 tracking-widest whitespace-nowrap">
              ● Online
            </div>
            <button className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground">
              🔔
            </button>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
}
