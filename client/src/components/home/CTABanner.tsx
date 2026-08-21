import React from 'react';
import { Sparkles, ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CTABannerProps {
  onGetStarted: () => void;
}

const CTABanner: React.FC<CTABannerProps> = ({ onGetStarted }) => {
  const navigate = useNavigate();

  return (
    <section className="relative py-20 px-4 max-w-6xl mx-auto mb-16">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-white/[0.08] via-black/80 to-black p-8 sm:p-14 md:p-18 border border-white/[0.15] shadow-[0_0_100px_rgba(166,255,93,0.15)] text-center backdrop-blur-2xl">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-36 bg-gradient-to-b from-[#A6FF5D]/25 via-cyan-500/10 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-1/2 h-36 bg-gradient-to-t from-purple-500/20 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
            Ready to craft your next website in <span className="bg-gradient-to-r from-[#A6FF5D] to-emerald-400 bg-clip-text text-transparent">seconds</span>?
          </h2>

          <p className="mt-5 text-base sm:text-lg text-gray-300 max-w-xl mx-auto leading-relaxed">
            Join thousands of developers, founders, and creators building responsive, production-grade websites with WebCraft AI.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto bg-[#A6FF5D] hover:bg-[#A6FF5D]/90 text-gray-950 font-bold px-8 py-3.5 rounded-full text-sm transition-all duration-200 cursor-pointer shadow-[0_0_30px_rgba(166,255,93,0.3)] hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <Sparkles className="size-4 text-gray-950" />
              <span>Start Building Free</span>
              <ArrowRight className="size-4" />
            </button>

            <button
              onClick={() => navigate('/pricing')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-sm font-semibold text-white transition-all duration-200 cursor-pointer backdrop-blur hover:scale-105 active:scale-95"
            >
              View Pricing Plans
            </button>
          </div>

          {/* Micro Value Props */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-12 pt-8 border-t border-white/[0.08] text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <Check className="size-4 text-[#A6FF5D]" />
              <span>Free Credits Included</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="size-4 text-[#A6FF5D]" />
              <span>Tailwind CSS v4 Standalone Output</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="size-4 text-[#A6FF5D]" />
              <span>Zero Proprietary Lock-In</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;
