import { useState } from 'react'
import axios from 'axios'
import { uploadImageToCloudinary } from '../utils/uploadImage' // Importamos la función de carga de imágenes
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast, ToastContainer } from 'react-toastify' // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css' // Import the CSS for notifications

const CreateRestaurant = () => {
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [cuisine, setCuisine] = useState('')
  const [images, setImages] = useState<string[]>([]) // Estado para guardar las URLs de las imágenes
  const [loading, setLoading] = useState(false) // Estado para manejar la carga de imágenes

  // Lista de distritos de Lima Metropolitana
  const limaDistritos = [
    'Barranco',
    'Breña',
    'Carabayllo',
    'Chaclacayo',
    'Chorrillos',
    'Cercado de Lima',
    'Comas',
    'El Agustino',
    'Independencia',
    'Jesús María',
    'La Molina',
    'La Victoria',
    'Lince',
    'Los Olivos',
    'Miraflores',
    'Pueblo Libre',
    'Puente Piedra',
    'San Bartolo',
    'San Borja',
    'San Isidro',
    'San Juan de Lurigancho',
    'San Juan de Miraflores',
    'San Luis',
    'San Martín de Porres',
    'Santa Anita',
    'Santa María del Mar',
    'Surco',
    'Surquillo',
    'Villa El Salvador',
    'Villa María del Triunfo'
  ]

  // Lista de tipos de comida
  const cuisines = [
    'Fusión Peruana-Japonesa (Nikkei)',
    'Fusión Peruana-China (Chifa)',
    'Fusión Peruana-Italiana',
    'Comida de Influencia Asiática',
    'Comida Mexicana',
    'Comida de Medio Oriente',
    'Comida Fast-Casual de Influencias Internacionales',
    'Comida Mediterránea',
    'Comida Afroperuana',
    'Comida Vegana',
    'Comida Vegetariana',
    'Bar',
    'Comida de Autor'
  ]

  // Función para manejar el cambio de imágenes
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      setLoading(true) // Activamos el loader cuando empieza la carga de imágenes
      const imageUrls: string[] = [] // Arreglo para almacenar las URLs de las imágenes cargadas
      for (let i = 0; i < files.length; i++) {
        try {
          const url = await uploadImageToCloudinary(files[i]) // Subimos la imagen
          imageUrls.push(url) // Añadimos la URL al arreglo
        } catch (error) {
          toast.error('Error al subir las imágenes', {
            position: 'top-center', // Toast at the top-center
            autoClose: 3000, // Auto close after 3 seconds
            hideProgressBar: true, // Hide progress bar
            theme: 'light' // Optional theme
          })
        }
      }
      setImages(imageUrls) // Guardamos las URLs de las imágenes en el estado
      setLoading(false) // Desactivamos el loader cuando las imágenes han sido cargadas
    }
  }

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const restaurantData = {
      name,
      location,
      cuisine,
      images // Las URLs de las imágenes ya cargadas
    }

    try {
      const token = localStorage.getItem('token') // Obtener token de autenticación
      if (!token) {
        toast.error('No autenticado. Por favor, inicia sesión.', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: true,
          theme: 'light'
        })
        return
      }

      const response = await axios.post(
        'http://localhost:3000/api/restaurants',
        restaurantData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      toast.success('Restaurante creado con éxito', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        theme: 'light'
      })

      setName('')
      setLocation('')
      setCuisine('')
      setImages([]) // Limpiar el estado de las imágenes después de enviar
    } catch {
      toast.error('Error al crear el restaurante', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        theme: 'light'
      })
    }
  }

  return (
    <div className='container mx-auto p-4'>
      <Card className='max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md'>
        <CardHeader>
          <CardTitle className=' text-center text-2xl font-semibold text-primary'>
            Registrar Restaurante
          </CardTitle>
          <CardDescription className='text-base text-gray-500 text-center'>
            Complete la información para crear el restaurante
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className='mb-4'>
            <label htmlFor='name' className='block text-sm font-semibold'>
              Nombre
            </label>
            <Input
              type='text'
              id='name'
              value={name}
              onChange={e => setName(e.target.value)}
              className='w-full p-2 border border-gray-300 rounded mt-1 bg-white text-black'
              required
            />
          </div>

          <div className='mb-4'>
            <label htmlFor='location' className='block text-sm font-semibold'>
              Ubicación
            </label>
            <select
              id='location'
              value={location}
              onChange={e => setLocation(e.target.value)}
              className='w-full p-2 border border-gray-300 rounded mt-1 bg-white text-black'
              required
            >
              <option value='' disabled>
                Selecciona un distrito
              </option>
              {limaDistritos.map(distrito => (
                <option key={distrito} value={distrito}>
                  {distrito}
                </option>
              ))}
            </select>
          </div>

          <div className='mb-4'>
            <label htmlFor='cuisine' className='block text-sm font-semibold'>
              Cocina
            </label>
            <select
              id='cuisine'
              value={cuisine}
              onChange={e => setCuisine(e.target.value)}
              className='w-full p-2 border border-gray-300 rounded mt-1 bg-white text-black'
              required
            >
              <option value='' disabled>
                Selecciona el tipo de comida
              </option>
              {cuisines.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className='mb-4'>
            <label htmlFor='images' className='block text-sm font-semibold'>
              Imágenes
            </label>
            <input
              type='file'
              id='images'
              accept='image/*'
              multiple
              onChange={handleImageChange} // Llamar a la función para cargar imágenes
              className='w-full p-2 border border-gray-300 rounded mt-1 bg-white text-black'
              disabled={loading} // Deshabilitar el input de imágenes mientras se están subiendo
            />

            {/* Previsualización de las imágenes cargadas */}
            <div className='mt-2'>
              {images.length > 0 && (
                <ul className='flex justify-center space-y-2'>
                  {images.map(image => (
                    <li key={image}>
                      <img
                        src={image}
                        alt='Restaurant view'
                        className='w-24 h-24 object-cover'
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Loader o spinner */}
          {loading && (
            <div className='flex justify-center mb-4'>
              <div className='loader'>Cargando...</div>{' '}
              {/* Aquí puedes poner un spinner si prefieres */}
            </div>
          )}
        </CardContent>

        <CardFooter className='flex justify-center text-center'>
          <Button
            type='submit'
            className='px-6 py-2 bg-primary text-white rounded hover:bg-primary-dark'
            disabled={loading || images.length === 0} // Deshabilitar el botón mientras se cargan las imágenes o no hay imágenes cargadas
            onClick={handleSubmit}
          >
            {loading ? 'Cargando...' : 'Crear Restaurante'}
          </Button>
        </CardFooter>
      </Card>

      {/* ToastContainer where to display the notifications */}
      <ToastContainer />
    </div>
  )
}

export default CreateRestaurant
