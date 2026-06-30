/* oxlint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api.js';
import { useToast } from '../context/ToastContext.jsx';
import { ChartSkeleton } from '../components/ui/Skeletons.jsx';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  Cell,
} from 'recharts';
import { PieChart, Pie } from 'recharts';

const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6', '#ef4444'];

const Analytics = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/dashboard');
      setData(res.data.dashboard);
    } catch (err) {
      showToast(err.message || 'Failed to fetch analytics data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
        <ChartSkeleton />
      </div>
    );
  }

  const {
    monthlyIncome = 0,
    monthlyExpense = 0,
    savings = 0,
    expenseDistribution = [],
    budgetProgress = [],
  } = data || {};

  // Data for visual budget limit vs actual spent comparison
  const comparisonData = budgetProgress.map(b => ({
    name: b.category,
    Limit: b.limit,
    Spent: b.spent,
  }));

  // Cash flow summary statistics for tooltips
  const cashFlowSummary = [
    { name: 'Income', amount: monthlyIncome },
    { name: 'Expenses', amount: monthlyExpense },
    { name: 'Savings', amount: savings > 0 ? savings : 0 },
  ];

  return (
    <div className="space-y-6 text-slate-100 font-sans text-left">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Financial Analytics</h2>
        <p className="text-xs text-slate-400">Detailed visual metrics of your savings and spending structures</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Income vs Expenses Area Chart */}
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md">
          <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Cash Flow Overview</h4>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashFlowSummary}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="amount" stroke="#10b981" fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Categories Breakdown */}
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Expense Distribution</h4>
            {expenseDistribution.length === 0 ? (
              <p className="text-xs text-slate-500 py-12 text-center">No expenses recorded this month.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                <div className="h-[180px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseDistribution}
                        dataKey="amount"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={3}
                      >
                        {expenseDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => `$${v}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="space-y-2">
                  {expenseDistribution.slice(0, 5).map((entry, index) => (
                    <div key={entry.category} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-slate-300 font-semibold">{entry.category}</span>
                      </div>
                      <span className="text-slate-400 font-bold">${entry.amount.toFixed(2)} ({entry.percent}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Budget Limit vs Spent comparison */}
      <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md">
        <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Budgets Limit vs Actual Spent</h4>
        {comparisonData.length === 0 ? (
          <p className="text-xs text-slate-500 py-12 text-center">Set category budgets in the Budgets section to enable comparative analysis.</p>
        ) : (
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <Legend iconType="circle" fontSize={11} wrapperStyle={{ paddingTop: '10px' }} />
                <Bar dataKey="Limit" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Spent" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

    </div>
  );
};

export default Analytics;
