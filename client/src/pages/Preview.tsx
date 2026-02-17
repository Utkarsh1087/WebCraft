import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { dummyProjects } from '../assets/assets'
import type { Project } from '../types'
import ProjectPreview from '../components/ProjectPreview'
import { Loader2Icon } from 'lucide-react'

const Preview = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProject = async () => {
    setLoading(true);
    // In a real app, we'd fetch from API. Here we use dummyProjects.
    const foundProject = dummyProjects.find(p => p.id === projectId);

    setTimeout(() => {
      if (foundProject) {
        setProject(foundProject as Project);
      }
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchProject();
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