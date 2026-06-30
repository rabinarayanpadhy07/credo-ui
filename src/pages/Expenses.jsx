/* oxlint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api.js';
import { useToast } from '../context/ToastContext.jsx';
import { TableSkeleton } from '../components/ui/Skeletons.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Modal from '../components/ui/Modal.jsx';
import {
  TrendingDown,
  Download,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
  Calendar,
  DollarSign,
  Tag,
  FileText,
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

const Expenses = () => {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [pagination, setPagination] = useState({});
  
  // Query Filters
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  // Form state
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [formCategory, setFormCategory] = useState(CATEGORIES[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isEditing, setIsEditing] = useState(false);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`/expense/get?page=${page}&limit=${limit}&search=${search}&category=${category}`);
      setExpenses(res.data.expenses);
      setPagination(res.data.pagination);
    } catch (err) {
      showToast(err.message || 'Failed to load expenses', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [page, category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchExpenses();
  };

  const handleAddSubmit = async (e) => {
    e?.preventDefault?.();
    if (!description || !amount || !date) {
      return showToast('Please fill in all fields', 'warning');
    }

    try {
      if (isEditing && selectedExpense) {
        await apiFetch(`/expense/update/${selectedExpense._id}`, {
          method: 'PUT',
          body: JSON.stringify({ description, amount: Number(amount), category: formCategory, date }),
        });
        showToast('Expense updated successfully!', 'success');
      } else {
        await apiFetch('/expense/add', {
          method: 'POST',
          body: JSON.stringify({ description, amount: Number(amount), category: formCategory, date }),
        });
        showToast('Expense added successfully!', 'success');
      }
      setAddModalOpen(false);
      resetForm();
      fetchExpenses();
    } catch (err) {
      showToast(err.message || 'Failed to save expense', 'error');
    }
  };

  const handleDelete = async () => {
    if (!selectedExpense) return;
    try {
      await apiFetch(`/expense/delete/${selectedExpense._id}`, { method: 'DELETE' });
      showToast('Expense record deleted', 'info');
      setDeleteModalOpen(false);
      fetchExpenses();
    } catch (err) {
      showToast(err.message || 'Failed to delete record', 'error');
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    resetForm();
    setAddModalOpen(true);
  };

  const openEditModal = (exp) => {
    setIsEditing(true);
    setSelectedExpense(exp);
    setDescription(exp.description);
    setAmount(exp.amount);
    setFormCategory(exp.category);
    setDate(new Date(exp.date).toISOString().split('T')[0]);
    setAddModalOpen(true);
  };

  const openDeleteModal = (exp) => {
    setSelectedExpense(exp);
    setDeleteModalOpen(true);
  };

  const resetForm = () => {
    setDescription('');
    setAmount('');
    setFormCategory(CATEGORIES[0]);
    setDate(new Date().toISOString().split('T')[0]);
    setSelectedExpense(null);
  };

  const downloadExcel = async () => {
    try {
      const response = await apiFetch('/expense/downloadexcel');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'expense_details.xlsx';
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      showToast(err.message || 'Failed to export expense records', 'error');
    }
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans text-left">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Expense Management</h2>
          <p className="text-xs text-slate-400">Track and analyze cash outflows</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={downloadExcel}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700/80 transition-all rounded-xl font-semibold text-xs text-slate-200 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            Export Excel
          </button>
          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 transition-all rounded-xl font-semibold text-xs text-white cursor-pointer shadow-lg shadow-emerald-950/20"
          >
            <Plus className="w-3.5 h-3.5 text-slate-900" />
            Add Expense
          </button>
        </div>
      </div>

      {/* Query Filters */}
      <div className="p-4 bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl flex flex-col gap-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:border-emerald-500 outline-none transition-all duration-200"
            />
          </form>

          {/* Category Quick Select */}
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => { setCategory(''); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 cursor-pointer ${
                category === ''
                  ? 'bg-emerald-600/10 border border-emerald-500/20 text-emerald-400'
                  : 'bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              All Categories
            </button>
            {CATEGORIES.slice(0, 5).map((cat) => (
              <button
                key={cat}
                onClick={() => { setCategory(cat); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 cursor-pointer ${
                  category === cat
                    ? 'bg-emerald-600/10 border border-emerald-500/20 text-emerald-400'
                    : 'bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Extra Category Row */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.slice(5).map((cat) => (
            <button
              key={cat}
              onClick={() => { setCategory(cat); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 cursor-pointer ${
                category === cat
                  ? 'bg-emerald-600/10 border border-emerald-500/20 text-emerald-400'
                  : 'bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Expense Database */}
      {loading ? (
        <TableSkeleton rows={5} />
      ) : expenses.length === 0 ? (
        <EmptyState
          title="No expense entries logged"
          description="Log rent, utility bills, restaurant checks, or entertainment fees to start tracking your cash outflows."
          onAdd={openAddModal}
          addText="Add Expense"
          icon={TrendingDown}
        />
      ) : (
        <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl overflow-hidden p-6 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800/60 text-slate-500 font-bold text-xs uppercase tracking-wider">
                  <th className="pb-3 text-left font-bold">Expense</th>
                  <th className="pb-3 text-left font-bold">Category</th>
                  <th className="pb-3 text-left font-bold">Date</th>
                  <th className="pb-3 text-right font-bold">Amount</th>
                  <th className="pb-3 text-center font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/35">
                {expenses.map((exp) => (
                  <tr key={exp._id} className="group">
                    <td className="py-3.5 text-left font-semibold text-slate-200 group-hover:text-white transition-colors">
                      {exp.description}
                    </td>
                    <td className="py-3.5 text-left">
                      <span className="px-2.5 py-0.5 bg-slate-850 border border-slate-700/40 rounded-full text-[10px] font-bold text-slate-400">
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-3.5 text-left text-slate-400 text-xs font-medium">
                      {new Date(exp.date).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 text-right font-bold text-rose-400 font-outfit">
                      -${exp.amount.toFixed(2)}
                    </td>
                    <td className="py-3.5 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => openEditModal(exp)}
                          className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800/50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(exp)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800/50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-slate-800/60 mt-4">
              <span className="text-xs text-slate-400 font-medium">
                Page {pagination.page} of {pagination.pages} ({pagination.total} entries)
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
                  disabled={page === pagination.pages}
                  className="p-2 bg-slate-950/60 border border-slate-850 hover:border-slate-800 rounded-xl disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title={isEditing ? 'Edit Expense' : 'Add Expense'}
        confirmText={isEditing ? 'Save Changes' : 'Add Entry'}
        onConfirm={handleAddSubmit}
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 text-left">
          
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Description
            </label>
            <div className="relative">
              <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="e.g. Electric Bill"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-850 focus:border-emerald-500 rounded-xl text-sm outline-none text-white placeholder-slate-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Amount ($)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-850 focus:border-emerald-500 rounded-xl text-sm outline-none text-white placeholder-slate-600"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-850 focus:border-emerald-500 rounded-xl text-sm outline-none text-white"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Category
            </label>
            <div className="relative">
              <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
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

        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Deletion"
        confirmText="Delete Record"
        confirmVariant="danger"
        onConfirm={handleDelete}
      >
        <p className="text-sm">
          Are you sure you want to delete the expense record for **{selectedExpense?.description}**? This action is permanent and cannot be undone.
        </p>
      </Modal>

    </div>
  );
};

export default Expenses;
