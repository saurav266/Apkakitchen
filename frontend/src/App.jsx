import Navbar from './User-Components/Navbar.jsx'
import Home from './user-page/Home.jsx'
import Menu from './user-page/Menu.jsx'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
      </Routes>
    </>
  )
}

export default App