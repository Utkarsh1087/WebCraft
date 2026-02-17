import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Preview from './pages/Preview'
import MyProjects from './pages/MyProjects'
import Projects from './pages/Projects'
import Pricing from './pages/Pricing'
import View from './pages/View'
import Community from './pages/Community'
import Layout from './components/Layout'

const App = () => {
  return (
    <div>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<Home />} />
          <Route path='/pricing' element={<Pricing />} />
          <Route path='/projects/:projectId' element={<Projects />} />
          <Route path='/projects' element={<MyProjects />} />
          <Route path='/community' element={<Community />} />
        </Route>
        <Route path='/preview/:projectId' element={<Preview />} />
        <Route path='/preview/:projectId/:versionId' element={<Preview />} />
        <Route path='/view/:projectId' element={<View />} />
      </Routes>
    </div>
  )
}

export default App
