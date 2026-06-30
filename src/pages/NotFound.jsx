import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-4 text-center text-white relative overflow-hidden font-sans">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-emerald-500/10 blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-teal-500/10 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="space-y-6 max-w-sm relative z-10 p-8 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-2xl"
      >
        <div className="inline-flex p-4 bg-rose-500/10 border border-rose-500/20 rounded-full text-rose-400 mb-2">
          <HelpCircle className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight font-outfit">404</h2>
        <h3 className="text-lg font-bold text-slate-200">Page Not Found</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          The link you followed may be broken, or the page has been removed. Check your URL address and try again.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 transition-colors text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950/30 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
