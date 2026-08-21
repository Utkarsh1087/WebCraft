import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: 'Can I export and host the generated website code anywhere?',
    answer:
      'Yes, absolutely! Every generated website compiles into clean, standalone HTML5 with self-contained Tailwind CSS v4 styling. You can download the complete bundle with 1 click and host it on Vercel, Netlify, Cloudflare Pages, GitHub Pages, or any web server without proprietary runtime lock-in.',
  },
  {
    question: 'How do conversational AI revisions work?',
    answer:
      'Inside your WebCraft studio workspace, you can converse with the AI assistant in plain English (e.g., "Add a dark gradient hero", "Include a sticky pricing table", "Make cards animate on hover"). The AI incrementally updates your code while preserving your existing layouts.',
  },
  {
    question: 'Can I manually edit the code alongside AI?',
    answer:
      'Yes. WebCraft includes a built-in code editor. You can edit HTML & Tailwind CSS classes directly, and the live sandbox iframe hot-reloads your modifications in real-time.',
  },
  {
    question: 'How does version history and snapshot rollback work?',
    answer:
      'WebCraft automatically captures point-in-time code snapshots with every prompt, AI revision, or manual save. You can browse your version timeline in the sidebar and roll back to any past version with 1-click safety.',
  },
  {
    question: 'Are generated websites responsive across mobile devices?',
    answer:
      'Yes. The generation engine utilizes mobile-first Tailwind CSS breakpoints (sm, md, lg, xl). You can toggle between Mobile, Tablet, and Desktop viewports in the live studio to verify responsiveness immediately.',
  },
  {
    question: 'Which AI models power WebCraft?',
    answer:
      'WebCraft utilizes a resilient dual-engine architecture featuring Google Gemini 2.5 with automatic fallback to OpenRouter models, guaranteeing 99.99% generation uptime.',
  },
];

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative py-28 px-4 max-w-4xl mx-auto">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 blur-[130px] pointer-events-none rounded-full" />

      {/* Section Header */}
      <div className="text-center mb-16 relative z-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
          Got questions? <span className="bg-gradient-to-r from-white via-gray-200 to-[#A6FF5D] bg-clip-text text-transparent">We've got answers.</span>
        </h2>
        <p className="mt-3 text-base sm:text-lg text-gray-400 max-w-xl mx-auto leading-relaxed">
          Everything you need to know about WebCraft’s generation workflow, code ownership, and AI engine.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-4 relative z-10">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={`rounded-2xl backdrop-blur-2xl transition-all duration-300 overflow-hidden border ${
                isOpen
                  ? 'bg-gradient-to-b from-white/[0.08] to-white/[0.03] border-white/[0.18] shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
                  : 'bg-white/[0.03] border-white/[0.06] hover:border-white/15'
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
              >
                <span className="text-base sm:text-lg font-semibold text-white">
                  {faq.question}
                </span>
                <div
                  className={`p-2 rounded-full bg-white/[0.05] border border-white/10 text-[#A6FF5D] transition-transform duration-300 shrink-0 ${
                    isOpen ? 'rotate-180 bg-[#A6FF5D]/10' : ''
                  }`}
                >
                  <ChevronDown className="size-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base text-gray-400 leading-relaxed border-t border-white/[0.05]">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FAQSection;
