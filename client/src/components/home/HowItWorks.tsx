import React from 'react';
import { ArrowRight } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    title: 'Describe Your Vision',
    subtitle: 'Natural Language Prompting',
    description:
      'Simply type your concept in plain English. WebCraft’s AI architecture interprets layouts, visual themes, responsive structure, and interactive components automatically.',
    glow: 'from-emerald-500/20 via-[#A6FF5D]/10 to-transparent',
    accentColor: '#A6FF5D',
    chip: 'Prompt to Code',
  },
  {
    step: '02',
    title: 'Live Sandbox & AI Chat',
    subtitle: 'Instant Iteration & Revisions',
    description:
      'Inspect your live site in the multi-device sandbox (Mobile, Tablet, Desktop). Converse with AI to tweak sections, or edit the clean HTML & Tailwind CSS directly.',
    glow: 'from-cyan-500/20 via-blue-500/10 to-transparent',
    accentColor: '#38BDF8',
    chip: 'Real-Time Sync',
  },
  {
    step: '03',
    title: '1-Click Export & Publish',
    subtitle: 'Zero Lock-in Ownership',
    description:
      'Download production-ready, standalone HTML files ready to deploy anywhere (Vercel, Netlify, Cloudflare), or publish directly to the public WebCraft community showcase.',
    glow: 'from-purple-500/20 via-pink-500/10 to-transparent',
    accentColor: '#C084FC',
    chip: 'Instant Deploy',
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section className="relative py-28 px-4 max-w-7xl mx-auto">
      {/* Ambient background light beam */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-[#A6FF5D]/10 via-cyan-500/10 to-purple-500/10 blur-[120px] pointer-events-none rounded-full" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-20 relative z-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
          How WebCraft <span className="bg-gradient-to-r from-white via-gray-200 to-[#A6FF5D] bg-clip-text text-transparent">works</span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Transform rough thoughts into fully functional, high-performance websites in three effortless steps.
        </p>
      </div>

      {/* 3 Step Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {STEPS.map((item, index) => (
          <div
            key={index}
            className="group relative rounded-3xl p-8 sm:p-9 bg-gradient-to-b from-white/[0.07] via-white/[0.03] to-white/[0.01] backdrop-blur-2xl border border-white/[0.08] hover:border-white/[0.2] transition-all duration-300 flex flex-col justify-between hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden"
          >
            {/* Dynamic Top Glow */}
            <div
              className={`absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-gradient-to-b ${item.glow} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
            />

            <div>
              {/* Glassmorphic Gray Number Container & Chip */}
              <div className="flex items-center justify-between mb-8">
                <div className="px-4 py-2 rounded-2xl bg-white/[0.04] border border-white/[0.1] backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] flex items-center justify-center group-hover:border-white/[0.2] group-hover:bg-white/[0.07] transition-all duration-300">
                  <span className="text-3xl sm:text-4xl font-black font-mono tracking-tighter bg-gradient-to-b from-gray-200 via-gray-300 to-gray-500 bg-clip-text text-transparent drop-shadow-sm">
                    {item.step}
                  </span>
                </div>
                <span className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-gray-400 backdrop-blur-md shadow-sm">
                  {item.chip}
                </span>
              </div>

              {/* Subtitle & Title */}
              <span
                className="text-xs font-bold uppercase tracking-wider block mb-2"
                style={{ color: item.accentColor }}
              >
                {item.subtitle}
              </span>
              <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-400 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Bottom Interactive Accent Bar */}
            <div className="mt-8 pt-5 border-t border-white/[0.06] flex items-center justify-between text-xs text-gray-400 group-hover:text-white transition-colors">
              <span className="flex items-center gap-2">
                <span
                  className="size-2 rounded-full animate-pulse"
                  style={{ backgroundColor: item.accentColor }}
                />
                <span>Automated AI Pipeline</span>
              </span>
              <ArrowRight className="size-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-white" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
