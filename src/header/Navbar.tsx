import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '@/components/AuthContext'
import { Button } from '@/components/ui/button'
import {
  Menu,
  X,
  LogOut,
  Home,
  MapPin,
  PlusCircle,
  BookOpen,
  User
} from 'lucide-react'

import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Navbar = () => {
  const authContext = useContext(AuthContext)
  const { isAuthenticated, logout } = authContext || {}
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    if (logout) {
      logout()
    }

    toast.success('¡Hasta luego!', {
      position: 'top-center',
      autoClose: false,
      hideProgressBar: true,
      closeButton: true
    })

    navigate('/')
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <>
      {/* ToastContainer se debe agregar para mostrar las notificaciones */}
      <ToastContainer />

      <header className='bg-white shadow-sm dark:bg-dark-primary-foreground'>
        <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
          <Link to='/' className='flex items-center'>
            <h1
              className='text-4xl font-bold text-red-500 dark:text-white'
              style={{ fontFamily: 'Iconic, sans-serif' }}
            >
              Sabor&Cocina
            </h1>
          </Link>

          {/* Botón para menú en móvil */}
          <Button
            variant='ghost'
            size='icon'
            className='md:hidden text-gray-600 dark:text-white'
            onClick={toggleMenu}
          >
            {isMenuOpen ?
              <X className='h-6 w-6' />
            : <Menu className='h-6 w-6' />}
          </Button>

          {/* Menú en pantallas grandes */}
          <nav className='hidden md:flex items-center space-x-8'>
            <Link to='/'>
              <Button
                variant='ghost'
                size='sm'
                className='text-gray-600 dark:text-white'
              >
                <Home className='h-5 w-5 mr-2' />
                Inicio
              </Button>
            </Link>
            <Link to='/restaurants'>
              <Button
                variant='ghost'
                size='sm'
                className='text-gray-600 dark:text-white'
              >
                <MapPin className='h-5 w-5 mr-2' />
                Restaurantes
              </Button>
            </Link>

            {isAuthenticated ?
              <>
                <Link to='/create-restaurant'>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='text-gray-600 dark:text-white'
                  >
                    <PlusCircle className='h-5 w-5 mr-2' />
                    Crear Restaurante
                  </Button>
                </Link>
                <Link to='/bookings'>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='text-gray-600 dark:text-white'
                  >
                    <BookOpen className='h-5 w-5 mr-2' />
                    Mis Reservas
                  </Button>
                </Link>
                <Button
                  variant='ghost'
                  size='sm'
                  className='text-gray-600 dark:text-white'
                  onClick={handleLogout}
                >
                  <LogOut className='h-5 w-5 mr-2' />
                  Cerrar sesión
                </Button>
              </>
            : <>
                <Link to='/login'>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='text-gray-600 dark:text-white'
                  >
                    <User className='h-5 w-5 mr-2' />
                    Iniciar sesión
                  </Button>
                </Link>
                <Link to='/register'>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='text-gray-600 dark:text-white'
                  >
                    <User className='h-5 w-5 mr-2' />
                    Registrarse
                  </Button>
                </Link>
              </>
            }
          </nav>
        </div>

        {/* Menú para móviles */}
        {isMenuOpen && (
          <nav className='md:hidden bg-white border-t border-gray-200 dark:bg-dark-primary-foreground'>
            <ul className='px-4 py-2 space-y-2'>
              <li>
                <Link to='/' onClick={toggleMenu}>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='text-gray-600 dark:text-white'
                  >
                    <Home className='h-5 w-5 mr-2' />
                    Inicio
                  </Button>
                </Link>
              </li>
              <li>
                <Link to='/restaurants' onClick={toggleMenu}>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='text-gray-600 dark:text-white'
                  >
                    <MapPin className='h-5 w-5 mr-2' />
                    Restaurantes
                  </Button>
                </Link>
              </li>

              {isAuthenticated ?
                <>
                  <li>
                    <Link to='/create-restaurant' onClick={toggleMenu}>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='text-gray-600 dark:text-white'
                      >
                        <PlusCircle className='h-5 w-5 mr-2' />
                        Crear Restaurante
                      </Button>
                    </Link>
                  </li>
                  <li>
                    <Link to='/bookings' onClick={toggleMenu}>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='text-gray-600 dark:text-white'
                      >
                        <BookOpen className='h-5 w-5 mr-2' />
                        Mis Reservas
                      </Button>
                    </Link>
                  </li>
                  <li>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='text-gray-600 dark:text-white'
                      onClick={handleLogout}
                    >
                      <LogOut className='h-5 w-5 mr-2' />
                      Cerrar sesión
                    </Button>
                  </li>
                </>
              : <>
                  <li>
                    <Link to='/login' onClick={toggleMenu}>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='text-gray-600 dark:text-white'
                      >
                        <User className='h-5 w-5 mr-2' />
                        Iniciar sesión
                      </Button>
                    </Link>
                  </li>
                  <li>
                    <Link to='/register' onClick={toggleMenu}>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='text-gray-600 dark:text-white'
                      >
                        <User className='h-5 w-5 mr-2' />
                        Registrarse
                      </Button>
                    </Link>
                  </li>
                </>
              }
            </ul>
          </nav>
        )}
      </header>
    </>
  )
}

export default Navbar
