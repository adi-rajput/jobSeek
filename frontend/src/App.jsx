import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './component/Home'
import Navbar from './component/Navbar'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'  
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ToastContainer />
      <Navbar ></Navbar>
      <Home/>
    </>
  )
}

export default App
