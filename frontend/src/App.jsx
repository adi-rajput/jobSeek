import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import UserSignupForm from './component/employer_register'
import './App.css'
import WelcomePage from './component/Home'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <WelcomePage />
    </>
  )
}

export default App
