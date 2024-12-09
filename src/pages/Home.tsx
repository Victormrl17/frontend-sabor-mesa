import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function AgenciesLanding() {
  // Definir un array de imágenes
  const images = [
    '/assets/Imagen2.png',
    '/assets/Imagen1.png',
    '/assets/Imagen3.png',
    '/assets/Imagen4.png'
  ]

  interface Restaurant {
    id: number
    name: string
    images: string[]
    cuisine: string
    location: string
    comments: { rating: number }[] // Añadir comentarios con valoraciones
  }

  const [restaurants, setRestaurants] = useState<Restaurant[]>([])

  // Obtener los restaurantes al cargar el componente
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3000/api/restaurants'
        )
        const restaurantsData = response.data as Restaurant[]

        // Para cada restaurante, obtener los comentarios
        for (const restaurant of restaurantsData) {
          const commentsResponse = await axios.get(
            `http://localhost:3000/api/comments/restaurant/${restaurant.id}`
          )
          restaurant.comments = commentsResponse.data as { rating: number }[]
        }

        setRestaurants(restaurantsData)
      } catch (error) {
        console.error('Error al cargar los restaurantes', error)
      }
    }
    fetchRestaurants()
  }, [])

  // Usamos el estado para controlar la imagen actual
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Cambiar la imagen automáticamente cada 3 segundos
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length)
    }, 3000) // Cambiar cada 3 segundos

    // Limpiar el intervalo cuando el componente se desmonta
    return () => clearInterval(intervalId)
  }, [])

  // Función para cambiar la imagen al hacer clic en los círculos
  const handleDotClick = (index: number) => {
    setCurrentImageIndex(index)
  }

  // Función para calcular la puntuación promedio y el número de comentarios
  const getReviewData = (comments: { rating: number }[]) => {
    if (comments.length === 0) {
      return { avgRating: '--', reviewCount: 0 }
    }

    const totalRating = comments.reduce(
      (sum, comment) => sum + comment.rating,
      0
    )
    const avgRating = (totalRating / comments.length).toFixed(1) // Redondear a 1 decimal
    return { avgRating, reviewCount: comments.length }
  }

  // Función para obtener una lista aleatoria de restaurantes
  const getRandomRestaurants = (restaurants: Restaurant[], count: number) => {
    const shuffled = [...restaurants].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }

  return (
    <div className='container mx-auto px-4 py-4 h-auto flex flex-col '>
      {/* Contenedor de la imagen y contenido */}
      <div className='relative h-auto sm:h-[60vh] md:h-[80vh] lg:h-[60vh]'>
        <img
          alt={`Background ${currentImageIndex + 1}`}
          className='w-full h-full object-cover'
          src={images[currentImageIndex]}
        />
        <div className='absolute inset-0 bg-black bg-opacity-10 flex flex-col justify-end items-center text-center px-8'>
          <Link to='/restaurants' />
        </div>
      </div>

      {/* Indicadores de navegación (puntos) */}
      <div className='flex justify-center items-center space-x-2 py-4'>
        {images.map((image, index) => (
          <span
            key={image}
            className={`w-3 h-3 rounded-full cursor-pointer transition-all ${currentImageIndex === index ? 'bg-gray-800' : 'bg-gray-400'}`}
            onClick={() => handleDotClick(index)}
            onKeyUp={e => e.key === 'Enter' && handleDotClick(index)}
            role='button'
            tabIndex={0}
          />
        ))}
      </div>

      {/* Título de la sección */}
      <div className='text-center py-4'>
        <p className='text-gray-700 text-lg'>¿Qué se te antoja hoy?</p>
      </div>

      {/* Botones interactivos */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 pb-4'>
        <a href='#loMasNuevo'>
          <Button
            type='button'
            className='w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-all'
          >
            Nuevo
          </Button>
        </a>
        <a href='#bares'>
          <Button
            type='button'
            className='w-full bg-lime-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-lime-700 transition-all'
          >
            Bares
          </Button>
        </a>
        <a href='#descuentos'>
          <Button
            type='button'
            className='w-full bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-all'
          >
            Dsctos 24/7
          </Button>
        </a>
        <a href='#delivery'>
          <Button
            type='button'
            className='w-full bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition-all'
          >
            Delivery
          </Button>
        </a>
      </div>

      {/* Lo más nuevo */}
      <div id='loMasNuevo' className=' p-6'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-2xl font-bold'>Lo más nuevo</h2>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {/* Mostrar los 4 primeros restaurantes aleatorios */}
          {getRandomRestaurants(restaurants, 4).map(restaurant => {
            const { avgRating, reviewCount } = getReviewData(
              restaurant.comments
            )
            return (
              <div
                key={restaurant.id}
                className='bg-white rounded-lg overflow-hidden shadow-lg'
              >
                <img
                  alt={`Restaurant ${restaurant.name}`}
                  className='w-full h-40 object-cover'
                  src={restaurant.images[0] || '/assets/Imagen5.png'} // Imagen por defecto si no hay imagen
                />
                <div className='p-4'>
                  <h2 className='text-xl font-bold mt-2'>{restaurant.name}</h2>
                  <p className='text-sm text-gray-600'>
                    {avgRating} <i className='fas fa-star text-yellow-500' /> /{' '}
                    {reviewCount} Reviews
                  </p>
                  <p className='text-sm text-gray-600'>
                    {restaurant.cuisine} | {restaurant.location}
                  </p>
                  <a
                    className='text-blue-500 mt-2 block'
                    href={`/restaurants/${restaurant.id}`}
                  >
                    Reservas →
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Bares */}
      <div id='bares' className=' p-6'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-2xl font-bold'>Bares</h2>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {/* Mostrar los 4 primeros restaurantes aleatorios */}
          {getRandomRestaurants(restaurants, 4).map(restaurant => {
            const { avgRating, reviewCount } = getReviewData(
              restaurant.comments
            )
            return (
              <div
                key={restaurant.id}
                className='bg-white rounded-lg overflow-hidden shadow-lg'
              >
                <img
                  alt={restaurant.name}
                  className='w-full h-40 object-cover'
                  src={restaurant.images[0] || '/assets/Imagen5.png'} // Imagen por defecto si no hay imagen
                />
                <div className='p-4'>
                  <h2 className='text-xl font-bold mt-2'>{restaurant.name}</h2>
                  <p className='text-sm text-gray-600'>
                    {avgRating} <i className='fas fa-star text-yellow-500' /> /{' '}
                    {reviewCount} Reviews
                  </p>
                  <p className='text-sm text-gray-600'>
                    {restaurant.cuisine} | {restaurant.location}
                  </p>
                  <a
                    className='text-blue-500 mt-2 block'
                    href={`/restaurants/${restaurant.id}`}
                  >
                    Reservas →
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Sección de Descuentos 24/7 */}
      <div id='descuentos' className='bg-gray-100'>
        {/* Header Section */}
        <div className='bg-red-500 text-white p-6 text-center'>
          <h1 className='text-4xl font-bold'>Dsctos 24/7</h1>
          <p className='text-xl mt-2'>
            Llegaron los descuentos exclusivos en tus locales favoritos
          </p>
          <Link to='/restaurants'>
            <button
              type='button'
              className='bg-green-500 text-white font-bold py-2 px-4 rounded-full mt-4'
            >
              Descúbrelos hoy
            </button>
          </Link>
        </div>

        {/* Featured Discounts Section */}
        <div className='bg-red-500 p-6'>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {/* Mostrar los 4 primeros restaurantes aleatorios */}
            {getRandomRestaurants(restaurants, 4).map(restaurant => {
              const { avgRating, reviewCount } = getReviewData(
                restaurant.comments
              )
              return (
                <div
                  key={restaurant.id}
                  className='bg-white rounded-lg overflow-hidden shadow-lg'
                >
                  <img
                    alt={restaurant.name}
                    className='w-full h-40 object-cover'
                    src={restaurant.images[0] || '/assets/Imagen5.png'} // Imagen por defecto si no hay imagen
                  />
                  <div className='p-4'>
                    <span className='bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full'>
                      1000 Puntos
                    </span>
                    <h2 className='text-xl font-bold mt-2'>
                      {restaurant.name}
                    </h2>
                    <p className='text-sm text-gray-600'>
                      {avgRating} <i className='fas fa-star text-yellow-500' />{' '}
                      / {reviewCount} Reviews
                    </p>
                    <p className='text-sm text-gray-600'>
                      {restaurant.cuisine} | {restaurant.location}
                    </p>
                    <p className='text-red-500 font-bold mt-2'>
                      20% off <span className='text-gray-600'>A la carta</span>
                    </p>

                    <a
                      className='text-blue-500 mt-2 block'
                      href={`/restaurants/${restaurant.id}`}
                    >
                      Reservas →
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Sección de Delivery */}
      <div id='delivery' className='p-6'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-2xl font-bold'>Delivery</h2>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {/* Mostrar los 4 primeros restaurantes aleatorios */}
          {getRandomRestaurants(restaurants, 4).map(restaurant => {
            const { avgRating, reviewCount } = getReviewData(
              restaurant.comments
            )
            return (
              <div
                key={restaurant.id}
                className='bg-white rounded-lg overflow-hidden shadow-lg'
              >
                <img
                  alt={restaurant.name}
                  className='w-full h-40 object-cover'
                  src={restaurant.images[0] || '/assets/Imagen5.png'} // Imagen por defecto si no hay imagen
                />
                <div className='p-4'>
                  <h2 className='text-xl font-bold mt-2'>{restaurant.name}</h2>
                  <p className='text-sm text-gray-600'>
                    {avgRating} <i className='fas fa-star text-yellow-500' /> /{' '}
                    {reviewCount} Reviews
                  </p>
                  <p className='text-sm text-gray-600'>
                    {restaurant.cuisine} | {restaurant.location}
                  </p>
                  <a
                    className='text-blue-500 mt-2 block'
                    href={`/restaurants/${restaurant.id}`}
                  >
                    Reservas →
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
