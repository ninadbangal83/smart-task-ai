import React from 'react';
import { useAuthStore } from './stores/auth.store';
import { Navbar } from './components/Navbar';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { ErrorBoundary } from './components/ErrorBoundary';

const App: React.FC = () => {
  const { user } = useAuthStore();

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
          <div>SmartTask AI Orchestrator Dashboard • React + Vite + Tailwind</div>
          <div className="mt-1 text-slate-700">Built for Advanced System Design Studies</div>
        </footer>
      </div>
    </ErrorBoundary>
  );
};

export default App;
