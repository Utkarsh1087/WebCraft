import { useNavigate, useParams, Link } from 'react-router-dom'
import { useState, useRef, useCallback, useEffect } from 'react'
import type { Project } from '../types/index'
import { Loader2Icon, Tablet, LaptopIcon, SmartphoneIcon, SaveIcon, FullscreenIcon, ArrowBigDownDashIcon, PanelLeft, PanelLeftClose, ChevronLeft } from 'lucide-react'
import api from '@/configs/axios'
import Sidebar from '../components/Sidebar'
import ProjectPreview, { type ProjectPreviewRef } from '../components/ProjectPreview'
import { authClient } from '@/lib/auth-client'
import { UserButton } from '@daveyplate/better-auth-ui'
import { toast } from 'sonner'
import { assets } from '../assets/assets'

const Projects = () => {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { data: session, isPending } = authClient.useSession()

  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [credits, setCredits] = useState<number>(0)

  const [isGenerating, setIsGenerating] = useState(true)
  const [device, setDevice] = useState<'phone' | 'tablet' | 'desktop'>('desktop')

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(true)
  const [sidebarWidth, setSidebarWidth] = useState(320)
  const isResizing = useRef(false)

  const fetchCredits = async () => {
    try {
      const { data } = await api.get('/api/user/credits');
      setCredits(data.credits);
    } catch {
      // Ignore
    }
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    isResizing.current = true
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'

    const onMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return
      const newWidth = Math.min(Math.max(e.clientX, 220), 550)
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
    try {
      const { data } = await api.get(`/api/user/project/${projectId}`)
      if (data.project) {
        setProject(data.project)
        const hasFailedMessage = data.project.conversation?.some((c: any) => c.role === 'assistant' && c.content?.toLowerCase().includes('failed'));
        setIsGenerating(!data.project.current_code && !hasFailedMessage)
      } else {
        toast.error("Project not found")
      }
      setLoading(false)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message)
      setLoading(false)
    }
  }

  const saveProject = async () => {
    const code = previewRef.current?.getCode() || project?.current_code;
    if (!code || !projectId) return;

    try {
      setIsSaving(true);
      await api.put(`/api/project/save/${projectId}`, { code });
      setIsSaved(true);
      toast.success("Project saved successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const downloadCode = () => {
    const code = previewRef.current?.getCode() || project?.current_code;
    if (!code) {
      return toast.error("No code available to download yet");
    }

    const element = document.createElement("a");
    const file = new Blob([code], { type: "text/html" });
    element.href = URL.createObjectURL(file);
    element.download = `${project?.name ? project.name.slice(0, 20).replace(/[^a-zA-Z0-9]/g, '_') : 'website'}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };



  useEffect(() => {
    if (session?.user) {
      fetchProject();
      fetchCredits();
    } else if (!isPending && !session?.user) {
      navigate("/")
      toast("Please login to view your projects")
    }
  }, [session?.user])

  useEffect(() => {
    if (project && !project.current_code) {
      const intervalId = setInterval(fetchProject, 8000);
      return () => clearInterval(intervalId);
    }
  }, [project]);

  if (loading) {
    return (
      <div className='bg-[#0B0F19] h-screen flex flex-col items-center justify-center gap-3 text-white'>
        <Loader2Icon className='size-8 animate-spin text-indigo-400' />
        <p className='text-sm text-gray-400'>Loading your workspace...</p>
      </div>
    );
  }

  return project ? (
    <div className='flex flex-col h-screen w-screen text-white bg-[#0B0F19] overflow-hidden'>

      {/* Modern Studio Top Bar */}
      <header className='flex items-center justify-between px-4 sm:px-6 h-16 border-b border-gray-800/80 bg-[#0F131F] shrink-0 z-30'>
        {/* Left Section: Back, Logo & Project Title */}
        <div className='flex items-center gap-3 min-w-0 flex-1 sm:flex-initial'>
          <button
            onClick={() => navigate('/projects')}
            className='p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition'
            title="Back to My Projects"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Sidebar Toggle (Mobile Only) */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className='lg:hidden p-1.5 bg-[#1A1D26] hover:bg-[#252A35] text-gray-400 hover:text-white rounded-lg border border-gray-800'
            title={isMenuOpen ? "Show Sidebar" : "Hide Sidebar"}
          >
            {isMenuOpen ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
          </button>

          <Link to="/" className='flex items-center hover:opacity-90 transition shrink-0' title="Home">
            <img src={assets.webcraft} alt="WebCraft" className="h-5 md:h-5" />
          </Link>

          <div className='h-4 w-px bg-gray-800 hidden sm:block' />

          <div className='flex flex-col min-w-0 max-w-[180px] sm:max-w-xs'>
            <p className='text-xs sm:text-sm font-semibold truncate leading-tight text-gray-100'>
              {project.name}
            </p>
            <span className='text-[10px] text-gray-500 truncate'>
              {project.isPublished ? '● Published' : '○ Private Draft'}
            </span>
          </div>
        </div>

        {/* Middle Section: Device Toggles */}
        <div className='hidden md:flex items-center gap-1 bg-[#161B26] p-1 rounded-xl border border-gray-800'>
          <button
            onClick={() => setDevice('phone')}
            title="Mobile Preview"
            className={`p-1.5 rounded-lg transition-all ${device === 'phone'
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "text-gray-400 hover:text-white"
              }`}
          >
            <SmartphoneIcon size={16} />
          </button>
          <button
            onClick={() => setDevice('tablet')}
            title="Tablet Preview"
            className={`p-1.5 rounded-lg transition-all ${device === 'tablet'
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "text-gray-400 hover:text-white"
              }`}
          >
            <Tablet size={16} />
          </button>
          <button
            onClick={() => setDevice('desktop')}
            title="Desktop Preview"
            className={`p-1.5 rounded-lg transition-all ${device === 'desktop'
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "text-gray-400 hover:text-white"
              }`}
          >
            <LaptopIcon size={16} />
          </button>
        </div>

        {/* Right Section: Actions & User Info */}
        <div className='flex items-center gap-2 sm:gap-3 shrink-0'>
          {/* Credits Badge */}
          <Link
            to="/pricing"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 hover:border-[#A6FF5D]/50 transition"
          >
            <span>Credits:</span>
            <span className="font-bold text-[#A6FF5D]">{credits}</span>
          </Link>

          {/* Save Button */}
          <button
            onClick={saveProject}
            disabled={isSaving}
            className='flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#161B26] hover:bg-[#202737] border border-gray-800 rounded-xl transition text-gray-200 cursor-pointer active:scale-95'
          >
            <SaveIcon size={14} />
            <span className='hidden sm:inline'>Save</span>
            <span className={`size-2 rounded-full ${isSaved ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]' : 'bg-amber-400'}`} />
          </button>

          {/* Fullscreen Preview */}
          <Link
            target='_blank'
            to={`/preview/${projectId}`}
            className='flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#161B26] hover:bg-[#202737] border border-gray-800 rounded-xl transition text-gray-300'
          >
            <FullscreenIcon size={14} />
            <span className='hidden sm:inline'>Preview</span>
          </Link>

          {/* Download */}
          <button
            onClick={downloadCode}
            className='hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 rounded-xl transition text-white shadow-md shadow-indigo-600/20 active:scale-95 cursor-pointer'
          >
            <ArrowBigDownDashIcon size={14} />
            <span>Download</span>
          </button>



          <div className="pl-1">
            <UserButton size="sm" />
          </div>
        </div>
      </header>

      {/* Main Workspace Content Area */}
      <div className='flex flex-1 min-h-0 overflow-hidden flex-col lg:flex-row gap-3 lg:gap-4 p-3 lg:p-4 items-stretch'>
        {/* Chat Section Wrapper & Backdrop */}
        {!isMenuOpen && (
          <div
            onClick={() => setIsMenuOpen(true)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[45] lg:hidden animate-in fade-in duration-200"
          />
        )}

        <div className={`
          h-full overflow-hidden bg-[#0F131F] shadow-2xl relative
          lg:relative lg:rounded-2xl lg:block lg:border lg:border-gray-800/80
          ${!isMenuOpen 
            ? "max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:w-[88vw] max-lg:max-w-[400px] max-lg:z-50 max-lg:rounded-r-3xl max-lg:border-r max-lg:border-gray-800 animate-in slide-in-from-left duration-300 ease-out" 
            : "max-lg:hidden"
          }
        `}>
          <Sidebar
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            project={project}
            setProject={setProject}
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
            width={sidebarWidth}
          />
        </div>

        {/* Drag Resize Handle (Desktop Only) */}
        <div
          onMouseDown={handleMouseDown}
          className='hidden lg:block w-1 hover:w-1.5 bg-gray-800 hover:bg-indigo-500 cursor-col-resize transition-all shrink-0 active:bg-indigo-500'
        />

        {/* Live Preview Canvas */}
        <ProjectPreview
          ref={previewRef}
          project={project}
          isGenerating={isGenerating}
          device={device}
          showEditorPanel={true}
        />
      </div>
    </div>
  ) : (
    <div className='bg-[#0B0F19] min-h-screen flex flex-col items-center justify-center text-white gap-4'>
      <p className='text-xl font-medium text-gray-300'>Unable to load project</p>
      <button onClick={() => navigate('/projects')} className='px-6 py-2 rounded-full bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition'>
        Back to My Projects
      </button>
    </div>
  );
};

export default Projects;