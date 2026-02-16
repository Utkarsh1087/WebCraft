import { useNavigate, useParams, Link } from 'react-router-dom'
import { useState, useRef, useCallback } from 'react'
import type { Project } from '../types/index.ts'
import { useEffect } from 'react'
import { Loader2Icon, Tablet, LaptopIcon, SmartphoneIcon, SaveIcon, FullscreenIcon, ArrowBigDownDashIcon, EyeIcon } from 'lucide-react'
import { dummyConversations } from '../assets/assets.ts'
import { dummyProjects } from '../assets/assets.ts'
import Sidebar from '../components/Sidebar'

const Projects = () => {

  const { projectId } = useParams()
  const navigate = useNavigate()

  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  const [isGenerating, setIsGenerating] = useState(true)
  const [device, setDevice] = useState<'phone' | 'tablet' | 'desktop'>('desktop')

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(300)
  const isResizing = useRef(false)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    isResizing.current = true
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'

    const onMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return
      const newWidth = Math.min(Math.max(e.clientX, 200), 600)
      setSidebarWidth(newWidth)
    }

    const onMouseUp = () => {
      isResizing.current = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }, [])

  const fetchProject = async () => {
    setLoading(true)
    const project = dummyProjects.find(project => project.id === projectId)
    setTimeout(() => {
      if (project) {
        setProject({ ...project, conversation: dummyConversations });
        setLoading(false)
        setIsGenerating(project.current_code ? false : true)
      } else {
        setLoading(false)
      }
    }, 1000)
  }

  const saveProject = async () => {

  };

  const downloadCode = () => {

  };

  const togglePublish = async () => {

  };

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  if (loading) {
    return (
      <div className='bg-black h-screen flex items-center justify-center'>
        <Loader2Icon className='size-7 animate-spin text-violet-200' />
      </div>
    );
  }

  return project ? (
    <div className='flex flex-col h-[calc(100vh-10rem)] w-full text-white bg-black overflow-hidden'>

      {/* Top Bar */}
      <header className='flex items-center justify-between px-6 h-16 border-b border-gray-800 bg-[#0F1117] shrink-0'>
        {/* Left Section: Logo & Project Info */}
        <div className='flex items-center gap-4 flex-1 min-w-0'>
          <div className='bg-white rounded-full p-1 leading-none shrink-0 cursor-pointer' onClick={() => navigate('/')}>
            <img src="/favicon.svg" alt="logo" className='size-5' />
          </div>
          <div className='flex flex-col min-w-0'>
            <p className='text-sm font-bold truncate leading-tight tracking-tight text-gray-100'>
              {project.name}
            </p>
            <p className='text-[10px] text-gray-500 truncate font-light'>
              Previewing last saved version
            </p>
          </div>
        </div>

        {/* Middle Section: Device Toggles */}
        <div className='flex items-center gap-1 bg-[#1A1D26] p-1 rounded-xl border border-gray-800/50'>
          <button
            onClick={() => setDevice('phone')}
            className={`p-1.5 rounded-lg transition-colors ${device === 'phone' ? "bg-gray-700 text-white" : "text-gray-500 hover:text-white"}`}
          >
            <SmartphoneIcon size={16} />
          </button>
          <button
            onClick={() => setDevice('tablet')}
            className={`p-1.5 rounded-lg transition-colors ${device === 'tablet' ? "bg-gray-700 text-white" : "text-gray-400 hover:text-white"}`}
          >
            <Tablet size={16} />
          </button>
          <button
            onClick={() => setDevice('desktop')}
            className={`p-1.5 rounded-lg transition-colors ${device === 'desktop' ? "bg-gray-700 text-white" : "text-gray-400 hover:text-white"}`}
          >
            <LaptopIcon size={16} />
          </button>
        </div>

        {/* Right Section: Action Buttons */}
        <div className='flex items-center gap-3 flex-1 justify-end'>
          <button
            onClick={saveProject}
            disabled={isSaving}
            className='flex items-center gap-2 px-4 py-1.5 text-xs font-semibold bg-[#1A1D26] hover:bg-[#252A35] border border-gray-800 rounded-xl transition-all active:scale-95 text-gray-200'
          >
            <SaveIcon size={14} />
            <span>Save</span>
          </button>

          <Link
            target='_blank'
            to={`/preview/${projectId}`}
            className='flex items-center gap-2 px-4 py-1.5 text-xs font-semibold bg-[#1A1D26] hover:bg-[#252A35] border border-gray-800 rounded-xl transition-all active:scale-95 text-gray-200'
          >
            <FullscreenIcon size={14} />
            <span>Preview</span>
          </Link>

          <button
            onClick={downloadCode}
            className='flex items-center gap-2 px-5 py-1.5 text-xs font-bold bg-[#2563EB] hover:bg-blue-600 rounded-xl transition-all active:scale-95 text-white shadow-lg shadow-blue-500/20'
          >
            <ArrowBigDownDashIcon size={14} />
            <span>Download</span>
          </button>

          <button
            onClick={togglePublish}
            className='flex items-center gap-2 px-5 py-1.5 text-xs font-bold bg-[#6366F1] hover:bg-indigo-600 rounded-xl transition-all active:scale-95 text-white shadow-lg shadow-indigo-500/20'
          >
            <EyeIcon size={14} />
            <span>Publish</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className='flex flex-1 min-h-0 overflow-hidden'>
        <Sidebar
          isMenuOpen={isMenuOpen}
          project={project}
          setProject={setProject}
          isGenerating={isGenerating}
          setIsGenerating={setIsGenerating}
          width={sidebarWidth}
        />

        {/* Resize Handle */}
        <div
          onMouseDown={handleMouseDown}
          className='w-1 hover:w-1.5 bg-gray-800 hover:bg-indigo-500/50 cursor-col-resize transition-all shrink-0 active:bg-indigo-500'
        />

        {/* Preview Area */}
        <main className='flex-1 min-w-0 bg-[#090A0D] p-6 relative overflow-hidden'>
          <div className='w-full h-full border border-gray-800/50 rounded-2xl bg-[#0F1117] flex flex-col items-center justify-center shadow-2xl relative overflow-hidden'>
            {/* Concentric Scanner Animation */}
            <div className="relative flex items-center justify-center mb-8">
              <div className="absolute size-48 rounded-full border border-indigo-500/20 animate-pulse" style={{ animationDuration: '3s' }} />
              <div className="absolute size-36 rounded-full border border-indigo-500/30 animate-pulse" style={{ animationDuration: '2s' }} />
              <div className="absolute size-24 rounded-full border border-indigo-500/40 animate-pulse" style={{ animationDuration: '1.5s' }} />
              <div className="size-16 bg-[#1A1D26] border border-gray-800 rounded-xl flex items-center justify-center relative z-10 shadow-xl">
                <FullscreenIcon className='size-8 text-indigo-400' />
              </div>
            </div>

            <h2 className='text-lg font-medium mb-2 text-gray-200'>Analyzing your request...</h2>
            <p className='text-sm text-indigo-400/70 font-light'>This may take around 2-3 minutes...</p>
          </div>
        </main>
      </div>
    </div>
  ) : (
    <div className='bg-black min-h-screen flex flex-col items-center justify-center text-white'>
      <p className='text-2xl font-medium text-gray-200'> Unable to load project :(</p>
      <button onClick={() => navigate('/')} className='mt-4 text-indigo-400 hover:underline'>Back to Home</button>
    </div>
  );
};

export default Projects