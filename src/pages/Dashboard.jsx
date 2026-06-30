/* oxlint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../utils/api.js';
import { useToast } from '../context/ToastContext.jsx';
import { CardSkeleton, ChartSkeleton } from '../components/ui/Skeletons.jsx';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Percent,
  Bot,
  ArrowRight,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6', '#ef4444'];

const Dashboard = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [insights, setInsights] = useState('');
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [insightsError, setInsightsError] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const res = await apiFetch('/dashboard');
      setData(res.data.dashboard);
    } catch (err) {
      showToast(err.message || 'Failed to fetch dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchAIInsights = async () => {
    setInsightsLoading(true);
    setInsightsError(false);
    try {
      const res = await apiFetch('/ai/insights');
      setInsights(res.data.insights);
    } catch {
      setInsightsError(true);
      showToast('Could not load AI Insights', 'info');
    } finally {
      setInsightsLoading(false);
    }
  };

  const renderInsightsContent = (content) => {
    if (!content) return null;
    let html = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.*?)$/gm, '• $1')
      .replace(/\n/g, '<br />');
    
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  };

  useEffect(() => {
    fetchDashboardData();
    fetchAIInsights();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2">
            <ChartSkeleton />
          </div>
          <ChartSkeleton />
        </div>
      </div>
    );
  }

  const {
    monthlyIncome = 0,
    monthlyExpense = 0,
    savings = 0,
    savingsRate = 0,
    recentTransactions = [],
    expenseDistribution = [],
    budgetProgress = [],
  } = data || {};

  const barChartData = [
    { name: 'Income', amount: monthlyIncome },
    { name: 'Expenses', amount: monthlyExpense },
    { name: 'Savings', amount: savings > 0 ? savings : 0 },
  ];

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      
      {/* Header quick actions */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Overview</h2>
          <p className="text-xs text-slate-400">Manage your transactions and financial growth</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/incomes')}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700/80 transition-all rounded-xl font-semibold text-xs text-slate-200 cursor-pointer shadow-md"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            Add Income
          </button>
          <button
            onClick={() => navigate('/expenses')}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 transition-all rounded-xl font-semibold text-xs text-slate-950 cursor-pointer shadow-lg shadow-emerald-950/20"
          >
            <Plus className="w-3.5 h-3.5 text-slate-950" />
            Add Expense
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Income Card */}
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Monthly Income</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1 font-outfit">₹{monthlyIncome.toLocaleString()}</h3>
          <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            Active Cash Inflow
          </p>
        </div>

        {/* Expenses Card */}
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md relative overflow-hidden group hover:border-rose-500/20 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl group-hover:bg-rose-500/10 transition-all" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Monthly Expenses</span>
            <div className="p-2 bg-rose-500/10 text-rose-400 rounded-xl">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1 font-outfit">₹{monthlyExpense.toLocaleString()}</h3>
          <p className="text-[10px] text-rose-400 font-semibold flex items-center gap-1">
            <ArrowDownRight className="w-3.5 h-3.5" />
            Active Cash Outflow
          </p>
        </div>

        {/* Net Savings Card */}
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md relative overflow-hidden group hover:border-teal-500/20 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-2xl group-hover:bg-teal-500/10 transition-all" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Net Savings</span>
            <div className="p-2 bg-teal-500/10 text-teal-400 rounded-xl">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <h3 className={`text-2xl font-bold mb-1 font-outfit ${savings >= 0 ? 'text-white' : 'text-rose-400'}`}>
            {savings < 0 ? '-' : ''}₹{Math.abs(savings).toLocaleString()}
          </h3>
          <p className="text-[10px] text-teal-400 font-semibold flex items-center gap-1">
            Net balance this month
          </p>
        </div>

        {/* Savings Rate Card */}
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md relative overflow-hidden group hover:border-blue-500/20 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Savings Rate</span>
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1 font-outfit">{savingsRate}%</h3>
          <p className="text-[10px] text-blue-400 font-semibold flex items-center gap-1">
            Of total income saved
          </p>
        </div>

      </div>

      {/* AI insights callout banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-teal-950/30 border border-emerald-500/20 relative overflow-hidden shadow-inner flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-400/5 rounded-full blur-3xl" />
        <div className="flex gap-4 items-start w-full">
          <div className="p-3 bg-emerald-500/15 text-emerald-400 rounded-xl mt-0.5 border border-emerald-500/10 shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div className="space-y-2 text-left flex-1 min-w-0">
            <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-1.5">
              Credo AI Insights
            </h4>
            <div className="text-xs text-slate-350 leading-relaxed max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {insightsLoading ? (
                <div className="flex items-center gap-2 text-slate-400 animate-pulse py-1">
                  Analyzing database context...
                </div>
              ) : insightsError ? (
                <div className="flex items-center gap-3 text-rose-400 py-1">
                  <span>Failed to load financial insights.</span>
                  <button
                    onClick={fetchAIInsights}
                    className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Retry
                  </button>
                </div>
              ) : !insights ? (
                <div className="text-slate-500 py-1">
                  No insights available. Log some transactions to get started.
                </div>
              ) : (
                renderInsightsContent(insights)
              )}
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate('/ai-chat')}
          className="flex items-center gap-1 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-950/20 cursor-pointer self-start md:self-auto shrink-0 transition-all border border-emerald-400/20"
        >
          Ask AI Assistant
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Charts area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Cash Flow Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md text-left">
          <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Cash Flow Breakdown</h4>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} barSize={40}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                  <Cell fill="#10b981" />
                  <Cell fill="#ef4444" />
                  <Cell fill="#06b6d4" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense distribution pie chart */}
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md flex flex-col text-left">
          <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Expense Distribution</h4>
          <div className="flex-1 flex flex-col items-center justify-center min-h-[220px]">
            {expenseDistribution.length === 0 ? (
              <p className="text-xs text-slate-500">No expenses recorded this month.</p>
            ) : (
              <div className="h-[200px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseDistribution}
                      dataKey="amount"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={3}
                    >
                      {expenseDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#1e293b',
                        borderRadius: '12px',
                        color: '#f8fafc',
                        fontSize: '12px',
                      }}
                      formatter={(v) => `₹${v}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
            
            {/* Custom Pie Legend */}
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 justify-center mt-4">
              {expenseDistribution.slice(0, 4).map((entry, idx) => (
                <div key={entry.category} className="flex items-center gap-1.5 text-[10px] text-slate-400">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  />
                  <span>
                    {entry.category} ({entry.percent}%)
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

      {/* Row: Recent Transactions & Active Budgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Transactions Table */}
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md text-left flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-5">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Recent Transactions</h4>
              <Link to="/transactions" className="text-xs text-emerald-400 hover:text-emerald-300 font-bold transition-colors flex items-center gap-0.5">
                View all
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentTransactions.length === 0 ? (
              <p className="text-xs text-slate-500 py-8 text-center">No transactions logged this month.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-800/60 text-slate-500 font-bold text-xs uppercase tracking-wider">
                      <th className="pb-3 text-left font-bold">Description</th>
                      <th className="pb-3 text-left font-bold">Category</th>
                      <th className="pb-3 text-right font-bold">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/35">
                    {recentTransactions.map((tx) => (
                      <tr key={tx._id} className="group">
                        <td className="py-3 text-left">
                          <span className="font-semibold text-slate-200 group-hover:text-white transition-colors">{tx.description}</span>
                          <span className="block text-[10px] text-slate-500 mt-0.5">{new Date(tx.date).toLocaleDateString()}</span>
                        </td>
                        <td className="py-3 text-left">
                          <span className="px-2 py-0.5 bg-slate-800/60 border border-slate-700/40 rounded-full text-[10px] font-bold text-slate-400">
                            {tx.category}
                          </span>
                        </td>
                        <td className={`py-3 text-right font-bold ${tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Active Budgets progress panel */}
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md text-left flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-5">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Active Budgets</h4>
              <Link to="/budgets" className="text-xs text-emerald-400 hover:text-emerald-300 font-bold transition-colors flex items-center gap-0.5">
                Manage budgets
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {budgetProgress.length === 0 ? (
              <p className="text-xs text-slate-500 py-8 text-center">No active budgets logged for this month.</p>
            ) : (
              <div className="space-y-4">
                {budgetProgress.slice(0, 4).map((b) => (
                  <div key={b.category} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">{b.category}</span>
                      <span className="text-slate-400">
                        ₹{b.spent.toLocaleString()} / <span className="text-slate-500">₹{b.limit.toLocaleString()}</span>
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/60">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          b.percentUsed >= 100 
                            ? 'bg-rose-500 shadow-md shadow-rose-950/20' 
                            : b.percentUsed >= 85 
                            ? 'bg-amber-500 shadow-md shadow-amber-950/20' 
                            : 'bg-emerald-500 shadow-md shadow-emerald-950/20'
                        }`}
                        style={{ width: `${Math.min(100, b.percentUsed)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
