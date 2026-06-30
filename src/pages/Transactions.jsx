/* oxlint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api.js';
import { useToast } from '../context/ToastContext.jsx';
import { TableSkeleton } from '../components/ui/Skeletons.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import {
  History,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const Transactions = () => {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  
  // Filters
  const [type, setType] = useState('all'); // 'all', 'income', 'expense'
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      if (type === 'income') {
        const res = await apiFetch(`/income/get?page=${page}&limit=10&search=${search}`);
        setTransactions(res.data.incomes.map(i => ({ ...i, type: 'income' })));
        setTotalPages(res.data.pagination.pages);
      } else if (type === 'expense') {
        const res = await apiFetch(`/expense/get?page=${page}&limit=10&search=${search}`);
        setTransactions(res.data.expenses.map(e => ({ ...e, type: 'expense' })));
        setTotalPages(res.data.pagination.pages);
      } else {
        // Fetch both and merge
        const [incRes, expRes] = await Promise.all([
          apiFetch(`/income/get?limit=50&search=${search}`),
          apiFetch(`/expense/get?limit=50&search=${search}`),
        ]);
        const merged = [
          ...incRes.data.incomes.map(i => ({ ...i, type: 'income' })),
          ...expRes.data.expenses.map(e => ({ ...e, type: 'expense' })),
        ].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Client-side paginate merged list
        const itemsPerPage = 10;
        setTotalPages(Math.ceil(merged.length / itemsPerPage) || 1);
        setTransactions(merged.slice((page - 1) * itemsPerPage, page * itemsPerPage));
      }
    } catch (err) {
      showToast(err.message || 'Failed to fetch transactions', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, type]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchTransactions();
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans text-left">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Transaction Ledger</h2>
        <p className="text-xs text-slate-400">Search and audit your full cash flow ledger</p>
      </div>

      {/* Query Filters */}
      <div className="p-4 bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:border-emerald-500 outline-none transition-all duration-200"
          />
        </form>

        {/* Type selector */}
        <div className="flex gap-2">
          <button
            onClick={() => { setType('all'); setPage(1); }}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
              type === 'all'
                ? 'bg-emerald-600/10 border border-emerald-500/20 text-emerald-400'
                : 'bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All Ledger
          </button>
          <button
            onClick={() => { setType('income'); setPage(1); }}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
              type === 'income'
                ? 'bg-emerald-600/10 border border-emerald-500/20 text-emerald-400'
                : 'bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Incomes Only
          </button>
          <button
            onClick={() => { setType('expense'); setPage(1); }}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
              type === 'expense'
                ? 'bg-emerald-600/10 border border-emerald-500/20 text-emerald-400'
                : 'bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Expenses Only
          </button>
        </div>

      </div>

      {/* Database list */}
      {loading ? (
        <TableSkeleton rows={8} />
      ) : transactions.length === 0 ? (
        <EmptyState
          title="No transactions matches found"
          description="Try broadening your search filters or add a new transaction record."
          icon={History}
        />
      ) : (
        <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl overflow-hidden p-6 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800/60 text-slate-500 font-bold text-xs uppercase tracking-wider">
                  <th className="pb-3 text-left font-bold">Flow Type</th>
                  <th className="pb-3 text-left font-bold">Description</th>
                  <th className="pb-3 text-left font-bold">Category</th>
                  <th className="pb-3 text-left font-bold">Date</th>
                  <th className="pb-3 text-right font-bold">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/35">
                {transactions.map((tx) => (
                  <tr key={tx._id} className="group">
                    <td className="py-4 text-left">
                      <div className="inline-flex items-center gap-1.5">
                        {tx.type === 'income' ? (
                          <div className="p-1 bg-emerald-500/10 text-emerald-400 rounded-lg">
                            <ArrowUpRight className="w-4.5 h-4.5" />
                          </div>
                        ) : (
                          <div className="p-1 bg-rose-500/10 text-rose-400 rounded-lg">
                            <ArrowDownRight className="w-4.5 h-4.5" />
                          </div>
                        )}
                        <span className={`text-xs font-bold uppercase tracking-wider ${tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {tx.type}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 text-left font-semibold text-slate-200 group-hover:text-white transition-colors">
                      {tx.description}
                    </td>
                    <td className="py-4 text-left">
                      <span className="px-2.5 py-0.5 bg-slate-850 border border-slate-700/40 rounded-full text-[10px] font-bold text-slate-400">
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-4 text-left text-slate-400 text-xs font-medium">
                      {new Date(tx.date).toLocaleDateString()}
                    </td>
                    <td className={`py-4 text-right font-bold font-outfit ${tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-slate-800/60 mt-4">
              <span className="text-xs text-slate-400 font-medium">
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="p-2 bg-slate-950/60 border border-slate-850 hover:border-slate-800 rounded-xl disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-300" />
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className="p-2 bg-slate-950/60 border border-slate-850 hover:border-slate-800 rounded-xl disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default Transactions;
