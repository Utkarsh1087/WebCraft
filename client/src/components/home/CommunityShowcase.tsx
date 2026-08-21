import React from 'react';
import { ArrowRight, ExternalLink, Globe } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { dummyProjects } from '../../assets/assets';

const CommunityShowcase: React.FC = () => {
  const navigate = useNavigate();
  const showcaseProjects = dummyProjects.slice(0, 3);

  return (
    <section className="relative py-28 px-4 max-w-7xl mx-auto">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-purple-500/10 blur-[130px] pointer-events-none rounded-full" />

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 relative z-10">
        <div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
            Created with <span className="bg-gradient-to-r from-white via-gray-200 to-[#A6FF5D] bg-clip-text text-transparent">WebCraft</span>
          </h2>
          <p className="mt-3 text-base sm:text-lg text-gray-400 max-w-2xl leading-relaxed">
            Explore live responsive websites crafted entirely through natural language prompts and live revisions.
          </p>
        </div>

        <button
          onClick={() => navigate('/community')}
          className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-white/20 text-sm font-semibold text-white transition-all duration-200 cursor-pointer self-start md:self-auto group backdrop-blur-xl hover:scale-105 shadow-md"
        >
          <span>Explore All Creations</span>
          <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform text-[#A6FF5D]" />
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {showcaseProjects.map((project, index) => (
          <Link
            key={project.id || index}
            to={`/view/${project.id}`}
            target="_blank"
            className="group relative rounded-3xl bg-gradient-to-b from-white/[0.07] via-white/[0.03] to-white/[0.01] backdrop-blur-2xl border border-white/[0.08] hover:border-[#A6FF5D]/40 overflow-hidden transition-all duration-300 flex flex-col justify-between hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
          >
            {/* Desktop Mockup Preview Frame */}
            <div className="relative w-full h-52 sm:h-56 bg-black/90 overflow-hidden border-b border-white/[0.08]">
              {project.current_code ? (
                <iframe
                  srcDoc={project.current_code}
                  title={project.name || 'Preview'}
                  className="absolute top-0 left-0 w-full h-full pointer-events-none"
                  style={{
                    transform: 'scale(0.35)',
                    transformOrigin: 'top left',
                    width: '1200px',
                    height: '667px',
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-600 text-xs font-mono">
                  No preview available
                </div>
              )}

              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 justify-between">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg">
                  <ExternalLink className="size-3 text-[#A6FF5D]" />
                  <span>Open Fullsite</span>
                </span>
                <span className="text-xs text-[#A6FF5D] font-mono bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-[#A6FF5D]/20">
                  Tailwind v4
                </span>
              </div>
            </div>

            {/* Project Meta */}
            <div className="p-6 flex flex-col justify-between flex-grow">
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-lg font-bold text-white group-hover:text-[#A6FF5D] transition-colors truncate">
                    {project.name || 'AI Generated Portfolio'}
                  </h3>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-gray-300 font-mono">
                    Live
                  </span>
                </div>
                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-6">
                  {project.initial_prompt || 'Custom responsive website created with WebCraft.'}
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-2">
                  <Globe className="size-3.5 text-[#A6FF5D]" />
                  <span>Interactive Preview</span>
                </span>
                <span className="text-gray-300 font-medium group-hover:text-[#A6FF5D] transition-colors flex items-center gap-1">
                  <span>View Project</span>
                  <span>&rarr;</span>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CommunityShowcase;
