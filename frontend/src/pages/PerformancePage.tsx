import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  BarChart2,
  Clock,
  Layers,
  Award,
  BookOpen
} from 'lucide-react';

export const PerformancePage: React.FC = () => {
  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 text-[11px] sm:text-xs font-semibold mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-500 shrink-0" />
          Verified WEKA Evaluation
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Model Performance & Evaluation
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Historical benchmarks obtained using Stratified 10-Fold Cross-Validation in WEKA 3.8.7.
        </p>
      </div>

      {/* Important Disclaimer Notice */}
      <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/60 text-indigo-900 dark:text-indigo-200 text-xs leading-relaxed space-y-1">
        <div className="font-bold flex items-center gap-1.5 text-indigo-950 dark:text-indigo-100">
          <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
          Evaluation Methodology: Stratified 10-Fold Cross-Validation
        </div>
        <p>
          These verified metrics reflect the offline cross-validation performance recorded during model training on 129,880 dataset instances.
          They are distinct from live application inference records. No independent test-set accuracy is claimed.
        </p>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Accuracy */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 block">CV Accuracy</span>
          <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-brand-600 dark:text-brand-400 tracking-tight mt-1 block">
            96.3435%
          </span>
          <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
            125,131 / 129,880 cases
          </span>
        </div>

        {/* Weighted F1 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 block">Weighted F1-Score</span>
          <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight mt-1 block">
            0.963
          </span>
          <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
            Harmonic mean (P & R)
          </span>
        </div>

        {/* ROC Area */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 block">ROC Area (AUC)</span>
          <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight mt-1 block">
            0.995
          </span>
          <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
            Optimal separability
          </span>
        </div>

        {/* Kappa */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 block">Kappa Statistic</span>
          <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1 block">
            0.9253
          </span>
          <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
            High agreement rate
          </span>
        </div>
      </div>

      {/* Secondary Detailed Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-3 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 block">Weighted Precision</span>
          <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">0.964</span>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl p-3 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 block">Weighted Recall</span>
          <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">0.963</span>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl p-3 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 block">Weighted MCC</span>
          <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">0.926</span>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl p-3 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 block">Weighted PRC Area</span>
          <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">0.995</span>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl p-3 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 block">Mean Abs Error (MAE)</span>
          <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">0.0662</span>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl p-3 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 block">Root Mean Sq (RMSE)</span>
          <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">0.1662</span>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl p-3 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 block">Incorrect Cases</span>
          <span className="text-sm sm:text-base font-bold text-rose-600 dark:text-rose-400">4,749 (3.65%)</span>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl p-3 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 block">Model Build Time</span>
          <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">23.16 seconds</span>
        </div>
      </div>

      {/* Verified Confusion Matrix */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 gap-2">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-brand-500 shrink-0" />
              Verified Confusion Matrix
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Exact instance breakdown across 10-fold cross validation.
            </p>
          </div>
          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 w-fit">
            N = 129,880
          </span>
        </div>

        <div className="overflow-x-auto -mx-0">
          <table className="w-full text-center text-xs border-collapse min-w-[500px]">
            <thead>
              <tr>
                <th className="p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold text-left">
                  Actual Class \ Predicted
                </th>
                <th className="p-2.5 sm:p-3 bg-amber-50/50 dark:bg-amber-950/20 border border-slate-200 dark:border-slate-700 text-amber-800 dark:text-amber-300 font-semibold">
                  Pred: Neutral / Dissat
                </th>
                <th className="p-2.5 sm:p-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-slate-200 dark:border-slate-700 text-emerald-800 dark:text-emerald-300 font-semibold">
                  Pred: Satisfied
                </th>
                <th className="p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold">
                  Total Class Size
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2.5 sm:p-3 font-semibold text-left border border-slate-200 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-800/30">
                  Actual: Neutral or Dissatisfied
                </td>
                <td className="p-2.5 sm:p-3 font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/20 border border-slate-200 dark:border-slate-700">
                  72,049 <span className="text-[10px] text-emerald-600 font-normal block">(98.09% True Neg)</span>
                </td>
                <td className="p-2.5 sm:p-3 font-mono font-medium text-rose-600 dark:text-rose-400 border border-slate-200 dark:border-slate-700">
                  1,403 <span className="text-[10px] text-rose-500 font-normal block">(1.91% False Pos)</span>
                </td>
                <td className="p-2.5 sm:p-3 font-mono border border-slate-200 dark:border-slate-700 font-semibold text-slate-600 dark:text-slate-400">
                  73,452
                </td>
              </tr>
              <tr>
                <td className="p-2.5 sm:p-3 font-semibold text-left border border-slate-200 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-800/30">
                  Actual: Satisfied
                </td>
                <td className="p-2.5 sm:p-3 font-mono font-medium text-rose-600 dark:text-rose-400 border border-slate-200 dark:border-slate-700">
                  3,346 <span className="text-[10px] text-rose-500 font-normal block">(5.93% False Neg)</span>
                </td>
                <td className="p-2.5 sm:p-3 font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/20 border border-slate-200 dark:border-slate-700">
                  53,082 <span className="text-[10px] text-emerald-600 font-normal block">(94.07% True Pos)</span>
                </td>
                <td className="p-2.5 sm:p-3 font-mono border border-slate-200 dark:border-slate-700 font-semibold text-slate-600 dark:text-slate-400">
                  56,428
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Metric Interpretations & Glossary */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <BookOpen className="w-4 h-4 text-brand-500 shrink-0" />
          <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
            Metric Explanations & Theory
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white block">Accuracy (96.34%)</span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              The proportion of total cases classified correctly out of all 129,880 evaluations:
              (72,049 + 53,082) / 129,880 = 96.34%.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white block">Weighted Precision (0.964)</span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              The fraction of positive predictions that were true positives. Low false positive rates ensure high reliability when the model flags a passenger as Satisfied.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white block">Weighted Recall (0.963)</span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              The fraction of actual positive instances successfully detected by the classifier. Over 94% of satisfied passengers and 98% of dissatisfied passengers were retrieved.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white block">Weighted F1-Score (0.963)</span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Harmonic mean of precision and recall. Provides a balanced metric taking both false alarms and missed cases into account.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white block">ROC Area / AUC (0.995)</span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Area Under the Receiver Operating Characteristic curve. Measures discriminatory ability across all classification thresholds. A score of 0.995 indicates near-optimal rank discrimination.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white block">Kappa Statistic (0.9253)</span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Cohen's Kappa accounts for agreement occurring by chance. Values above 0.80 indicate strong agreement beyond random baseline; 0.9253 is considered substantial.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
