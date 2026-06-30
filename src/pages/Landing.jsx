import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Landmark, LockKeyhole, PieChart, ShieldCheck, WalletCards } from 'lucide-react';
import { motion } from 'framer-motion';

const Landing = () => {
  const features = [
    { title: 'Track every flow', text: 'Record income, expenses, budgets, and goals from one fast workspace.', icon: WalletCards },
    { title: 'See the signal', text: 'Clean charts reveal spending patterns, savings rate, and category pressure.', icon: BarChart3 },
    { title: 'Secure by default', text: 'JWT sessions, HttpOnly refresh cookies, CORS controls, and strong passwords.', icon: ShieldCheck },
  ];

  return (
    <main className="min-h-screen bg-white text-slate-950 font-sans">
      <header className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="w-9 h-9 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
            <Landmark className="w-5 h-5" />
          </span>
          Credo
        </Link>
        <nav className="flex items-center gap-3">
          <Link to="/login" className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-950">
            Log in
          </Link>
          <Link to="/register" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-950 text-white text-sm font-semibold rounded-lg hover:bg-slate-800">
            Get started
            <ArrowRight className="w-4 h-4" />
          </Link>
        </nav>
      </header>

      <section className="max-w-7xl mx-auto px-6 pt-14 pb-10 grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-7">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-100">
            <LockKeyhole className="w-3.5 h-3.5" />
            Private finance command center
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.02]">
              Personal finance, made calm and accountable.
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-8">
              Credo helps you manage income, spending, budgets, savings goals, and financial insights in one polished dashboard built for real daily use.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/register" className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-700 text-white font-bold rounded-lg hover:bg-emerald-800">
              Start tracking
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/login" className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-slate-200 text-slate-800 font-bold rounded-lg hover:bg-slate-50">
              Open dashboard
            </Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="border border-slate-200 bg-slate-50 rounded-lg p-4 shadow-2xl shadow-slate-200/70">
          <div className="bg-white rounded-lg border border-slate-200 p-5 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Monthly overview</p>
                <h2 className="text-2xl font-extrabold">$6,000 income</h2>
              </div>
              <PieChart className="w-8 h-8 text-emerald-700" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                ['Expenses', '$2,620', 'text-rose-600'],
                ['Savings', '$3,380', 'text-emerald-700'],
                ['Rate', '56%', 'text-blue-700'],
              ].map(([label, value, color]) => (
                <div key={label} className="border border-slate-200 rounded-lg p-3">
                  <p className="text-[11px] text-slate-500 font-bold">{label}</p>
                  <p className={`text-lg font-extrabold ${color}`}>{value}</p>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {['Housing', 'Food', 'Transport'].map((label, index) => (
                <div key={label}>
                  <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                    <span>{label}</span>
                    <span>{[72, 48, 31][index]}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-700" style={{ width: `${[72, 48, 31][index]}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-16 grid md:grid-cols-3 gap-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div key={feature.title} className="border border-slate-200 rounded-lg p-5 bg-white">
              <Icon className="w-5 h-5 text-emerald-700 mb-4" />
              <h3 className="font-extrabold text-slate-950 mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-600 leading-6">{feature.text}</p>
            </div>
          );
        })}
      </section>
    </main>
  );
};

export default Landing;
