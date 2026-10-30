import React, { useState, useEffect } from 'react';
import {
  History,
  Trash2,
  ThumbsUp,
  ThumbsDown,
  Search,
  Filter,
  Eye,
  X,
  Calendar,
  AlertCircle,
  Download,
  PlaneTakeoff
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { PredictionHistoryItem } from '../types';

export const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<PredictionHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<PredictionHistoryItem | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      const data = await api.getPredictions(200);
      setHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleClear = async () => {
    try {
      await api.clearPredictions();
      setHistory([]);
      setConfirmClear(false);
    } catch (err) {
      alert('Failed to clear history');
    }
  };

  const handleDeleteOne = async (id: string) => {
    setDeletingId(id);
    try {
      await api.deletePrediction(id);
      setHistory((prev) => prev.filter((item) => item.id !== id));
      if (selectedItem?.id === id) {
        setSelectedItem(null);
      }
    } catch (err) {
      alert('Failed to delete item');
    } finally {
      setDeletingId(null);
    }
  };

  const handleExportCSV = () => {
    if (history.length === 0) return;
    const headers = [
      'ID',
      'Created At',
      'Predicted Class',
      'Probability Satisfied',
      'Probability Neutral/Dissatisfied',
      'Gender',
      'Age',
      'Customer Type',
      'Type of Travel',
      'Flight Class',
      'Distance',
      'Online Boarding',
      'Wifi Service',
      'Seat Comfort',
      'Cleanliness'
    ];
    const rows = history.map((item) => [
      item.id,
      item.created_at,
      item.predicted_class,
      item.probabilities['Satisfied'],
      item.probabilities['Neutral or Dissatisfied'],
      item.gender,
      item.age,
      item.customer_type,
      item.type_of_travel,
      item.flight_class,
      item.flight_distance,
      item.online_boarding,
      item.inflight_wifi_service,
      item.seat_comfort,
      item.cleanliness
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `prediction_history_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.flight_class.toLowerCase().includes(search.toLowerCase()) ||
      item.type_of_travel.toLowerCase().includes(search.toLowerCase());
    const matchesClass =
      filterClass === 'all' || item.predicted_class === filterClass;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Prediction History
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Browse, inspect, and export persistent records stored in the SQLite database.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <>
              <button
                onClick={handleExportCSV}
                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={() => setConfirmClear(true)}
                className="px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-xs font-semibold flex items-center gap-2 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Confirmation Dialog for Clear All */}
      {confirmClear && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <p className="text-xs font-medium">
              Are you sure you want to delete all {history.length} prediction records? This action cannot be undone.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setConfirmClear(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={handleClear}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
            >
              Confirm Clear
            </button>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID, class, or travel purpose..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
          >
            <option value="all">All Outcomes</option>
            <option value="Satisfied">Satisfied Only</option>
            <option value="Neutral or Dissatisfied">Neutral or Dissatisfied Only</option>
          </select>
        </div>
      </div>

      {/* Predictions Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Loading records...</p>
          </div>
        ) : filteredHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                  <th className="py-3 px-4">Date & ID</th>
                  <th className="py-3 px-4">Passenger Profile</th>
                  <th className="py-3 px-4">Predicted Class</th>
                  <th className="py-3 px-4">Probabilities</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredHistory.map((item) => {
                  const isSatisfied = item.predicted_class === 'Satisfied';
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono">
                        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{new Date(item.created_at).toLocaleDateString()}</span>
                        </div>
                        <span className="text-[10px] text-slate-600 dark:text-slate-400 block mt-0.5">
                          {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &bull; {item.id.slice(0, 8)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-900 dark:text-white block">
                          {item.flight_class} &bull; {item.type_of_travel}
                        </span>
                        <span className="text-[11px] text-slate-600 dark:text-slate-400">
                          {item.gender}, {item.age}y &bull; {item.customer_type} &bull; {item.flight_distance} mi
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            isSatisfied
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                          }`}
                        >
                          {isSatisfied ? <ThumbsUp className="w-3 h-3" /> : <ThumbsDown className="w-3 h-3" />}
                          <span>{item.predicted_class}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="w-36 space-y-1">
                          <div className="flex justify-between text-[10px] font-mono">
                            <span className="text-emerald-600 dark:text-emerald-400">
                              {(item.probabilities['Satisfied'] * 100).toFixed(0)}% Sat
                            </span>
                            <span className="text-amber-600 dark:text-amber-400">
                              {(item.probabilities['Neutral or Dissatisfied'] * 100).toFixed(0)}% Neu/Dis
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
                            <div
                              className="bg-emerald-500 h-full"
                              style={{ width: `${item.probabilities['Satisfied'] * 100}%` }}
                            ></div>
                            <div
                              className="bg-amber-500 h-full"
                              style={{ width: `${item.probabilities['Neutral or Dissatisfied'] * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedItem(item)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="View all 22 feature ratings"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteOne(item.id)}
                            disabled={deletingId === item.id}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors disabled:opacity-50"
                            title="Delete this record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center">
            <History className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">No prediction records found</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              {search || filterClass !== 'all'
                ? 'Try adjusting your search criteria or clearing filters.'
                : 'Run satisfaction predictions from the prediction page to populate the history.'}
            </p>
            <Link
              to="/predict"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm transition-all"
            >
              <PlaneTakeoff className="w-3.5 h-3.5" />
              <span>Go to Predictor</span>
            </Link>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Prediction Details & Feature Ratings
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-mono mt-0.5">
                  ID: {selectedItem.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Outcome Pill & Date */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
              <div>
                <span className="text-[11px] text-slate-600 dark:text-slate-400 block font-semibold">Predicted Class</span>
                <span
                  className={`inline-block mt-1 font-bold text-sm px-3 py-1 rounded-full ${
                    selectedItem.predicted_class === 'Satisfied'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                  }`}
                >
                  {selectedItem.predicted_class}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-600 dark:text-slate-400 block font-semibold">Satisfied Prob</span>
                <span className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  {(selectedItem.probabilities['Satisfied'] * 100).toFixed(1)}%
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-600 dark:text-slate-400 block font-semibold">Neutral/Dissat Prob</span>
                <span className="text-sm font-bold font-mono text-amber-600 dark:text-amber-400">
                  {(selectedItem.probabilities['Neutral or Dissatisfied'] * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Demographics */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Demographics & Flight Operations
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/40">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 block">Gender & Age</span>
                  <span className="font-semibold">{selectedItem.gender}, {selectedItem.age} yrs</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/40">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 block">Loyalty Type</span>
                  <span className="font-semibold">{selectedItem.customer_type}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/40">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 block">Travel Purpose</span>
                  <span className="font-semibold">{selectedItem.type_of_travel}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/40">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 block">Cabin Class</span>
                  <span className="font-semibold">{selectedItem.flight_class}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/40">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 block">Flight Distance</span>
                  <span className="font-semibold">{selectedItem.flight_distance} mi</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/40">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 block">Departure Delay</span>
                  <span className="font-semibold">{selectedItem.departure_delay} min</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/40">
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 block">Arrival Delay</span>
                  <span className="font-semibold">{selectedItem.arrival_delay} min</span>
                </div>
              </div>
            </div>

            {/* Service Ratings Grid */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Service Ratings (0–5)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {[
                  { name: 'Online Boarding', val: selectedItem.online_boarding },
                  { name: 'In-flight Wifi', val: selectedItem.inflight_wifi_service },
                  { name: 'In-flight Entertainment', val: selectedItem.inflight_entertainment },
                  { name: 'Seat Comfort', val: selectedItem.seat_comfort },
                  { name: 'Leg Room Service', val: selectedItem.leg_room_service },
                  { name: 'Cleanliness', val: selectedItem.cleanliness },
                  { name: 'Food and Drink', val: selectedItem.food_and_drink },
                  { name: 'In-flight Service', val: selectedItem.inflight_service },
                  { name: 'On-board Service', val: selectedItem.onboard_service },
                  { name: 'Baggage Handling', val: selectedItem.baggage_handling },
                  { name: 'Check-in Service', val: selectedItem.checkin_service },
                  { name: 'Gate Location', val: selectedItem.gate_location },
                  { name: 'Ease of Online Booking', val: selectedItem.ease_of_online_booking },
                  { name: 'Time Convenience', val: selectedItem.departure_and_arrival_time_convenience }
                ].map((r, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-700/40">
                    <span className="text-slate-700 dark:text-slate-300 truncate text-[11px]">{r.name}</span>
                    <span className="font-bold font-mono text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-1.5 py-0.5 rounded text-[11px]">
                      {r.val}/5
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
