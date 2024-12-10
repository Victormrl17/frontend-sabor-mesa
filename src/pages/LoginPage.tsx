import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '@/components/AuthContext'
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify' // Import the toast function and ToastContainer
import 'react-toastify/dist/ReactToastify.css' // Import the CSS for notifications

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false) // Estado de carga
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const authContext = useContext(AuthContext)

  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider')
  }
  const { login } = authContext

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'; // Usando la variable de entorno
  
    try {
      const response = await axios.post<{ token: string }>(
        `${backendUrl}/api/users/login`, // Usando la URL del backend
        { email, password }
      );
      localStorage.setItem('token', response.data.token);
      login();
      navigate('/restaurants');
      toast.success('Bienvenido de vuelta!', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        theme: 'light'
      });
    } catch (error) {
      toast.error('Error al iniciar sesión. Verifica tus credenciales.', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        theme: 'light'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className='flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 to-purple-500 relative'>
      {/* Modal de carga */}
      {loading && (
        <div className='fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50'>
          <div className='flex flex-col items-center bg-white p-6 rounded-lg shadow-lg'>
            <div className='w-8 h-8 border-4 border-t-primary border-gray-300 rounded-full animate-spin mb-4' />
            <p className='text-lg text-gray-700'>Iniciando sesión...</p>
          </div>
        </div>
      )}

      <Card className='w-full max-w-md bg-white p-8 rounded-xl shadow-xl z-10'>
        <CardHeader>
          <CardTitle className='text-4xl font-extrabold text-center text-primary dark:text-primary-lighter'>
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </CardTitle>
          <CardDescription className='text-center text-gray-500'>
            {loading ? '' : 'Accede a tu cuenta para continuar'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!loading && (
            <form onSubmit={handleLogin}>
              <div className='space-y-6'>
                <div className='space-y-2'>
                  <label
                    htmlFor='email'
                    className='text-sm font-medium text-gray-700 dark:text-gray-200'
                  >
                    Correo electrónico
                  </label>
                  <Input
                    id='email'
                    type='email'
                    placeholder='mail@example.com'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className='w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-600 dark:text-white'
                  />
                </div>
                <div className='space-y-2'>
                  <label
                    htmlFor='password'
                    className='text-sm font-medium text-gray-700 dark:text-gray-200'
                  >
                    Contraseña
                  </label>
                  <Input
                    id='password'
                    type='password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className='w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-600 dark:text-white'
                  />
                </div>
                <Button
                  type='submit'
                  className='w-full font-bold bg-primary dark:bg-primary-light hover:bg-primary-dark hover:dark:bg-primary-lighter py-3 rounded-lg text-white transition duration-200'
                >
                  Entrar
                </Button>
              </div>
            </form>
          )}
          {error && <p className='text-red-500 text-center'>{error}</p>}
        </CardContent>
        {!loading && (
          <CardFooter className='flex flex-col space-y-4 text-center'>
            <div className='text-sm text-gray-600 dark:text-gray-300'>
              <p>¿Olvidaste tu contraseña?</p>
              <Link
                to='#'
                className='text-primary-dark font-bold hover:underline dark:text-primary-light'
              >
                Recuperar contraseña
              </Link>
            </div>
            <div className='text-sm text-gray-600 dark:text-gray-300'>
              <p>No tienes cuenta?</p>
              <Link
                to='/register'
                className='text-primary-dark font-bold hover:underline dark:text-primary-light'
              >
                Regístrate
              </Link>
            </div>
          </CardFooter>
        )}
      </Card>

      {/* Toast Container */}
      <ToastContainer />
    </main>
  )
}

export default LoginPage
