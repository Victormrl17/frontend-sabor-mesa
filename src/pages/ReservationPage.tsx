import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '@/config'

interface Restaurant {
  id: number
  name: string
  location: string
  cuisine: string
  images: string[]
}

interface Comment {
  id: number
  content: string
  rating: number
  user: { name: string }
}

const RestaurantDetailPage = () => {
  const { restaurantId } = useParams()
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [reviews, setReviews] = useState<Comment[]>([])
  const [newReview, setNewReview] = useState({ content: '', rating: 1 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      const token = localStorage.getItem('token')
      try {
        const response = await axios.get<Restaurant>(
          `${API_BASE_URL}/api/restaurants/${restaurantId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        setRestaurant(response.data)
      } catch (error) {
        console.error('Error al cargar los detalles del restaurante', error)
        setError('Hubo un problema al cargar los detalles del restaurante.')
      }
    }

    const fetchReviews = async () => {
      try {
        const response = await axios.get<Comment[]>(
          `${API_BASE_URL}/api/comments/restaurant/${restaurantId}`
        )
        setReviews(response.data)
      } catch (error) {
        console.error('Error al cargar las reseñas', error)
        setError('Hubo un problema al cargar las reseñas.')
      }
    }

    if (restaurantId) {
      setLoading(true)
      Promise.all([fetchRestaurantDetails(), fetchReviews()])
        .then(() => setLoading(false))
        .catch(() => setLoading(false))
    } else {
      setError('El ID del restaurante no es válido.')
      setLoading(false)
    }
  }, [restaurantId])

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const token = localStorage.getItem('token')
    if (!token) {
      alert('Por favor, inicia sesión para dejar una reseña.')
      return
    }

    const restaurantIdNum = Number(restaurantId)

    if (!newReview.content.trim()) {
      alert('Por favor, escribe un contenido para la reseña.')
      return
    }

    try {
      const response = await axios.post<{ id: number }>(
        `${API_BASE_URL}/api/comments`,
        {
          content: newReview.content,
          rating: newReview.rating,
          restaurantId: restaurantIdNum
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      console.log('Respuesta de la API al enviar reseña:', response.data)

      setReviews(prevReviews => [
        ...prevReviews,
        { ...newReview, user: { name: 'Usuario' }, id: response.data.id }
      ])
      setNewReview({ content: '', rating: 1 })
    } catch (error) {
      console.error('Error al agregar la reseña:', error)
      alert('Hubo un error al enviar la reseña. Intenta nuevamente.')
    }
  }

  if (error) {
    return <div className='error-message'>{error}</div>
  }

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen bg-gradient-to-r'>
        <div className='relative'>
          <div className='absolute inset-0 rounded-lg' />
          <div className='flex flex-col justify-center items-center z-10'>
            <div className='loader animate-spin border-8 border-t-4 border-blue-600 rounded-full w-24 h-24 mb-4' />
            <p className='text-2xl text-black font-semibold'>
              Cargando detalles...
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!restaurant) {
    return <div>No se encontró el restaurante.</div>
  }

  return (
    <div className='container mx-auto px-4 py-4 p-6 min-h-screen'>
      <h1 className='text-3xl font-bold mb-6 text-gray-900 dark:text-white'>
        Restaurante: {restaurant.name}
      </h1>
      <div className='bg-white p-6 rounded-lg shadow-lg'>
        <div className='mb-6'>
          <img
            src={restaurant.images[0]}
            alt={restaurant.name}
            className='w-full h-64 md:h-96 object-contain rounded-md'
          />
        </div>

        <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
          Detalles del Restaurante
        </h2>
        <p className='text-lg mt-2 text-gray-800 dark:text-gray-200'>
          <strong>Ubicación:</strong> {restaurant.location}
        </p>
        <p className='text-lg mt-2 text-gray-800 dark:text-gray-200'>
          <strong>Cocina:</strong> {restaurant.cuisine}
        </p>

        {/* Botón de reservar */}
        <Link
          to={`/reservar/${restaurant.id}`}
          className='inline-block mt-4 bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600'
        >
          Reservar
        </Link>
      </div>

      {/* Mostrar reseñas */}
      <div className='mt-8'>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
          Reseñas
        </h2>
        {reviews.length > 0 ?
          <ul>
            {reviews.map(review => (
              <li key={review.id} className='bg-gray-100 p-4 mb-4 rounded-md'>
                <p className='font-semibold'>{review.user.name}</p>
                <p className='text-gray-600'>Rating: {review.rating} / 5</p>
                <p>{review.content}</p>
              </li>
            ))}
          </ul>
        : <p>No hay reseñas aún.</p>}
      </div>

      {/* Formulario para agregar una reseña */}
      <div className='mt-8'>
        <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
          Deja una reseña
        </h2>
        <form onSubmit={handleReviewSubmit} className='mt-4'>
          <textarea
            value={newReview.content}
            onChange={e =>
              setNewReview({ ...newReview, content: e.target.value })
            }
            placeholder='Escribe tu reseña...'
            className='w-full p-3 border border-gray-300 rounded-md bg-white text-black'
            rows={4}
            required
          />
          <div className='mt-2'>
            <label htmlFor='rating' className='mr-2 text-gray-900'>
              Calificación:{' '}
            </label>
            <select
              id='rating'
              value={newReview.rating}
              onChange={e =>
                setNewReview({
                  ...newReview,
                  rating: Number.parseInt(e.target.value)
                })
              }
              className='p-2 border border-gray-300 rounded-md bg-white text-black'
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
          </div>
          <button
            type='submit'
            className='mt-4 bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600'
          >
            Enviar Reseña
          </button>
        </form>
      </div>
    </div>
  )
}

export default RestaurantDetailPage
