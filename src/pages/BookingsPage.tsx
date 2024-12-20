import { useEffect, useState } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '../config'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalClose,
  ResponsiveModalTitle,
  ResponsiveModalDescription,
  ResponsiveModalHeader,
  ResponsiveModalFooter
} from '@/components/ui/modal'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface Booking {
  id: number
  date: string
  peopleCount: number
  restaurant: { name: string }
}

interface BookingDetails {
  date: string
  peopleCount: number
  restaurant: {
    name: string
    location: string
    cuisine: string
    images: string[]
  }
}

const BookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedBooking, setSelectedBooking] = useState<BookingDetails | null>(
    null
  )
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem('token')
      try {
        const response = await axios.get(`${API_BASE_URL}/api/bookings/user`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setBookings(response.data as Booking[])
      } catch (error) {
        console.error('Error al cargar las reservas', error)
        toast.error('Error al cargar las reservas', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: true,
          theme: 'light'
        })
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [])

  const handleViewDetails = async (bookingId: number) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(
        `${API_BASE_URL}/api/bookings/${bookingId}/details`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      setSelectedBooking(response.data as BookingDetails)
      setIsModalOpen(true)
      toast.info('Detalles de la reserva cargados', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        theme: 'light'
      })
    } catch (error) {
      console.error('Error al obtener los detalles de la reserva', error)
      toast.error('Error al obtener los detalles de la reserva', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        theme: 'light'
      })
    }
  }

  const handleDeleteBooking = async (bookingId: number) => {
    const token = localStorage.getItem('token')
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/bookings/${bookingId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      const data = response.data as { message: string }
      toast.success(data.message, {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        theme: 'light'
      })
      setBookings(prevBookings =>
        prevBookings.filter(booking => booking.id !== bookingId)
      )
    } catch (error) {
      console.error('Error al eliminar la reserva', error)
      toast.error('Hubo un error al eliminar la reserva', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        theme: 'light'
      })
    }
  }

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen bg-gradient-to-r'>
        <div className='relative'>
          <div className='absolute inset-0 rounded-lg' />
          <div className='flex flex-col justify-center items-center z-10'>
            <div className='loader animate-spin border-8 border-t-4 border-blue-600 rounded-full w-24 h-24 mb-4' />
            <p className='text-2xl text-black font-semibold'>
              Cargando reservas...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto p-6 bg-white min-h-screen text-center'>
      <h1 className='text-3xl font-bold mb-6 text-gray-900 dark:text-white'>
        Mis Reservas
      </h1>
      {bookings.length === 0 ?
        <p className='text-gray-600 dark:text-gray-300'>
          No tienes reservas actualmente.
        </p>
      : <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {bookings.map(booking => (
            <Card
              key={booking.id}
              className='p-6 shadow-lg hover:shadow-xl transition duration-300 ease-in-out'
            >
              <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
                {booking.restaurant.name}
              </h2>
              <p className='text-gray-600 dark:text-gray-300'>
                Fecha: {new Date(booking.date).toLocaleString()}
              </p>
              <p className='text-gray-600 dark:text-gray-300'>
                Personas: {booking.peopleCount}
              </p>
              <div className='flex flex-col gap-3 mt-4'>
                <Button
                  className='bg-blue-600 hover:bg-blue-700 text-white w-full'
                  onClick={() => handleViewDetails(booking.id)}
                >
                  Ver Detalles
                </Button>
                <Button
                  className='bg-red-600 hover:bg-red-700 text-white w-full'
                  onClick={() => handleDeleteBooking(booking.id)}
                >
                  Eliminar Reserva
                </Button>
              </div>
            </Card>
          ))}
        </div>
      }

      {/* Modal con los detalles de la reserva */}
      {selectedBooking && (
        <ResponsiveModal
          open={isModalOpen}
          onOpenChange={open => setIsModalOpen(open)}
        >
          <ResponsiveModalContent>
            <ResponsiveModalHeader>
              <ResponsiveModalTitle>
                {selectedBooking.restaurant.name}
              </ResponsiveModalTitle>
            </ResponsiveModalHeader>

            <ResponsiveModalDescription>
              <p>
                <strong>Fecha:</strong>{' '}
                {new Date(selectedBooking.date).toLocaleString()}
              </p>
              <p>
                <strong>Personas:</strong> {selectedBooking.peopleCount}
              </p>
              <p>
                <strong>Ubicación:</strong>{' '}
                {selectedBooking.restaurant.location}
              </p>
              <p>
                <strong>Cocina:</strong> {selectedBooking.restaurant.cuisine}
              </p>
              <div className='mt-4'>
                <strong>Imágenes:</strong>
                <div className='grid grid-cols-2 gap-2 mt-2'>
                  {selectedBooking.restaurant.images.map(image => (
                    <img
                      key={image}
                      src={image}
                      alt={`Imagen ${image}`}
                      className='w-full h-auto rounded'
                    />
                  ))}
                </div>
              </div>
            </ResponsiveModalDescription>

            <ResponsiveModalFooter>
              <ResponsiveModalClose asChild>
                <Button
                  variant='outline'
                  className='w-full'
                  onClick={() => setIsModalOpen(false)}
                >
                  Cerrar
                </Button>
              </ResponsiveModalClose>
            </ResponsiveModalFooter>
          </ResponsiveModalContent>
        </ResponsiveModal>
      )}

      <ToastContainer />
    </div>
  )
}

export default BookingsPage
