import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { dummyProjects } from "../assets/assets";
import type { Project } from "../types";
import ProjectPreview from "../components/ProjectPreview";
import { Loader2Icon } from "lucide-react";

const View = () => {
  const { projectId } = useParams();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCode = async () => {
    const projectCode = dummyProjects.find(
      (project: Project) => project.id === projectId
    )?.current_code;

    setTimeout(() => {
      if (projectCode) {
        setCode(projectCode);
        setLoading(false);
      }
    }, 2000);
  };

  useEffect(() => {
    fetchCode();
  }, [projectId]);

if(loading){
  return(
    <div className="flex items-center justify-center h-screen">
      <Loader2Icon className="animate-spin" />
    </div>
  )
}


  return (
    <div className="h-screen w-screen bg-gray-900 flex items-center justify-center">
   {code && <ProjectPreview project={{current_code:code} as Project} isGenerating={false} showEditorPanel={false} />}
    </div>
  );
};

export default View;