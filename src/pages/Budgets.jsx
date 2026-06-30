/* oxlint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api.js';
import { useToast } from '../context/ToastContext.jsx';
import { CardSkeleton } from '../components/ui/Skeletons.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Modal from '../components/ui/Modal.jsx';
import {
  PiggyBank,
  Plus,
  Trash2,
  DollarSign,
  Tag,
  Calendar,
  Sparkles,
  Loader2,
  AlertTriangle,
} from 'lucide-react';

const CATEGORIES = [
  'Housing',
  'Food',
  'Utilities',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Health',
  'Education',
  'Other',
];

const Budgets = () => {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [budgets, setBudgets] = useState([]);
  
  // Selection
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

  // Modals state
  const [setModalOpen, setSetModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);

  // Form state
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [limit, setLimit] = useState('');
  // AI recommendations state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState([]);

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`/budget/get?month=${month}`);
      setBudgets(res.data.budgets);
    } catch (err) {
      showToast(err.message || 'Failed to fetch budgets', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [month]);

  const handleSetSubmit = async (e) => {
    e?.preventDefault?.();
    if (!limit || Number(limit) <= 0) {
      return showToast('Please enter a valid budget limit', 'warning');
    }

    try {
      await apiFetch('/budget/set', {
        method: 'POST',
        body: JSON.stringify({ category, limit: Number(limit), month }),
      });
      showToast('Budget configured successfully!', 'success');
      setSetModalOpen(false);
      setLimit('');
      fetchBudgets();
    } catch (err) {
      showToast(err.message || 'Failed to set budget', 'error');
    }
  };

  const handleDelete = async () => {
    if (!selectedBudget) return;
    try {
      await apiFetch(`/budget/delete/${selectedBudget._id}`, { method: 'DELETE' });
      showToast('Budget limit removed', 'info');
      setDeleteModalOpen(false);
      fetchBudgets();
    } catch (err) {
      showToast(err.message || 'Failed to remove budget', 'error');
    }
  };

  const generateAIRecommendations = async () => {
    setAiLoading(true);
    setAiModalOpen(true);
    try {
      const res = await apiFetch('/ai/budget-recommendations');
      setAiRecommendations(res.data.recommendations);
    } catch {
      showToast('Failed to fetch AI recommendations', 'error');
    } finally {
      setAiLoading(false);
    }
  };

  const applyAIRecommendations = async () => {
    try {
      // Upsert all recommendations sequentially
      await Promise.all(
        aiRecommendations.map((rec) =>
          apiFetch('/budget/set', {
            method: 'POST',
            body: JSON.stringify({ category: rec.category, limit: rec.limit, month }),
          })
        )
      );
      showToast('Applied AI Budget configurations!', 'success');
      setAiModalOpen(false);
      fetchBudgets();
    } catch {
      showToast('Failed to apply AI recommendations', 'error');
    }
  };

  const openSetModal = () => {
    setCategory(CATEGORIES[0]);
    setLimit('');
    setSetModalOpen(true);
  };

  const openDeleteModal = (b) => {
    setSelectedBudget(b);
    setDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Budgets & Limits</h2>
          <p className="text-xs text-slate-400">Control spending limits by category</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={generateAIRecommendations}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700/80 transition-all rounded-xl font-semibold text-xs text-slate-200 cursor-pointer shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            AI Recommendations
          </button>
          <button
            onClick={openSetModal}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 transition-all rounded-xl font-semibold text-xs text-white cursor-pointer shadow-lg shadow-emerald-950/20"
          >
            <Plus className="w-3.5 h-3.5 text-slate-900" />
            Set Budget
          </button>
        </div>
      </div>

      {/* Month selection filter */}
      <div className="p-4 bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl flex items-center justify-between shadow-sm">
        <span className="text-xs font-semibold text-slate-300">Viewing targets for</span>
        <div className="relative">
          <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="pl-10 pr-4 py-2 bg-slate-950/60 border border-slate-850 focus:border-emerald-500 rounded-xl text-xs outline-none text-white cursor-pointer"
          />
        </div>
      </div>

      {/* Main Budget Grid list */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : budgets.length === 0 ? (
        <EmptyState
          title="No budgets set for this month"
          description="Setting budget limits helps you curb discretionary spending and reach savings goals faster."
          onAdd={openSetModal}
          addText="Set Budget"
          icon={PiggyBank}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {budgets.map((b) => (
            <div
              key={b._id}
              className={`p-6 rounded-2xl bg-slate-900/40 border backdrop-blur-md relative overflow-hidden transition-all duration-300 flex flex-col justify-between h-48 group ${
                b.isOverBudget
                  ? 'border-rose-500/20 hover:border-rose-500/40 shadow-inner shadow-rose-950/5'
                  : b.percentUsed >= 85
                  ? 'border-amber-500/20 hover:border-amber-500/40 shadow-inner'
                  : 'border-slate-800 hover:border-emerald-500/20 shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{b.category}</span>
                    <h3 className="text-xl font-bold text-white font-outfit">${b.limit.toLocaleString()}</h3>
                  </div>
                  <button
                    onClick={() => openDeleteModal(b)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800/40 rounded-lg transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Progress details */}
                <div className="mt-4 flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-400">Spent: ${b.spent.toLocaleString()}</span>
                  <span className={`${b.isOverBudget ? 'text-rose-400' : b.percentUsed >= 85 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {b.percentUsed}%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-2 mt-4">
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/80">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      b.isOverBudget ? 'bg-rose-500' : b.percentUsed >= 85 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, b.percentUsed)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-semibold text-slate-500">
                  {b.isOverBudget ? (
                    <span className="text-rose-400 font-bold flex items-center gap-0.5">
                      <AlertTriangle className="w-3 h-3" />
                      Over limit by ${Math.abs(b.limit - b.spent).toLocaleString()}
                    </span>
                  ) : (
                    <span>Remaining: ${(b.limit - b.spent).toLocaleString()}</span>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Set Budget Limit Modal */}
      <Modal
        isOpen={setModalOpen}
        onClose={() => setSetModalOpen(false)}
        title="Set Budget Limit"
        confirmText="Configure Limit"
        onConfirm={handleSetSubmit}
      >
        <form onSubmit={handleSetSubmit} className="space-y-4 text-left">
          
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Category
            </label>
            <div className="relative">
              <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-850 focus:border-emerald-500 rounded-xl text-sm outline-none text-white cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Monthly Limit ($)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="number"
                placeholder="e.g. 500"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-850 focus:border-emerald-500 rounded-xl text-sm outline-none text-white placeholder-slate-600"
              />
            </div>
          </div>

        </form>
      </Modal>

      {/* Remove Budget Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Remove Budget Target"
        confirmText="Remove Limit"
        confirmVariant="danger"
        onConfirm={handleDelete}
      >
        <p className="text-sm">
          Are you sure you want to remove the budget target for **{selectedBudget?.category}**? This category's spending will no longer be capped.
        </p>
      </Modal>

      {/* AI Recommendations Modal */}
      <Modal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        title="AI Budget Advisor"
        confirmText={aiRecommendations.length > 0 ? "Apply AI Recommendation" : null}
        onConfirm={applyAIRecommendations}
      >
        <div className="space-y-4 text-left">
          <p className="text-xs text-slate-400">
            Based on an automated analysis of your historical transactions, Gemini recommends the following budget caps for this month:
          </p>

          {aiLoading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3 text-slate-400">
              <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
              <span className="text-xs">Analyzing transaction histories...</span>
            </div>
          ) : aiRecommendations.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-500">
              No recommendations could be generated at this time. Log more expenses.
            </div>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {aiRecommendations.map((rec) => (
                <div key={rec.category} className="p-3 bg-slate-950 border border-slate-850 rounded-xl flex items-start gap-3 justify-between">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-1.5 justify-between">
                      <span className="text-xs font-bold text-slate-200">{rec.category}</span>
                      <span className="text-xs font-bold text-emerald-400 font-outfit">${rec.limit} / mo</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed">{rec.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

    </div>
  );
};

export default Budgets;
