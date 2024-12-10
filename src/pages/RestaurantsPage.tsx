import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { API_BASE_URL } from '@/config'

interface Restaurant {
  id: number
  name: string
  location: string
  cuisine: string
  images: string[]
  comments: { rating: number }[]
}

const RestaurantsPage = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])

  const getReviewData = (comments: { rating: number }[]) => {
    if (comments.length === 0) {
      return { avgRating: '--', reviewCount: 0 }
    }

    const totalRating = comments.reduce(
      (sum, comment) => sum + comment.rating,
      0
    )
    const avgRating = (totalRating / comments.length).toFixed(1)
    return { avgRating, reviewCount: comments.length }
  }

  useEffect(() => {
    const fetchRestaurants = async () => {
      const token = localStorage.getItem('token')
      try {
        const response = await axios.get<Restaurant[]>(
          `${API_BASE_URL}/api/restaurants`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )

        for (const restaurant of response.data) {
          const commentsResponse = await axios.get<{ rating: number }[]>(
            `${API_BASE_URL}/api/comments/restaurant/${restaurant.id}`
          )
          restaurant.comments = commentsResponse.data
        }
        setRestaurants(response.data)
      } catch (error) {
        console.error('Error al cargar los restaurantes', error)
        toast.error('Error al cargar los restaurantes', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: true,
          theme: 'light'
        })
      }
    }
    fetchRestaurants()
  }, [])

  return (
    <div className='container mx-auto px-4 py-4 p-6 min-h-screen'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {restaurants.map(restaurant => {
          const { avgRating, reviewCount } = getReviewData(restaurant.comments)
          return (
            <div
              key={restaurant.id}
              className='bg-white rounded-lg overflow-hidden shadow-lg'
            >
              <div className='p-4'>
                {restaurant.images.length > 1 ?
                  <Carousel
                    showThumbs={false}
                    infiniteLoop
                    useKeyboardArrows
                    autoPlay
                    interval={3000}
                    className='w-full h-40 md:h-56'
                  >
                    {restaurant.images.map((image, index) => (
                      <div key={image} className='w-full h-full'>
                        <img
                          src={image}
                          alt={`${restaurant.name} - imagen ${index + 1}`}
                          className='w-full h-full object-cover rounded-md'
                        />
                      </div>
                    ))}
                  </Carousel>
                : <img
                    alt={restaurant.name}
                    className='w-full h-40 md:h-56 object-cover rounded-md'
                    src={restaurant.images[0]}
                  />
                }
              </div>
              <div className='p-4'>
                <h2 className='text-xl font-bold mt-2 text-gray-900 dark:text-white'>
                  {restaurant.name}
                </h2>
                <p className='text-sm text-gray-600 dark:text-gray-300'>
                  {avgRating} <i className='fas fa-star text-yellow-500' /> /{' '}
                  {reviewCount} Reviews
                </p>
                <p className='text-sm text-gray-600 dark:text-gray-300'>
                  {restaurant.cuisine} | {restaurant.location}
                </p>
                <Link
                  to={`/restaurants/${restaurant.id}`}
                  className='text-blue-500 mt-2 block'
                >
                  Detalle →
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      <ToastContainer />
    </div>
  )
}

export default RestaurantsPage
