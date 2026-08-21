import React from 'react';
import { Sparkles, Rocket, Laptop, ShoppingBag, Palette, Briefcase, Utensils } from 'lucide-react';

interface PromptSuggestionsProps {
  onSelectPrompt: (prompt: string) => void;
}

const STARTER_PROMPTS = [
  {
    icon: Rocket,
    label: 'SaaS Landing Page',
    prompt: 'Create a modern dark-themed SaaS landing page for an AI analytics platform with interactive pricing table, feature grid, testimonial carousel, and neon gradient buttons.',
  },
  {
    icon: Laptop,
    label: 'Developer Portfolio',
    prompt: 'Design a sleek 3D-inspired developer portfolio website showcasing featured projects, interactive skill badges, experience timeline, and a terminal-style contact section.',
  },
  {
    icon: ShoppingBag,
    label: 'E-Commerce Store',
    prompt: 'Build a luxury streetwear e-commerce landing page with sticky navigation, product showcase grid, animated hover cards, customer reviews, and newsletter subscription.',
  },
  {
    icon: Utensils,
    label: 'Modern Restaurant',
    prompt: 'Create an elegant landing page for an artisan coffee house and bistro with dynamic menu tabs, chef specials, table reservation form, and Google Maps embed layout.',
  },
  {
    icon: Palette,
    label: 'Design Agency',
    prompt: 'Design a high-energy creative agency landing page with bold typography, case study slider, client logo marquee, services accordion, and glassmorphic contact form.',
  },
  {
    icon: Briefcase,
    label: 'FinTech Dashboard',
    prompt: 'Build a futuristic Web3 & FinTech dashboard landing page with live crypto ticker simulation, security audit badges, yield calculator, and FAQ section.',
  },
];

const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({ onSelectPrompt }) => {
  // Duplicate prompts for seamless looping
  const duplicatedPrompts = [...STARTER_PROMPTS, ...STARTER_PROMPTS];

  return (
    <div className="relative z-10 w-full max-w-2xl mt-5 px-2 overflow-hidden">
      {/* Subtle Left & Right Edge Fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black/80 via-black/40 to-transparent z-10" />

      {/* Infinite Scrolling Marquee Track */}
      <div className="animate-marquee flex items-center gap-3 py-1">
        {duplicatedPrompts.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              onClick={() => onSelectPrompt(item.prompt)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium text-gray-300 bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 hover:border-[#A6FF5D]/60 hover:text-white transition-all duration-200 shrink-0 backdrop-blur-md cursor-pointer hover:scale-105 active:scale-95 shadow-sm"
            >
              <Icon className="size-3 text-[#A6FF5D]" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PromptSuggestions;
