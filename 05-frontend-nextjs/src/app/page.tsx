"use client";

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { Navbar } from '@/components/Navbar';
import { Login } from '@/components/Login';
import { Dashboard } from '@/components/Dashboard';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function Home() {
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  // Prevent SSR hydration mismatch by only rendering after mounting on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center font-mono text-xs">
        Initializing Orchestration Core...
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
        {/* Navigation Bar */}
        <Navbar />

        {/* Core Screen Router */}
        <main className="flex-grow">
          {user ? <Dashboard /> : <Login />}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-900/60 py-6 text-center text-xs text-slate-600 font-mono">
          <div>SmartTask AI Orchestrator Dashboard • Next.js App Router + Tailwind</div>
          <div className="mt-1 text-slate-700">Built for Advanced System Design Studies</div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}
