import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Signin from './components/signin';
import DashBoard from './components/dashboard' 
import Signup from './components/signup';
import { RecoilRoot } from 'recoil';
import LandingPage from './components/LandingPage';
function App() {
  const [prompt, setPrompt] = useState("");

  return (
    
      <Router>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/signin' element={<Signin />} />
          <Route path='/dashboard' element={<DashBoard />} />
        </Routes>
      </Router>
    
    
      
  )
}

export default App
