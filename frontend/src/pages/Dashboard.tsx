import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  TrendingUp,
  ThumbsUp,
  ThumbsDown,
  PlaneTakeoff,
  Clock,
  ArrowRight,
  ShieldCheck,
  Award,
  BarChart,
  RefreshCw
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { api } from '../services/api';
import { DashboardStats } from '../types';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  const pieData = stats
    ? [
        { name: 'Satisfied', value: stats.satisfied_count, color: '#10b981' },
        { name: 'Neutral or Dissatisfied', value: stats.neutral_dissatisfied_count, color: '#f59e0b' },
      ]
    : [];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Welcome & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Passenger Satisfaction Dashboard
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Real-time inference overview and verified WEKA Random Forest benchmarks.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm disabled:opacity-50"
            title="Refresh statistics"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <Link
            to="/predict"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-md shadow-brand-500/25 transition-all transform active:scale-[0.98]"
          >
            <PlaneTakeoff className="w-4 h-4" />
            <span>New Prediction</span>
          </Link>
        </div>
      </div>

      {/* Historical Verification Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-brand-900 p-6 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold tracking-wide uppercase text-indigo-200 border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Verified Offline Benchmark
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              WEKA 10-Fold Cross-Validation: 96.3435% Accuracy
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed">
              Trained on 129,880 airline passenger instances using RandomForest (100 iterations, base learner RandomTree).
              Separated strictly from live web predictions.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 shrink-0">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center">
              <span className="text-[11px] text-indigo-200 font-medium block">CV Accuracy</span>
              <span className="text-lg font-bold text-white tracking-tight">96.34%</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center">
              <span className="text-[11px] text-indigo-200 font-medium block">Weighted F1</span>
              <span className="text-lg font-bold text-white tracking-tight">0.963</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center">
              <span className="text-[11px] text-indigo-200 font-medium block">ROC-AUC</span>
              <span className="text-lg font-bold text-white tracking-tight">0.995</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center">
              <span className="text-[11px] text-indigo-200 font-medium block">Kappa</span>
              <span className="text-lg font-bold text-white tracking-tight">0.9253</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Application Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Predictions */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Total Live Predictions</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {loading ? '...' : stats?.total_predictions ?? 0}
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Real-time model executions</p>
          </div>
        </div>

        {/* Satisfied Count */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Satisfied Passengers</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ThumbsUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {loading ? '...' : stats?.satisfied_count ?? 0}
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              {loading ? '0%' : `${stats?.satisfied_percentage ?? 0}%`}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Classified as Satisfied</p>
        </div>

        {/* Neutral / Dissatisfied Count */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Neutral / Dissatisfied</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <ThumbsDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {loading ? '...' : stats?.neutral_dissatisfied_count ?? 0}
            </span>
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
              {loading ? '0%' : `${stats?.neutral_dissatisfied_percentage ?? 0}%`}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Classified as Neutral / Dissatisfied</p>
        </div>

        {/* Model Engine Status */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Engine Response</span>
            <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-lg font-bold text-slate-900 dark:text-white">WEKA Live</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">In-Memory Serialization Helper</p>
          </div>
        </div>
      </div>

      {/* Charts & Recent Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Satisfaction Distribution Donut Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart className="w-4 h-4 text-brand-500" />
                Live Distribution
              </h3>
              <span className="text-xs text-slate-600 dark:text-slate-400">Stored Records</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-6">
              Empirical breakdown of predictions generated by the web application.
            </p>
          </div>

          <div className="h-56 flex items-center justify-center">
            {stats && stats.total_predictions > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderRadius: '0.75rem',
                      border: 'none',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center p-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl w-full">
                <PlaneTakeoff className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">No live predictions made yet</p>
                <Link
                  to="/predict"
                  className="mt-3 inline-block text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline"
                >
                  Run your first prediction &rarr;
                </Link>
              </div>
            )}
          </div>

          {stats && stats.total_predictions > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-around text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span className="text-slate-600 dark:text-slate-400">Satisfied: {stats.satisfied_count}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span className="text-slate-600 dark:text-slate-400">Neutral/Dissat: {stats.neutral_dissatisfied_count}</span>
              </div>
            </div>
          )}
        </div>

        {/* Recent Predictions Feed */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-500" />
                Recent Prediction Activity
              </h3>
              <Link
                to="/history"
                className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 flex items-center gap-1"
              >
                View all ({stats?.total_predictions ?? 0})
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
              Latest passenger profiles processed through the WEKA prediction pipeline.
            </p>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
            {stats && stats.recent_predictions.length > 0 ? (
              stats.recent_predictions.slice(0, 5).map((pred) => {
                const isSatisfied = pred.predicted_class === 'Satisfied';
                const confidence = isSatisfied
                  ? pred.probabilities['Satisfied']
                  : pred.probabilities['Neutral or Dissatisfied'];

                return (
                  <div key={pred.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isSatisfied
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                            : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {isSatisfied ? <ThumbsUp className="w-4 h-4" /> : <ThumbsDown className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                            {pred.flight_class} &bull; {pred.type_of_travel}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              isSatisfied
                                ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                                : 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
                            }`}
                          >
                            {pred.predicted_class}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate mt-0.5">
                          {pred.gender}, {pred.age} yrs &bull; Dist: {pred.flight_distance} mi &bull; Boarding: {pred.online_boarding}/5 &bull; Wifi: {pred.inflight_wifi_service}/5
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                        {(confidence * 100).toFixed(1)}% prob
                      </span>
                      <span className="block text-[10px] text-slate-600 dark:text-slate-400">
                        {new Date(pred.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center">
                <p className="text-xs text-slate-600 dark:text-slate-400">No predictions recorded yet.</p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <Link
              to="/predict"
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              Start prediction session <Sparkles className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
