import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Signin from './signin';
import DashBoard from './dashboard' 
function App() {
  const [prompt, setPrompt] = useState("");

  return (
    <Router>
      <Routes>
        <Route path='/signin' element={<Signin />} />
        <Route path='/dashboard' element={<DashBoard />} />
      </Routes>
    </Router>
  )
}

export default App
