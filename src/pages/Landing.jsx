import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Landing = () => {
  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans relative overflow-hidden flex flex-col justify-between selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-500/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-500/10 blur-[150px] pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <Link to="/" className="flex items-center gap-2 font-extrabold text-xl tracking-tight text-white font-outfit">
          <span className="text-emerald-400">Credo</span>
        </Link>
        <nav className="flex items-center gap-3">
          <Link to="/login" className="px-4 py-2 text-sm font-semibold text-slate-350 hover:text-white transition-colors">
            Log in
          </Link>
          <Link 
            to="/register" 
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-sm font-bold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-950/20"
          >
            Get started
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </Link>
        </nav>
      </header>

      {/* Center-Aligned Hero Section */}
      <section className="flex-1 flex items-center justify-center max-w-4xl mx-auto px-6 py-20 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          className="space-y-6 text-center flex flex-col items-center"
        >
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] font-outfit text-white">
              Personal finance, <br />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                calm and accountable.
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
              Credo helps you track cash flow, optimize monthly category budgets, manage active savings goals, and unlock customized AI insights from a private, single-screen dashboard.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Link 
              to="/register" 
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl transition-colors shadow-lg shadow-emerald-950/30"
            >
              Start tracking
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </Link>
            <Link 
              to="/login" 
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 text-slate-300 font-bold rounded-xl transition-all"
            >
              Open dashboard
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-8 text-center text-slate-500 text-xs border-t border-slate-900/40 relative z-10">
        &copy; {new Date().getFullYear()} Credo. All rights reserved.
      </footer>
    </main>
  );
};

export default Landing;
