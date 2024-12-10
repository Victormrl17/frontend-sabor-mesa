import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
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

const RegisterPage = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false) // Estado de carga
  const [error, setError] = useState('') // Estado para errores
  const navigate = useNavigate()

  // Usar la variable de entorno VITE_API_URL (de Vercel) para la base URL
  const API_BASE_URL = import.meta.env.VITE_API_URL

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true) // Activamos el estado de carga
    setError('') // Reiniciamos cualquier error anterior

    try {
      // Usamos la variable de entorno API_BASE_URL para hacer la petición al back-end
      const backendUrl = process.env.VITE_API_URL|| 'http://localhost:3000'; // Usar la variable de entorno o la URL predeterminada
      await axios.post(`${VITE_API_URL}/api/users/register`, {
        name,
        email,
        password
      })
      alert('Registro exitoso, ahora puedes iniciar sesión.')
      navigate('/login')
    } catch (error) {
      setError('Error al registrarse. Intenta nuevamente.')
    } finally {
      setLoading(false) // Desactivamos el loader después de la respuesta
    }
  }

  return (
    <main className='flex justify-center items-center h-screen bg-gradient-to-r from-orange-400 to-red-500 relative'>
      {/* Modal de carga */}
      {loading && (
        <div className='fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50'>
          <div className='flex flex-col items-center bg-white p-6 rounded-lg shadow-lg'>
            <div className='w-8 h-8 border-4 border-t-primary border-gray-300 rounded-full animate-spin mb-4' />
            <p className='text-lg text-gray-700'>Registrando...</p>
          </div>
        </div>
      )}

      <Card className='w-full max-w-md bg-white p-8 rounded-xl shadow-xl z-10'>
        <CardHeader>
          <CardTitle className='text-4xl font-extrabold text-center text-primary dark:text-primary-lighter'>
            {loading ? 'Registrando...' : 'Registrarse'}
          </CardTitle>
          <CardDescription className='text-center text-gray-500'>
            {loading ? '' : 'Crea una cuenta para comenzar'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!loading && (
            <form onSubmit={handleRegister}>
              <div className='space-y-6'>
                <div className='space-y-2'>
                  <label
                    htmlFor='name'
                    className='text-sm font-medium text-gray-700 dark:text-gray-200'
                  >
                    Nombre
                  </label>
                  <Input
                    id='name'
                    type='text'
                    placeholder='Tu nombre'
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className='w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-600 dark:text-white'
                  />
                </div>
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
                    placeholder='Contraseña'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className='w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-600 dark:text-white'
                  />
                </div>
                <Button
                  type='submit'
                  className='w-full font-bold bg-red-500 hover:bg-green-600 text-white py-3 rounded-lg'
                >
                  Registrar
                </Button>
              </div>
            </form>
          )}
          {error && <p className='text-red-500 text-center'>{error}</p>}
        </CardContent>
        {!loading && (
          <CardFooter className='flex flex-col space-y-4 text-center'>
            <div className='text-sm text-gray-600 dark:text-gray-300'>
              <p>¿Ya tienes una cuenta?</p>
              <Link
                to='/login'
                className='text-primary-dark font-bold hover:underline dark:text-primary-light'
              >
                Inicia sesión
              </Link>
            </div>
          </CardFooter>
        )}
      </Card>
    </main>
  )
}

export default RegisterPage
