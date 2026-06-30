/* oxlint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api.js';
import { useToast } from '../context/ToastContext.jsx';
import { CardSkeleton } from '../components/ui/Skeletons.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Modal from '../components/ui/Modal.jsx';
import {
  Target,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  DollarSign,
  FileText,
  CheckCircle,
  Clock,
} from 'lucide-react';

const Goals = () => {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState([]);

  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [progressModalOpen, setProgressModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Quick progress update state
  const [extraAmount, setExtraAmount] = useState('');

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/goal/get');
      setGoals(res.data.goals);
    } catch (err) {
      showToast(err.message || 'Failed to load savings goals', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleAddSubmit = async (e) => {
    e?.preventDefault?.();
    if (!name || !targetAmount || !targetDate) {
      return showToast('Please fill in all fields', 'warning');
    }

    try {
      if (isEditing && selectedGoal) {
        await apiFetch(`/goal/update/${selectedGoal._id}`, {
          method: 'PUT',
          body: JSON.stringify({
            name,
            targetAmount: Number(targetAmount),
            targetDate,
            currentAmount: Number(currentAmount) || 0,
          }),
        });
        showToast('Savings goal updated successfully!', 'success');
      } else {
        await apiFetch('/goal/add', {
          method: 'POST',
          body: JSON.stringify({
            name,
            targetAmount: Number(targetAmount),
            targetDate,
            currentAmount: Number(currentAmount) || 0,
          }),
        });
        showToast('Savings goal created successfully!', 'success');
      }
      setAddModalOpen(false);
      resetForm();
      fetchGoals();
    } catch (err) {
      showToast(err.message || 'Failed to save savings goal', 'error');
    }
  };

  const handleAddProgress = async (e) => {
    e?.preventDefault?.();
    if (!extraAmount || Number(extraAmount) <= 0 || !selectedGoal) {
      return showToast('Please enter a valid amount to add', 'warning');
    }

    const newAmount = selectedGoal.currentAmount + Number(extraAmount);
    
    try {
      await apiFetch(`/goal/update/${selectedGoal._id}`, {
        method: 'PUT',
        body: JSON.stringify({ currentAmount: newAmount }),
      });

      if (newAmount >= selectedGoal.targetAmount) {
        showToast(`🎉 Congratulations! You achieved your "${selectedGoal.name}" goal!`, 'success');
      } else {
        showToast('Savings progress logged successfully!', 'success');
      }
      
      setProgressModalOpen(false);
      setExtraAmount('');
      fetchGoals();
    } catch (err) {
      showToast(err.message || 'Failed to log savings', 'error');
    }
  };

  const handleDelete = async () => {
    if (!selectedGoal) return;
    try {
      await apiFetch(`/goal/delete/${selectedGoal._id}`, { method: 'DELETE' });
      showToast('Savings goal removed', 'info');
      setDeleteModalOpen(false);
      fetchGoals();
    } catch (err) {
      showToast(err.message || 'Failed to remove goal', 'error');
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    resetForm();
    setAddModalOpen(true);
  };

  const openEditModal = (g) => {
    setIsEditing(true);
    setSelectedGoal(g);
    setName(g.name);
    setTargetAmount(g.targetAmount);
    setTargetDate(new Date(g.targetDate).toISOString().split('T')[0]);
    setCurrentAmount(g.currentAmount);
    setAddModalOpen(true);
  };

  const openProgressModal = (g) => {
    setSelectedGoal(g);
    setExtraAmount('');
    setProgressModalOpen(true);
  };

  const openDeleteModal = (g) => {
    setSelectedGoal(g);
    setDeleteModalOpen(true);
  };

  const resetForm = () => {
    setName('');
    setTargetAmount('');
    setTargetDate('');
    setCurrentAmount('');
    setSelectedGoal(null);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans text-left">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Savings Goals</h2>
          <p className="text-xs text-slate-400">Configure and track long-term savings targets</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 transition-all rounded-xl font-semibold text-xs text-white cursor-pointer shadow-lg shadow-emerald-950/20"
        >
          <Plus className="w-3.5 h-3.5 text-slate-900" />
          Create Goal
        </button>
      </div>

      {/* Main Goal Grid list */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : goals.length === 0 ? (
        <EmptyState
          title="No savings goals logged"
          description="Create savings targets (like emergency funds, investments, or vacations) and track your headway."
          onAdd={openAddModal}
          addText="Create Goal"
          icon={Target}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {goals.map((g) => {
            const percent = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
            const isCompleted = g.status === 'achieved';

            return (
              <div
                key={g._id}
                className={`p-6 rounded-2xl bg-slate-900/40 border backdrop-blur-md relative overflow-hidden transition-all duration-300 flex flex-col justify-between h-56 group ${
                  isCompleted
                    ? 'border-emerald-500/20 hover:border-emerald-500/40 shadow-inner shadow-emerald-950/5'
                    : 'border-slate-800 hover:border-emerald-500/20 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{g.name}</span>
                        {isCompleted && (
                          <span className="px-2 py-0.5 bg-emerald-950/60 border border-emerald-500/30 rounded-full text-[9px] font-bold text-emerald-400 flex items-center gap-0.5">
                            <CheckCircle className="w-2.5 h-2.5" />
                            Achieved
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-white font-outfit">
                        ${g.currentAmount.toLocaleString()} / <span className="text-sm text-slate-500">${g.targetAmount.toLocaleString()}</span>
                      </h3>
                    </div>

                    {/* Actions dropdown hover trigger */}
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditModal(g)}
                        className="p-1 text-slate-500 hover:text-emerald-400 hover:bg-slate-800/40 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(g)}
                        className="p-1 text-slate-500 hover:text-rose-400 hover:bg-slate-800/40 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      Target Date: {new Date(g.targetDate).toLocaleDateString()}
                    </span>
                    <span className="font-bold">{percent}%</span>
                  </div>
                </div>

                {/* Progress bar and adding money action */}
                <div className="space-y-3 mt-4">
                  <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/80">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCompleted ? 'bg-emerald-500 shadow-md shadow-emerald-950/20' : 'bg-emerald-600 shadow-sm'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  {!isCompleted && (
                    <button
                      onClick={() => openProgressModal(g)}
                      className="w-full py-1.5 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-xs border border-slate-700/50 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 shadow-sm"
                    >
                      <Plus className="w-3 h-3" />
                      Add Savings
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Goal Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title={isEditing ? 'Edit Savings Goal' : 'Create Savings Goal'}
        confirmText={isEditing ? 'Save Changes' : 'Create Goal'}
        onConfirm={handleAddSubmit}
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 text-left">
          
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Goal Name
            </label>
            <div className="relative">
              <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="e.g. Emergency Fund"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-850 focus:border-emerald-500 rounded-xl text-sm outline-none text-white placeholder-slate-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Target ($)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="number"
                  placeholder="0.00"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-850 focus:border-emerald-500 rounded-xl text-sm outline-none text-white placeholder-slate-600"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Target Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-850 focus:border-emerald-500 rounded-xl text-sm outline-none text-white"
                />
              </div>
            </div>
          </div>

          {isEditing && (
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Accumulated Amount ($)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="number"
                  placeholder="0.00"
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-850 focus:border-emerald-500 rounded-xl text-sm outline-none text-white placeholder-slate-600"
                />
              </div>
            </div>
          )}

        </form>
      </Modal>

      {/* Add Progress/Savings Modal */}
      <Modal
        isOpen={progressModalOpen}
        onClose={() => setProgressModalOpen(false)}
        title={`Add Savings to "${selectedGoal?.name}"`}
        confirmText="Log Savings"
        onConfirm={handleAddProgress}
      >
        <form onSubmit={handleAddProgress} className="space-y-4 text-left">
          
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Contribution Amount ($)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="number"
                placeholder="e.g. 150"
                value={extraAmount}
                onChange={(e) => setExtraAmount(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-850 focus:border-emerald-500 rounded-xl text-sm outline-none text-white placeholder-slate-600"
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1 pl-1">
              This amount will be added to your current accumulated balance of **${selectedGoal?.currentAmount.toLocaleString()}**.
            </p>
          </div>

        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Remove Savings Target"
        confirmText="Remove Goal"
        confirmVariant="danger"
        onConfirm={handleDelete}
      >
        <p className="text-sm">
          Are you sure you want to remove the savings target for **{selectedGoal?.name}**? Your saved amount progress for this goal will be deleted.
        </p>
      </Modal>

    </div>
  );
};

export default Goals;
