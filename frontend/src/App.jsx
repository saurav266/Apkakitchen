import Navbar from './User-Components/Navbar.jsx'
import Home from './user-page/Home.jsx'
import Menu from './user-page/Menu.jsx'
import Cart from './user-page/Cart.jsx'
import Login from './user-page/Login.jsx'
import Register from './user-page/Register.jsx'
import { Routes, Route } from 'react-router-dom'
import UserProfile from './user-page/UserProfilePage.jsx'
import EditProfilePage from './user-page/EditProfilePage.jsx'

function App() {
  return (
    <>
      <Navbar />
      <main className="pt-20 relative z-10 pointer-events-auto"></main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/profile/edit" element={<EditProfilePage />} />
      </Routes>
    </>
  )
}

export default App