import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Preview from './pages/Preview'
import MyProjects from './pages/MyProjects'
import Projects from './pages/Projects'
import Pricing from './pages/Pricing'
import View from './pages/View'
import Community from './pages/Community'
import Layout from './components/Layout'
import { Toaster } from 'sonner'
import AuthPage from './pages/auth/AuthPage'
import Settings from './pages/Settings'
import { useParams } from 'react-router-dom'

const ProjectRedirect = () => {
  const { projectId } = useParams();
  return <Navigate to={`/projects/${projectId}`} replace />;
};

const App = () => {
  return (
    <div>
      <Toaster />
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<Home />} />
          <Route path='/pricing' element={<Pricing />} />
          <Route path='/projects/:projectId' element={<Projects />} />
          <Route path='/project/:projectId' element={<ProjectRedirect />} />
          <Route path='/projects' element={<MyProjects />} />
          <Route path='/community' element={<Community />} />
        </Route>
        <Route path='/preview/:projectId' element={<Preview />} />
        <Route path='/preview/:projectId/:versionId' element={<Preview />} />
        <Route path='/view/:projectId' element={<View />} />
        <Route path='/auth/:pathname' element={<AuthPage />} />
        <Route path='/account/settings' element={<Settings />} />
      </Routes>
    </div>
  )
}

export default App
