import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import Grid from './components/Grid'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Grid size={40} cellSize={30}/>
    </div>
  )
}

export default App
