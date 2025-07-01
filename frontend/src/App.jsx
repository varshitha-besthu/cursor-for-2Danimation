import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [prompt, setPrompt] = useState("");

  return (
    <div style={{fontSize: 24 }}>
      <div>Enter the prompt:</div>
      <input type='text' placeholder='prompt' onChange={(e) => setPrompt(e.target.value)}/>
      {/* {prompt} */}
    </div>
  )
}

export default App
