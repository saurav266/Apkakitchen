import Navbar from './User-Components/Navbar.jsx'
import Home from './user-page/Home.jsx'
import Menu from './user-page/Menu.jsx'
import Cart from './user-page/Cart.jsx'
import Login from './user-page/Login.jsx'
import Register from './user-page/Register.jsx'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  )
}

export default App