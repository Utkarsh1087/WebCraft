import React, { useState, useEffect } from 'react';
import type { Project } from '../types/index.ts';
import { Loader2Icon } from 'lucide-react';
import { PlusIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { dummyProjects } from '../assets/assets.ts';
import { TrashIcon } from 'lucide-react';


const MyProjects = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);

  const fetchProjects = async () => {

    setProjects(dummyProjects)

    //simulate loading 
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  };

  const deleteProject = async (projectId: string) => {

  }


  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className='px-4 md:px-16 lg:px-24 xl:px-32 '>
      {loading ? (
        <div className='flex items-center justify-center h-[80vh]'>
          <Loader2Icon className='w-7 h-7 animate-spin text-indigo-200' />

        </div>
      ) : projects.length > 0 ? (
        <div className='py-10 min-h-[80vh]'>
          <div className='flex items-center justify-between mb-12'>
            <h1 className='text-2xl font-medium text-white'>My Projects</h1>
            <button onClick={() => navigate('/')} className='flex items-center gap-2 text-gray-900 px-3 sm:px-4 py-1.5 sm:py-2 text-sm rounded-full bg-white hover:opacity-90 active:scale-95 transition-all'>
              <PlusIcon size={18} /> Create New
            </button>
          </div>
          {/* Render your projects list here */}


          <div className="flex flex-wrap gap-3.5">
            {projects.map((project) => (
              <div
                onClick={() => navigate(`/projects/${project.id}`)}
                key={project.id}
                className='relative group w-72 max-sm:mx-auto cursor-pointer 
                    bg-gray-900/60 border border-gray-700 rounded-lg overflow-hidden
                    shadow-md hover:shadow-xl hover:shadow-indigo-700/40
                    hover:border-indigo-600/80 hover:-translate-y-1
                    transition-all duration-300 ease-out'
              >

                {/*Desktop like mini preview */}

                <div className="relative w-full h-40 bg-gray-900 overflow-hidden border-b border-gray-800">
                  {project.current_code ? (
                    <iframe
                      srcDoc={project.current_code}
                      className='absolute top-0 left-0 w-full h-full pointer-events-none'
                      style={{
                        transform: 'scale(0.24)',
                        transformOrigin: 'top left',
                        width: '1200px',
                        height: '667px'
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <p className="text-sm">No preview available</p>
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/20 to-transparent 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-medium text-base truncate group-hover:text-indigo-300 transition-colors">
                      {project.name || 'Untitled Project'}
                    </h3>
                    <button className='px-2.5 py-0.5 text-xs bg-gray-800 border border-gray-700 rounded-full text-gray-300 flex-shrink-0'>
                      Website
                    </button>
                  </div>
                  <p className="text-gray-400 text-sm mt-2 line-clamp-2 min-h-[40px]">
                    {project.initial_prompt}
                  </p>
                  <div onClick={(e) => e.stopPropagation()} className="flex items-center justify-between mt-4">
                    <span className='text-xs text-gray-500'>
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>

                    <div className="flex <div key={project.id}> gap-2">
                      <button
                        className='px-3 py-1 text-xs border border-gray-700 rounded-md text-gray-300 hover:text-white hover:border-gray-600 transition-colors'
                        onClick={() => navigate(`/preview/${project.id}`)}
                      >
                        Preview
                      </button>
                      <button
                        className='px-3 py-1 text-xs border border-gray-700 rounded-md text-gray-300 hover:text-white hover:border-gray-600 transition-colors'
                        onClick={() => navigate(`/projects/${project.id}`)}
                      >
                        Open
                      </button>
                    </div>
                  </div>
                </div>

                <div onClick={(e) => e.stopPropagation()}>
                  <TrashIcon onClick={() => deleteProject(project.id)} className='absolute top-3 right-3 scale-0 group-hover:scale-100 bg-white p-1.5 size-7 rounded text-red-500 text-xl cursor-pointer transition-all'
                  />
                </div>

                {/* Animated Border Glow on Hover */}
                <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 
                    bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/20 
                    blur-sm -z-10 transition-opacity duration-300">
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="relative flex items-center justify-center min-h-[80vh] overflow-hidden">

          {/* Background Glow */}
          <div className="absolute w-[500px] h-[500px] bg-[#A6FF5D]/10 blur-[120px] rounded-full"></div>

          <div className="relative z-10 text-center max-w-xl px-6">

            {/* Small Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 
                    bg-white/10 border border-white/10 
                    backdrop-blur-md rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-[#A6FF5D] animate-pulse"></span>
              <span className="text-xs text-white/70">
                Ready to create something amazing?
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-3xl md:text-5xl font-semibold text-white leading-tight">
              You don't have any projects yet.
            </h1>

            {/* Subtext */}
            <p className="text-white/60 mt-4 text-sm md:text-base">
              Start building powerful AI presentations in seconds.
              Your first project is just one click away.
            </p>

            {/* CTA */}
            <button
              onClick={() => navigate('/')}
              className="mt-8 bg-[#A6FF5D] hover:bg-[#A6FF5D]/90 
                 text-gray-900 px-8 py-3 rounded-full 
                 text-sm font-medium transition 
                 hover:scale-105 active:scale-95"
            >
              Create Your First Project
            </button>

          </div>
        </div>

      )}
    </div>
  )
}


export default MyProjects;