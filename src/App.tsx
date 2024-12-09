import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './header/Navbar'
import LoginPage from './pages/LoginPage'
import RestaurantsPage from './pages/RestaurantsPage'
import RegisterPage from './pages/RegisterPage'
import BookingsPage from './pages/BookingsPage'
import Footer from './components/Footer/Footer'
import { AuthProvider } from './components/AuthContext'
import CreateRestaurant from './pages/CreateRestaurant'
import ReservationPage from './pages/ReservationPage'
import ReservaPage from './pages/ReservaPage'
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/restaurants' element={<RestaurantsPage />} />
          <Route path='*' element={<h1>Not Found</h1>} />
          <Route path='/404' element={<h1>Not Found</h1>} />
          <Route path='/bookings' element={<BookingsPage />} />
          <Route path='/create-restaurant' element={<CreateRestaurant />} />
          <Route
            path='/restaurants/:restaurantId'
            element={<ReservationPage />}
          />
          <Route path='/reservar/:restaurantId' element={<ReservaPage />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
