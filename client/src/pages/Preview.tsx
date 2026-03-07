import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import type { Project } from '../types'
import ProjectPreview from '../components/ProjectPreview'
import { Loader2Icon } from 'lucide-react'
import api from '@/configs/axios'
import { toast } from 'sonner'

const Preview = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProject = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/api/user/project/${projectId}`)
      if (data.project) {
        setProject(data.project)
      } else {
        toast.error("Project not found")
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch project")
      console.error(error)
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <Loader2Icon className="animate-spin text-indigo-500" size={48} />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <p className="text-xl">Project not found</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-gray-900 overflow-hidden">
      <ProjectPreview
        project={project}
        isGenerating={false}
        showEditorPanel={false}
        device="desktop"
      />
    </div>
  );
}

export default Preview