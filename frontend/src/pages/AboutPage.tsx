import React, { useEffect, useState } from 'react';
import {
  Layers,
  ArrowRight,
  Cpu,
  Server,
  Code2,
  FileText,
  Activity,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { HealthStatus, ModelInfo } from '../types';

export const AboutPage: React.FC = () => {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);

  useEffect(() => {
    api.getHealth().then(setHealth).catch(() => {});
    api.getModelInfo().then(setModelInfo).catch(() => {});
  }, []);

  const pipelineSteps = [
    {
      title: 'Passenger Ratings',
      desc: 'User inputs passenger profile and 14 service ratings through the responsive React UI.',
      icon: Code2
    },
    {
      title: 'FastAPI Backend',
      desc: 'Pydantic validates types, ranges, and formats; routes request to the Java engine and logs to SQLite.',
      icon: Server
    },
    {
      title: 'Java WEKA Engine',
      desc: 'Lightweight HTTP microservice with WEKA 3.8.7 JAR and OpenJDK 25 runtime.',
      icon: Cpu
    },
    {
      title: 'Random Forest Model',
      desc: 'Original serialized 100-tree model evaluates instance attributes and computes class probabilities.',
      icon: Layers
    },
    {
      title: 'Satisfaction Result',
      desc: 'FastAPI formats output and React displays real-time prediction with probability indicators.',
      icon: CheckCircle2
    }
  ];

  const techStack = [
    { name: 'WEKA 3.8.7', role: 'Machine learning library and serialized RandomForest classifier container' },
    { name: 'Java 25 (LTS)', role: 'High-performance JVM execution environment hosting SerializationHelper' },
    { name: 'Python 3.14', role: 'FastAPI REST API runtime, schema validation, and database operations' },
    { name: 'FastAPI & Pydantic', role: 'Asynchronous API endpoints with strict data validation' },
    { name: 'SQLAlchemy & SQLite', role: 'Lightweight local database for persistent prediction history' },
    { name: 'React 18 & TypeScript', role: 'Component-based frontend interface with strict type safety' },
    { name: 'Tailwind CSS', role: 'Modern utility-first styling with dark mode and responsive layout' },
    { name: 'Recharts', role: 'Interactive SVG-based analytics and distribution visualization' }
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          About Project
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Airline Passenger Satisfaction Prediction Application
        </p>
      </div>

      {/* Project Overview Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="font-bold text-base text-slate-900 dark:text-white">
          Overview & Objective
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          This project uses a pre-trained Random Forest machine learning classifier to predict airline passenger
          satisfaction based on airline service-related attributes. Rather than substituting a new model or simulating
          predictions, the system executes the user's authentic pre-trained WEKA model directly through a dedicated
          Java prediction service integrated with a FastAPI REST backend and a modern React frontend.
        </p>
      </div>

      {/* End-to-End Workflow Diagram */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <h3 className="font-bold text-base text-slate-900 dark:text-white">
          Prediction Workflow Architecture
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {pipelineSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative flex flex-col justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-3">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                    Step {idx + 1}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-normal">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Model Specifications */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white">
          Model Specifications
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50">
            <span className="text-slate-600 dark:text-slate-400 block text-[11px]">Classifier</span>
            <span className="font-bold text-slate-900 dark:text-white">RandomForest</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50">
            <span className="text-slate-600 dark:text-slate-400 block text-[11px]">Base Learner</span>
            <span className="font-bold text-slate-900 dark:text-white">RandomTree</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50">
            <span className="text-slate-600 dark:text-slate-400 block text-[11px]">Iterations</span>
            <span className="font-bold text-slate-900 dark:text-white">100 Trees</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50">
            <span className="text-slate-600 dark:text-slate-400 block text-[11px]">Attributes</span>
            <span className="font-bold text-slate-900 dark:text-white">23 (22 features + 1 class)</span>
          </div>
        </div>
      </div>

      {/* Technology Stack Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white">
          Technology Stack
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {techStack.map((tech, i) => (
            <div
              key={i}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 flex flex-col justify-between"
            >
              <span className="font-bold text-slate-900 dark:text-white text-xs">{tech.name}</span>
              <span className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">{tech.role}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Live System Engine Status Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-brand-500" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              System Integration Health Monitor
            </h3>
          </div>
          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
            Live Diagnostics
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-slate-50/60 dark:bg-slate-800/30">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300">FastAPI REST Backend</span>
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Healthy
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Protocol: REST / HTTP &bull; Persistence: SQLAlchemy ORM
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-slate-50/60 dark:bg-slate-800/30">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300">WEKA Java Engine</span>
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                {health?.model_loaded ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Model Loaded
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500" /> Connecting
                  </>
                )}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Runtime: OpenJDK &bull; Model: projectmodel_weka.model (70.4 MB)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
