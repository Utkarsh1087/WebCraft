import React, { useState, useRef } from 'react';
import GlassButton from '../components/GlassButton';
import { Loader } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import api from '@/configs/axios';

import PromptSuggestions from '../components/home/PromptSuggestions';
import HowItWorks from '../components/home/HowItWorks';
import BentoFeatures from '../components/home/BentoFeatures';
import CommunityShowcase from '../components/home/CommunityShowcase';
import FAQSection from '../components/home/FAQSection';
import CTABanner from '../components/home/CTABanner';

const Home = () => {
  const { data: session } = authClient.useSession();
  const navigate = useNavigate();

  const [input, setInput] = React.useState('');
  const [loading, setLoading] = useState(false);
  const promptInputRef = useRef<HTMLTextAreaElement>(null);

  const onSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!session?.user) {
        return toast.error('Please login to create a project');
      } else if (!input.trim()) {
        return toast.error('Please enter a project description');
      }
      setLoading(true);
      const { data } = await api.post('/api/user/project', { initial_prompt: input });
      setLoading(false);
      navigate(`/projects/${data.project_id}`);
    } catch (error: any) {
      setLoading(false);
      toast.error(error?.response?.data?.message || error.message);
      console.log(error);
    }
  };

  const handleSelectPrompt = (selectedPrompt: string) => {
    setInput(selectedPrompt);
    if (promptInputRef.current) {
      promptInputRef.current.focus();
      promptInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const scrollToPrompt = () => {
    if (promptInputRef.current) {
      promptInputRef.current.focus();
      promptInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative text-white overflow-hidden bg-black selection:bg-[#A6FF5D]/30 selection:text-[#A6FF5D]">
      {/* Dynamic Ambient Mesh Glows in Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] -left-[10%] w-[600px] h-[600px] bg-gradient-to-tr from-cyan-600/10 via-blue-600/5 to-transparent rounded-full blur-[140px]" />
        <div className="absolute top-[50%] -right-[10%] w-[600px] h-[600px] bg-gradient-to-bl from-[#A6FF5D]/10 via-emerald-600/5 to-transparent rounded-full blur-[140px]" />
        <div className="absolute top-[80%] left-[20%] w-[600px] h-[600px] bg-gradient-to-r from-purple-600/10 via-pink-600/5 to-transparent rounded-full blur-[140px]" />
      </div>

      {/* Hero Section */}
      <header className="relative -mt-20 pt-28 text-white flex flex-col items-center overflow-hidden pb-16 min-h-screen justify-center z-10">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        >
          <source
            src="https://res.cloudinary.com/deuiyparu/video/upload/v1787264165/original-d940fb9b7d53542e0d887c1e08b60571_qiu0pp.mp4"
            type="video/mp4"
          />
        </video>

        {/* Dark Gradient Overlay for Maximum Readability & Contrast */}
        <div className="absolute inset-0 bg-black/55 bg-gradient-to-b from-black/80 via-black/30 to-black z-[1] pointer-events-none" />

        {/* Modern Badge */}
        <div className="rainbow relative z-10 bg-white/15 overflow-hidden p-px flex items-center justify-center rounded-full transition duration-300 active:scale-100 mt-6 md:mt-10 shadow-lg">
          <button className="flex items-center justify-center gap-3 pl-4 pr-6 py-3 text-white rounded-full font-medium bg-gray-950/80 backdrop-blur-xl">
            <div className="relative flex size-3.5 items-center justify-center">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#A6FF5D] opacity-75 animate-ping duration-300"></span>
              <span className="relative inline-flex size-2 rounded-full bg-[#A6FF5D]"></span>
            </div>
            <span className="text-xs font-semibold tracking-wide">Designed for Modern Websites</span>
          </button>
        </div>

        {/* Main Heading */}
        <h1 className="relative z-10 text-3xl sm:text-4xl md:text-[64px]/[82px] text-center max-w-4xl mt-5 bg-clip-text leading-tight px-6 md:px-4 font-bold tracking-tight">
          Build stunning websites that{' '}
          <span className="bg-gradient-to-r from-white via-gray-200 to-[#A6FF5D] bg-clip-text text-transparent">
            convert & scale
          </span>
        </h1>

        {/* Prompt Creation Box */}
        <form
          onSubmit={onSubmitHandler}
          className="relative z-10 max-w-2xl w-[92%] sm:w-full mt-10 rounded-3xl 
                       bg-black/50 backdrop-blur-2xl 
                       border border-white/15 
                       shadow-[0_10px_60px_rgba(0,0,0,0.6)] 
                       p-5 sm:p-6 transition-all duration-300 
                       focus-within:border-[#A6FF5D]/60 
                       focus-within:shadow-[0_0_70px_rgba(166,255,93,0.2)]"
        >
          <textarea
            ref={promptInputRef}
            onChange={(e) => setInput(e.target.value)}
            value={input}
            className="w-full bg-transparent resize-none outline-none 
                         text-white placeholder:text-gray-400/70 
                         text-sm leading-relaxed"
            rows={4}
            placeholder="Describe your presentation or website in detail..."
            required
          />

          <div className="flex justify-end mt-4">
            {!loading ? (
              <GlassButton text="Create with AI" type="submit" />
            ) : (
              <div className="flex items-center gap-2 text-white text-sm bg-white/10 px-5 py-2.5 rounded-full backdrop-blur">
                <span>Creating Project</span>
                <Loader className="animate-spin size-4 text-[#A6FF5D]" />
              </div>
            )}
          </div>
        </form>

        {/* Minimal Starter Prompt Pills */}
        <PromptSuggestions onSelectPrompt={handleSelectPrompt} />

        {/* CTA Buttons */}
        <div className="relative z-10 flex gap-3.5 mt-8 max-sm:flex-col max-sm:items-center max-sm:w-full max-sm:px-4">
          <button
            onClick={() => {
              if (!session?.user) {
                navigate('/auth/signin');
              } else {
                scrollToPrompt();
              }
            }}
            className="bg-[#A6FF5D] hover:bg-[#A6FF5D]/90 text-gray-950 font-bold px-7 py-3 rounded-full text-sm transition-all duration-200 cursor-pointer group shadow-lg shadow-[#A6FF5D]/25 hover:scale-105"
          >
            <div className="relative overflow-hidden">
              <span className="block transition-transform duration-200 group-hover:-translate-y-full">
                Get Started today
              </span>
              <span className="absolute top-0 left-0 block transition-transform duration-200 group-hover:translate-y-0 translate-y-full">
                Get Started today
              </span>
            </div>
          </button>
          <div className="bg-white/15 hover:bg-white/20 p-px flex items-center justify-center rounded-full hover:scale-105 transition duration-300 active:scale-100">
            <button
              onClick={() => navigate('/community')}
              className="px-7 text-sm py-3 text-white rounded-full bg-black/40 cursor-pointer backdrop-blur-xl font-medium"
            >
              Explore Community
            </button>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <button
          onClick={() => {
            const howItWorksElement = document.getElementById('how-it-works');
            if (howItWorksElement) {
              howItWorksElement.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="relative z-10 scroll-down flex flex-col items-center gap-2 mt-12 animate-bounce cursor-pointer bg-transparent border-0 outline-none"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 9A7 7 0 1 0 5 9v6a7 7 0 1 0 14 0zm-7-3v4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="text-[11px] font-medium text-white/50 tracking-wider uppercase">Explore Features</p>
        </button>
      </header>

      {/* 1. How It Works Section */}
      <div id="how-it-works">
        <HowItWorks />
      </div>

      {/* 2. Bento Grid Feature Highlights */}
      <BentoFeatures />

      {/* 3. Community Showcase */}
      <CommunityShowcase />

      {/* 4. Interactive FAQ Section */}
      <FAQSection />

      {/* 5. High-Converting Bottom CTA Banner */}
      <CTABanner onGetStarted={scrollToPrompt} />
    </div>
  );
};

export default Home;