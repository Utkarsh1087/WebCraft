import { useNavigate, useParams, Link } from 'react-router-dom'
import { useState, useRef, useCallback } from 'react'
import type { Project } from '../types/index.ts'
import { useEffect } from 'react'
import { Loader2Icon, Tablet, LaptopIcon, SmartphoneIcon, SaveIcon, FullscreenIcon, ArrowBigDownDashIcon, EyeIcon } from 'lucide-react'
import { dummyConversations } from '../assets/assets.ts'
import { dummyProjects } from '../assets/assets.ts'
import Sidebar from '../components/Sidebar'
import { dummyVersion } from '../assets/assets.ts'
import ProjectPreview, { type ProjectPreviewRef } from '../components/ProjectPreview'



const Projects = () => {

  const { projectId } = useParams()
  const navigate = useNavigate()

  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  const [isGenerating, setIsGenerating] = useState(true)
  const [device, setDevice] = useState<'phone' | 'tablet' | 'desktop'>('desktop')

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(true)
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


  const previewRef = useRef<ProjectPreviewRef>(null)

  const fetchProject = async () => {
    setLoading(true)
    const project = dummyProjects.find(project => project.id === projectId)
    setTimeout(() => {
      if (project) {
        setProject({ ...project, conversation: dummyConversations, versions: dummyVersion });
        setLoading(false)
        setIsGenerating(project.current_code ? false : true)
      } else {
        setLoading(false)
      }
    }, 1000)
  }

  const saveProject = async () => {

  };
//download code (index.html)
const downloadCode = () => {
  const code = previewRef.current?.getCode() || project?.current_code;

  if (!code) {
    if (isGenerating) {
      return;
    }
    return;
  }

  const element = document.createElement("a");
  const file = new Blob([code], { type: "text/html" });

  element.href = URL.createObjectURL(file);
  element.download = "index.html";

  document.body.appendChild(element);
  element.click();

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
    <div className='flex flex-col h-screen w-full text-white bg-black overflow-hidden'>

      {/* Top Bar */}
      <header className='flex items-center justify-between px-6 h-16 border-b border-gray-800 bg-[#0F1117] shrink-0'>
        {/* Left Section: Logo & Project Info */}
        <div className='flex items-center gap-4 flex-1 min-w-0'>
          <div className='bg-white rounded-full p-1 leading-none shrink-0 cursor-pointer active:scale-95 hover:brightness-110 transition-all duration-300 ease-in-out' onClick={() => navigate('/')}>
            <img src="/favicon.svg" alt="logo" className='size-5' />
          </div>
          <div className='flex flex-col min-w-0'>
            <p className='text-sm font-bold truncate leading-tight tracking-wide text-white'>
              {project.name}
            </p>
            <p className='text-[10px] text-gray-600 truncate font-light'>
              Previewing last saved version
            </p>
          </div>
        </div>

        {/* Middle Section: Device Toggles */}
        <div className='flex items-center gap-1 bg-[#1A1D26] p-1 rounded-xl border border-gray-800/50'>
          <button
            onClick={() => setDevice('phone')}
            title="Mobile Preview"
            className={`p-1.5 rounded-lg transition-all duration-300 ease-in-out cursor-pointer active:scale-95 ${device === 'phone'
              ? "bg-white/10 text-white scale-105 border border-indigo-500/50 shadow-[0_0_8px_rgba(99,102,241,0.3)]"
              : "text-gray-500 border border-transparent hover:text-white hover:-translate-y-0.5 hover:shadow-md"
              }`}
          >
            <SmartphoneIcon size={16} />
          </button>
          <button
            onClick={() => setDevice('tablet')}
            title="Tablet Preview"
            className={`p-1.5 rounded-lg transition-all duration-300 ease-in-out cursor-pointer active:scale-95 ${device === 'tablet'
              ? "bg-white/10 text-white scale-105 border border-indigo-500/50 shadow-[0_0_8px_rgba(99,102,241,0.3)]"
              : "text-gray-400 border border-transparent hover:text-white hover:-translate-y-0.5 hover:shadow-md"
              }`}
          >
            <Tablet size={16} />
          </button>
          <button
            onClick={() => setDevice('desktop')}
            title="Desktop Preview"
            className={`p-1.5 rounded-lg transition-all duration-300 ease-in-out cursor-pointer active:scale-95 ${device === 'desktop'
              ? "bg-white/10 text-white scale-105 border border-indigo-500/50 shadow-[0_0_8px_rgba(99,102,241,0.3)]"
              : "text-gray-400 border border-transparent hover:text-white hover:-translate-y-0.5 hover:shadow-md"
              }`}
          >
            <LaptopIcon size={16} />
          </button>
        </div>

        {/* Right Section: Action Buttons */}
        <div className='flex items-center gap-3 flex-1 justify-end'>
          <button
            onClick={saveProject}
            disabled={isSaving}
            className='flex items-center gap-2 px-4 py-1.5 text-xs font-semibold bg-[#1A1D26] hover:bg-[#252A35] hover:brightness-110 border border-gray-800 rounded-xl transition-all duration-300 ease-in-out active:scale-95 text-gray-400 opacity-80 hover:opacity-100 hover:-translate-y-0.5 hover:shadow-md cursor-pointer'
          >
            <SaveIcon size={14} />
            <span>Save</span>
            <span className={`ml-1 size-2 rounded-full ${isSaved ? 'bg-green-400 shadow-[0_0_4px_rgba(74,222,128,0.5)]' : 'bg-yellow-400 shadow-[0_0_4px_rgba(250,204,21,0.5)]'}`} title={isSaved ? 'Saved' : 'Unsaved changes'} />
          </button>

          <Link
            target='_blank'
            to={`/preview/${projectId}`}
            className='flex items-center gap-2 px-4 py-1.5 text-xs font-semibold bg-[#1A1D26] hover:bg-[#252A35] hover:brightness-110 border border-gray-800 rounded-xl transition-all duration-300 ease-in-out active:scale-95 text-gray-300 hover:-translate-y-0.5 hover:shadow-md cursor-pointer'
          >
            <FullscreenIcon size={14} />
            <span>Preview</span>
          </Link>

          <button
            onClick={downloadCode}
            className='flex items-center gap-2 px-5 py-1.5 text-xs font-bold bg-[#2563EB] hover:bg-blue-500 hover:brightness-110 rounded-xl transition-all duration-300 ease-in-out active:scale-95 text-white shadow-lg shadow-blue-500/25 hover:-translate-y-0.5 hover:shadow-blue-500/40 cursor-pointer'
          >
            <ArrowBigDownDashIcon size={14} />
            <span>Download</span>
          </button>

          <button
            onClick={togglePublish}
            className='flex items-center gap-2 px-5 py-1.5 text-xs font-bold bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 hover:brightness-110 rounded-xl transition-all duration-300 ease-in-out active:scale-95 text-white shadow-lg shadow-indigo-500/30 hover:-translate-y-0.5 hover:shadow-indigo-500/50 cursor-pointer'
          >
            <EyeIcon size={14} />
            <span>Publish</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className='flex flex-1 min-h-0 overflow-hidden flex-col lg:flex-row gap-6 p-6 pt-0 mt-6 mb-20 items-stretch'>
        {/* Chat Section Wrapper */}
        <div className='h-full rounded-2xl overflow-hidden border border-gray-800/50 bg-[#0F1117] shadow-xl relative'>
          <Sidebar
            isMenuOpen={isMenuOpen}
            project={project}
            setProject={setProject}
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
            width={sidebarWidth}
          />
        </div>

        {/* Resize Handle */}
        <div
          onMouseDown={handleMouseDown}
          className='w-1 hover:w-1.5 bg-gray-800 hover:bg-indigo-500/50 cursor-col-resize transition-all duration-300 ease-in-out shrink-0 active:bg-indigo-500'
        />

        {/* Preview Area */}
        <ProjectPreview ref={previewRef} project={project} isGenerating={isGenerating} device={device} showEditorPanel={true} />
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