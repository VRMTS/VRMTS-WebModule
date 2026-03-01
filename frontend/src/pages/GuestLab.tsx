import React from "react";
import { Link } from "react-router-dom";
import { Brain, Sparkles, LogIn } from "lucide-react";
import ThreeViewer from "./ThreeViewer";

const GuestLab: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-white/10 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-2xl font-bold">
              <span className="text-white">VRMTS</span>
            </Link>
            <span className="px-3 py-1 text-xs rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/40">
              Guest Mode
            </span>
          </div>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-sm font-semibold hover:from-cyan-400 hover:to-teal-400 transition-all"
          >
            <LogIn className="w-4 h-4" />
            Log in for full access
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left – Intro / text */}
        <section className="space-y-6 lg:col-span-1">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-3 flex items-center gap-3">
              <Brain className="w-8 h-8 text-cyan-400" />
              <span>Basic Anatomy Lab</span>
            </h1>
            <p className="text-slate-300 text-sm md:text-base">
              Explore a simplified 3D skeletal model in your browser. In guest mode you
              can rotate, zoom and inspect major structures, but advanced modules,
              quizzes and analytics are reserved for logged‑in students and instructors.
            </p>
          </div>

          <div className="space-y-3 bg-slate-900/60 border border-white/10 rounded-2xl p-4">
            <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              How to interact
            </h2>
            <ul className="text-xs md:text-sm text-slate-300 space-y-1.5">
              <li>• Drag with mouse to rotate the model.</li>
              <li>• Scroll to zoom in and out.</li>
              <li>• Hover parts to see their technical name.</li>
              <li>• Click a part to highlight it.</li>
            </ul>
          </div>

          <div className="space-y-3 bg-emerald-500/10 border border-emerald-500/40 rounded-2xl p-4">
            <h2 className="text-sm font-semibold text-emerald-300">
              Unlock the full VRMTS experience
            </h2>
            <p className="text-xs md:text-sm text-emerald-50/80">
              Log in to access guided modules, adaptive quizzes, detailed analytics and
              instructor dashboards tailored to your institution.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-gradient-to-r from-cyan-500 to-teal-500 text-xs md:text-sm font-semibold hover:from-cyan-400 hover:to-teal-400 transition-all"
              >
                <LogIn className="w-4 h-4" />
                Log in / Sign up
              </Link>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-emerald-400/60 text-xs md:text-sm text-emerald-200 hover:bg-emerald-500/10"
              >
                Learn more
              </Link>
            </div>
          </div>
        </section>

        {/* Right – 3D Viewer */}
        <section className="lg:col-span-2">
          <div className="bg-slate-900/60 border border-white/10 rounded-2xl overflow-hidden h-[420px] md:h-[520px]">
            <ThreeViewer modelPath="/models/SkeletalSystem100.fbx" />
          </div>
        </section>
      </main>
    </div>
  );
};

export default GuestLab;


