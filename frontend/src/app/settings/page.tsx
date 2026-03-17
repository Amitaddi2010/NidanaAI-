import React from 'react';

export default function Settings() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in p-4 md:p-8">
      <h1 className="text-xl font-black tracking-tighter text-foreground font-outfit uppercase">
        Settings
      </h1>
      <div className="bg-card border border-border overflow-hidden relative shadow-xl shadow-black/20 p-6 rounded-3xl border-border">
        <h3 className="text-xl font-bold font-outfit uppercase tracking-tighter mb-4">User Preferences</h3>
        <p className="text-muted-foreground font-medium mb-8">Manage platform settings, aesthetic themes, and API configurations.</p>
        <div className="flex items-center space-x-4">
            <div className="px-6 py-3 rounded-xl bg-card border border-border text-muted-foreground opacity-50 cursor-not-allowed">
              <span className="font-bold text-sm uppercase tracking-widest">Theme: Dark Mode (Forced)</span>
            </div>
        </div>
      </div>
    </div>
  );
}
