import React, { useState } from 'react';
import {
  Monitor,
  Smartphone,
  Tablet,
  Zap,
  CheckCircle2,
  Sparkles,
  Layers,
} from 'lucide-react';

const BentoFeatures: React.FC = () => {
  const [activeDevice, setActiveDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  return (
    <section className="relative py-28 px-4 max-w-7xl mx-auto">
      {/* Background ambient lighting orbs */}
      <div className="absolute top-1/3 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 -right-40 w-96 h-96 bg-[#A6FF5D]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-20 relative z-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
          Crafted for <span className="bg-gradient-to-r from-white via-gray-200 to-[#A6FF5D] bg-clip-text text-transparent">speed & absolute precision</span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
          State-of-the-art tooling engineered to bridge prompt-driven imagination and production-ready code.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {/* Bento 1: Live Multi-Device Sandbox (Col-span 2) */}
        <div className="md:col-span-2 group relative p-7 sm:p-9 rounded-3xl bg-gradient-to-b from-white/[0.07] via-white/[0.03] to-white/[0.01] backdrop-blur-2xl border border-white/[0.08] hover:border-white/[0.2] transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
          <div className="relative z-10">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Live Multi-Device Sandbox</h3>
                <p className="text-xs text-gray-400 mt-1">Isolated real-time iframe sandbox with responsive viewport toggles</p>
              </div>

              {/* Device switcher interactive pills */}
              <div className="flex items-center gap-1.5 p-1 bg-black/40 border border-white/10 rounded-xl backdrop-blur">
                <button
                  onClick={() => setActiveDevice('desktop')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    activeDevice === 'desktop' ? 'bg-[#A6FF5D] text-gray-950 shadow-md shadow-[#A6FF5D]/20 scale-105' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Monitor className="size-3.5" />
                  <span className="max-sm:hidden">Desktop</span>
                </button>
                <button
                  onClick={() => setActiveDevice('tablet')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    activeDevice === 'tablet' ? 'bg-[#A6FF5D] text-gray-950 shadow-md shadow-[#A6FF5D]/20 scale-105' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Tablet className="size-3.5" />
                  <span className="max-sm:hidden">Tablet</span>
                </button>
                <button
                  onClick={() => setActiveDevice('mobile')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    activeDevice === 'mobile' ? 'bg-[#A6FF5D] text-gray-950 shadow-md shadow-[#A6FF5D]/20 scale-105' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="size-3.5" />
                  <span className="max-sm:hidden">Mobile</span>
                </button>
              </div>
            </div>

            {/* Interactive Preview Mockup Window */}
            <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-black/80 border border-white/[0.08] shadow-2xl">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.06] text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="size-2.5 rounded-full bg-red-500/80" />
                    <span className="size-2.5 rounded-full bg-yellow-500/80" />
                    <span className="size-2.5 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-[11px] text-gray-400 ml-2 font-mono bg-white/[0.04] px-2.5 py-0.5 rounded border border-white/5">
                    https://sandbox.webcraft.ai/preview
                  </span>
                </div>
                <span className="text-[10px] px-2.5 py-1 rounded bg-[#A6FF5D]/10 text-[#A6FF5D] border border-[#A6FF5D]/20 font-mono font-medium">
                  {activeDevice === 'desktop' ? '1280 × 800 (100%)' : activeDevice === 'tablet' ? '768 × 1024 (Tablet)' : '375 × 667 (Mobile)'}
                </span>
              </div>

              {/* Mockup Canvas */}
              <div
                className={`mx-auto bg-gradient-to-b from-gray-900/90 via-black to-black rounded-xl p-5 border border-white/[0.08] transition-all duration-500 shadow-inner ${
                  activeDevice === 'desktop' ? 'w-full' : activeDevice === 'tablet' ? 'w-3/4' : 'w-1/2'
                }`}
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="h-4 w-24 bg-gradient-to-r from-white/30 to-white/10 rounded-md" />
                  <div className="flex gap-2">
                    <div className="h-3 w-10 bg-white/10 rounded-full" />
                    <div className="h-3 w-12 bg-[#A6FF5D]/30 rounded-full" />
                  </div>
                </div>
                <div className="h-6 w-3/4 bg-gradient-to-r from-white/40 to-white/20 rounded-md mb-2.5" />
                <div className="h-3 w-1/2 bg-white/10 rounded-md mb-5" />
                <div className="grid grid-cols-3 gap-3">
                  <div className="h-16 bg-white/[0.03] border border-white/[0.06] rounded-xl p-2.5 flex flex-col justify-between hover:border-[#A6FF5D]/40 transition">
                    <div className="size-3.5 rounded-full bg-[#A6FF5D]/40" />
                    <div className="h-2 w-12 bg-white/20 rounded" />
                  </div>
                  <div className="h-16 bg-white/[0.03] border border-white/[0.06] rounded-xl p-2.5 flex flex-col justify-between hover:border-cyan-400/40 transition">
                    <div className="size-3.5 rounded-full bg-cyan-400/40" />
                    <div className="h-2 w-12 bg-white/20 rounded" />
                  </div>
                  <div className="h-16 bg-white/[0.03] border border-white/[0.06] rounded-xl p-2.5 flex flex-col justify-between hover:border-purple-400/40 transition">
                    <div className="size-3.5 rounded-full bg-purple-400/40" />
                    <div className="h-2 w-12 bg-white/20 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bento 2: Conversational AI Revisions (Col-span 1) */}
        <div className="group relative p-7 sm:p-9 rounded-3xl bg-gradient-to-b from-white/[0.07] via-white/[0.03] to-white/[0.01] backdrop-blur-2xl border border-white/[0.08] hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight">Iterative AI Revisions</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-6">
              Chat naturally with the assistant to adjust layouts, color palettes, micro-interactions, and component hierarchies.
            </p>

            {/* Chat Mockup */}
            <div className="space-y-3 font-sans">
              <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-gray-200">
                <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block mb-1">User</span>
                "Add a dark gradient hero and a glowing pricing card."
              </div>
              <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200 shadow-sm">
                <span className="text-[10px] text-cyan-400 font-semibold uppercase tracking-wider block mb-1 flex items-center gap-1">
                  <Sparkles className="size-2.5" />
                  WebCraft Assistant
                </span>
                "Applied indigo gradient hero and styled 3-tier glass pricing cards."
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center gap-2 text-xs text-cyan-400 font-medium">
            <Sparkles className="size-3.5" />
            <span>Real-time conversational diffing</span>
          </div>
        </div>

        {/* Bento 3: Instant Version Rollback (Col-span 1) */}
        <div className="group relative p-7 sm:p-9 rounded-3xl bg-gradient-to-b from-white/[0.07] via-white/[0.03] to-white/[0.01] backdrop-blur-2xl border border-white/[0.08] hover:border-purple-500/40 transition-all duration-300 flex flex-col justify-between shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight">Version Snapshots</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-6">
              Every generation and AI revision creates an automated snapshot. Jump back to any previous version in 1 click.
            </p>

            {/* Version timeline pills */}
            <div className="space-y-2 pt-1 font-mono text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-200">
                <span className="font-semibold">v3 (Current)</span>
                <span className="text-[10px] bg-purple-500/20 px-2 py-0.5 rounded-full text-purple-300 font-medium">Active</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-gray-400 hover:text-white cursor-pointer transition">
                <span>v2 (Hero Video)</span>
                <span className="text-[10px] text-gray-500">Rollback</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-gray-400 hover:text-white cursor-pointer transition">
                <span>v1 (Initial Prompt)</span>
                <span className="text-[10px] text-gray-500">Rollback</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center gap-2 text-xs text-purple-400 font-medium">
            <CheckCircle2 className="size-3.5" />
            <span>Point-in-time state recovery</span>
          </div>
        </div>

        {/* Bento 4: Pure Standalone Output (Col-span 1) */}
        <div className="group relative p-7 sm:p-9 rounded-3xl bg-gradient-to-b from-white/[0.07] via-white/[0.03] to-white/[0.01] backdrop-blur-2xl border border-white/[0.08] hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight">Clean Tailwind CSS v4</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-6">
              Production-ready HTML5 code with zero proprietary lock-in. Easy to copy, paste, or drop into any framework.
            </p>

            <div className="p-3.5 rounded-xl bg-black/80 border border-white/[0.08] font-mono text-[11px] text-gray-300 space-y-1.5">
              <div className="text-emerald-400">&lt;div class="flex items-center"&gt;</div>
              <div className="text-gray-400 pl-4">&lt;h1 class="text-4xl font-bold"&gt;</div>
              <div className="text-emerald-400">&lt;/div&gt;</div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center gap-2 text-xs text-emerald-400 font-medium">
            <Layers className="size-3.5" />
            <span>Pure standalone export bundle</span>
          </div>
        </div>

        {/* Bento 5: Multi-Model AI Resilience (Col-span 1) */}
        <div className="group relative p-7 sm:p-9 rounded-3xl bg-gradient-to-b from-white/[0.07] via-white/[0.03] to-white/[0.01] backdrop-blur-2xl border border-white/[0.08] hover:border-[#A6FF5D]/40 transition-all duration-300 flex flex-col justify-between shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight">Zero-Downtime Resilience</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-6">
              Multi-tier engine powered by Google Gemini 2.5 with OpenRouter fallback ensures uninterrupted generation 24/7.
            </p>

            <div className="space-y-2 pt-1 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                <span className="text-white font-medium">Google Gemini 2.5</span>
                <span className="text-[10px] text-[#A6FF5D] font-mono font-semibold">Primary Active</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                <span className="text-white font-medium">OpenRouter Dual Fallback</span>
                <span className="text-[10px] text-gray-400 font-mono font-medium">Standby Ready</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center gap-2 text-xs text-[#A6FF5D] font-medium">
            <Zap className="size-3.5" />
            <span>Sub-second generation latency</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BentoFeatures;
