import React, { useState } from 'react';
import {
  PlaneTakeoff,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Layers,
  Star,
  User,
  Sliders,
  Compass
} from 'lucide-react';
import { api } from '../services/api';
import { PredictionInput, PredictionResponse } from '../types';

const INITIAL_STATE: PredictionInput = {
  gender: 'Female',
  age: 38,
  customer_type: 'Returning',
  type_of_travel: 'Business',
  flight_class: 'Business',
  flight_distance: 1250,
  departure_delay: 0,
  arrival_delay: 0,
  departure_and_arrival_time_convenience: 4,
  ease_of_online_booking: 4,
  checkin_service: 4,
  online_boarding: 5,
  gate_location: 3,
  onboard_service: 4,
  seat_comfort: 5,
  leg_room_service: 4,
  cleanliness: 5,
  food_and_drink: 4,
  inflight_service: 4,
  inflight_wifi_service: 4,
  inflight_entertainment: 5,
  baggage_handling: 4,
};

const PRESETS = [
  {
    name: 'Business Class Frequent Flyer',
    tag: 'High Ratings',
    data: {
      ...INITIAL_STATE,
      gender: 'Female' as const,
      age: 42,
      customer_type: 'Returning' as const,
      type_of_travel: 'Business' as const,
      flight_class: 'Business' as const,
      flight_distance: 2100,
      departure_delay: 0,
      arrival_delay: 0,
      online_boarding: 5,
      seat_comfort: 5,
      inflight_entertainment: 5,
      inflight_wifi_service: 4,
      cleanliness: 5,
      leg_room_service: 5,
      onboard_service: 5,
      baggage_handling: 5,
      checkin_service: 4,
      food_and_drink: 5
    }
  },
  {
    name: 'Delayed Economy Traveler',
    tag: 'Low Ratings',
    data: {
      ...INITIAL_STATE,
      gender: 'Male' as const,
      age: 29,
      customer_type: 'First-time' as const,
      type_of_travel: 'Personal' as const,
      flight_class: 'Economy' as const,
      flight_distance: 650,
      departure_delay: 85,
      arrival_delay: 110,
      departure_and_arrival_time_convenience: 1,
      ease_of_online_booking: 1,
      checkin_service: 2,
      online_boarding: 2,
      gate_location: 2,
      onboard_service: 2,
      seat_comfort: 1,
      leg_room_service: 1,
      cleanliness: 2,
      food_and_drink: 1,
      inflight_service: 2,
      inflight_wifi_service: 1,
      inflight_entertainment: 1,
      baggage_handling: 2
    }
  },
  {
    name: 'Dataset Row 1 Benchmark',
    tag: 'Neutral/Dissat',
    data: {
      ...INITIAL_STATE,
      gender: 'Male' as const,
      age: 48,
      customer_type: 'First-time' as const,
      type_of_travel: 'Business' as const,
      flight_class: 'Business' as const,
      flight_distance: 821,
      departure_delay: 2,
      arrival_delay: 5,
      departure_and_arrival_time_convenience: 3,
      ease_of_online_booking: 3,
      checkin_service: 4,
      online_boarding: 3,
      gate_location: 3,
      onboard_service: 3,
      seat_comfort: 5,
      leg_room_service: 2,
      cleanliness: 5,
      food_and_drink: 5,
      inflight_service: 5,
      inflight_wifi_service: 3,
      inflight_entertainment: 5,
      baggage_handling: 5
    }
  }
];

export const PredictPage: React.FC = () => {
  const [formData, setFormData] = useState<PredictionInput>(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResponse | null>(null);

  const handleRatingChange = (field: keyof PredictionInput, val: number) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleTextChange = (field: keyof PredictionInput, val: any) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const resp = await api.predict(formData);
      setResult(resp);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message || 'An error occurred during prediction.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_STATE);
    setResult(null);
    setError(null);
  };

  const loadPreset = (presetData: PredictionInput) => {
    setFormData(presetData);
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Passenger Satisfaction Prediction
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Input flight details and service ratings to compute real-time classification using the pre-trained WEKA RandomForest model.
        </p>
      </div>

      {/* Preset Quick Fill */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-500 shrink-0" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Quick Test Presets:</span>
        </div>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => loadPreset(p.data)}
              className="px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-all active:scale-95"
            >
              <span>{p.name}</span>
              <span className="ml-1 text-[10px] text-brand-600 dark:text-brand-400 opacity-80">({p.tag})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-sm">Prediction Request Failed</h4>
            <p className="text-xs mt-1 text-rose-600 dark:text-rose-400">{error}</p>
          </div>
        </div>
      )}

      {/* Result Panel (Shown When Predicted) */}
      {result && (
        <div className="rounded-2xl border-2 border-brand-500/30 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-xl transition-all animate-in fade-in slide-in-from-top-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4 sm:mb-6 gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-ping shrink-0"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                Prediction Output (WEKA RandomForest)
              </span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate">
              ID: {result.id}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 items-center">
            {/* Outcome Badge */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
                Classified Outcome
              </span>
              <div
                className={`inline-flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl text-lg sm:text-2xl font-black tracking-tight w-full sm:w-auto ${
                  result.predicted_class === 'Satisfied'
                    ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                }`}
              >
                {result.predicted_class === 'Satisfied' ? (
                  <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7 text-amber-600 shrink-0" />
                )}
                <span className="truncate">{result.predicted_class}</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Evaluation generated by classifying instance against 100 RandomTree estimators.
              </p>
            </div>

            {/* Probability Breakdown */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-700/60 space-y-3 sm:space-y-4">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Estimated Class Probability Distribution
              </span>

              {/* Satisfied probability bar */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700 dark:text-slate-300">Satisfied</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">
                    {(result.probabilities['Satisfied'] * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                    style={{ width: `${result.probabilities['Satisfied'] * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Neutral or Dissatisfied probability bar */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700 dark:text-slate-300">Neutral or Dissatisfied</span>
                  <span className="font-mono text-amber-600 dark:text-amber-400">
                    {(result.probabilities['Neutral or Dissatisfied'] * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-700"
                    style={{ width: `${result.probabilities['Neutral or Dissatisfied'] * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-1 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
                <span>
                  Note: Class probabilities are statistical tree distribution estimates, not absolute guarantees.
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              onClick={() => setResult(null)}
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Modify inputs or test another instance &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Passenger Demographics & Flight Operational Context */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <User className="w-4 h-4 text-brand-500 shrink-0" />
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              1. Passenger & Flight Profile
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 pt-1">
            {/* Gender */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) => handleTextChange('gender', e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </div>

            {/* Age */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Age: <span className="text-brand-600 dark:text-brand-400 font-bold">{formData.age} yrs</span>
              </label>
              <input
                type="number"
                min="1"
                max="120"
                value={formData.age}
                onChange={(e) => handleTextChange('age', parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Customer Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Customer Type
              </label>
              <select
                value={formData.customer_type}
                onChange={(e) => handleTextChange('customer_type', e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="Returning">Returning Customer</option>
                <option value="First-time">First-time Customer</option>
              </select>
            </div>

            {/* Type of Travel */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Type of Travel
              </label>
              <select
                value={formData.type_of_travel}
                onChange={(e) => handleTextChange('type_of_travel', e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="Business">Business</option>
                <option value="Personal">Personal</option>
              </select>
            </div>

            {/* Flight Class */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Cabin Class
              </label>
              <select
                value={formData.flight_class}
                onChange={(e) => handleTextChange('flight_class', e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="Business">Business</option>
                <option value="Economy">Economy</option>
                <option value="Economy Plus">Economy Plus</option>
              </select>
            </div>

            {/* Flight Distance */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Flight Distance (mi)
              </label>
              <input
                type="number"
                min="0"
                max="20000"
                value={formData.flight_distance}
                onChange={(e) => handleTextChange('flight_distance', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Departure Delay */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Departure Delay (min)
              </label>
              <input
                type="number"
                min="0"
                value={formData.departure_delay}
                onChange={(e) => handleTextChange('departure_delay', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Arrival Delay */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Arrival Delay (min)
              </label>
              <input
                type="number"
                min="0"
                value={formData.arrival_delay}
                onChange={(e) => handleTextChange('arrival_delay', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Airport & Convenience Services Ratings */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Compass className="w-4 h-4 text-brand-500 shrink-0" />
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              2. Pre-Flight & Airport Experience (0–5 Rating)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 pt-1">
            <RatingField
              label="Time Convenience"
              value={formData.departure_and_arrival_time_convenience}
              onChange={(v) => handleRatingChange('departure_and_arrival_time_convenience', v)}
            />
            <RatingField
              label="Online Booking Ease"
              value={formData.ease_of_online_booking}
              onChange={(v) => handleRatingChange('ease_of_online_booking', v)}
            />
            <RatingField
              label="Check-in Service"
              value={formData.checkin_service}
              onChange={(v) => handleRatingChange('checkin_service', v)}
            />
            <RatingField
              label="Gate Location"
              value={formData.gate_location}
              onChange={(v) => handleRatingChange('gate_location', v)}
            />
            <RatingField
              label="Online Boarding"
              value={formData.online_boarding}
              onChange={(v) => handleRatingChange('online_boarding', v)}
            />
            <RatingField
              label="Baggage Handling"
              value={formData.baggage_handling}
              onChange={(v) => handleRatingChange('baggage_handling', v)}
            />
          </div>
        </div>

        {/* Section 3: In-Flight Service & Cabin Comfort Ratings */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Sliders className="w-4 h-4 text-brand-500 shrink-0" />
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              3. In-Flight Comfort & Quality Ratings (0–5 Rating)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pt-1">
            <RatingField
              label="Seat Comfort"
              value={formData.seat_comfort}
              onChange={(v) => handleRatingChange('seat_comfort', v)}
            />
            <RatingField
              label="Leg Room Service"
              value={formData.leg_room_service}
              onChange={(v) => handleRatingChange('leg_room_service', v)}
            />
            <RatingField
              label="Cleanliness"
              value={formData.cleanliness}
              onChange={(v) => handleRatingChange('cleanliness', v)}
            />
            <RatingField
              label="Food and Drink"
              value={formData.food_and_drink}
              onChange={(v) => handleRatingChange('food_and_drink', v)}
            />
            <RatingField
              label="In-Flight Service"
              value={formData.inflight_service}
              onChange={(v) => handleRatingChange('inflight_service', v)}
            />
            <RatingField
              label="On-board Service"
              value={formData.onboard_service}
              onChange={(v) => handleRatingChange('onboard_service', v)}
            />
            <RatingField
              label="In-flight Wifi"
              value={formData.inflight_wifi_service}
              onChange={(v) => handleRatingChange('inflight_wifi_service', v)}
            />
            <RatingField
              label="In-flight Entertainment"
              value={formData.inflight_entertainment}
              onChange={(v) => handleRatingChange('inflight_entertainment', v)}
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs sm:text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Form</span>
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-brand-500/25 transition-all transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Executing WEKA Model...</span>
              </>
            ) : (
              <>
                <PlaneTakeoff className="w-4 h-4" />
                <span>Predict Satisfaction</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

interface RatingFieldProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
}

const RatingField: React.FC<RatingFieldProps> = ({ label, value, onChange }) => {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-tight truncate">
          {label}
        </label>
        <span className="text-[11px] font-bold text-brand-600 dark:text-brand-400 font-mono px-1.5 py-0.5 rounded bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-900/60">
          {value}/5
        </span>
      </div>

      <div className="grid grid-cols-6 gap-1">
        {[0, 1, 2, 3, 4, 5].map((starVal) => {
          const isSelected = starVal === value;
          return (
            <button
              key={starVal}
              type="button"
              onClick={() => onChange(starVal)}
              className={`py-2 rounded-lg text-xs font-bold transition-all text-center select-none active:scale-95 ${
                isSelected
                  ? 'bg-brand-600 text-white shadow-sm ring-2 ring-brand-400/40'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
              title={`Rate ${starVal} out of 5`}
            >
              {starVal}
            </button>
          );
        })}
      </div>
    </div>
  );
};
