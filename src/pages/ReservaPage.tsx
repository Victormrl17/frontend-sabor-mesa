import { useState } from 'react'
import axios from 'axios'
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  // @ts-ignore
  CardFooter
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface ReservaFormData {
  date: string
  peopleCount: number
}

const ReservaPage = () => {
  const [formData, setFormData] = useState<ReservaFormData>({
    date: '',
    peopleCount: 1
  })
  // @ts-ignore
  const [restaurantId, setRestaurantId] = useState<number>(1) // Suponiendo que el id del restaurante es 1

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === 'peopleCount' ? Number(value) : value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Verificar que los valores sean correctos
    if (!formData.date || formData.peopleCount <= 0) {
      alert(
        'Por favor, ingrese una fecha válida y un número de personas mayor a cero.'
      )
      return
    }

    // Asegurarse de que la fecha esté en el formato correcto
    const formattedDate = new Date(formData.date).toISOString()
    const formattedRestaurantId = Number(restaurantId)

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        alert('No estás autenticado. Por favor, inicia sesión.')
        return
      }

      // Realizar la solicitud POST para crear la reserva
      // @ts-ignore
      const response = await axios.post(
        'http://localhost:3000/api/bookings',
        {
          date: formattedDate,
          peopleCount: formData.peopleCount,
          restaurantId: formattedRestaurantId
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      // Si la reserva es exitosa, mostrar mensaje
      alert('Reserva realizada con éxito')
    } catch (error) {
      console.error('Error al crear la reserva', error)
      alert('Error al realizar la reserva')
    }
  }

  return (
    <main className='flex justify-center my-auto px-4 py-8'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-3xl font-bold text-center text-primary dark:text-primary-lighter'>
            Realizar Reserva
          </CardTitle>
          <CardDescription className='text-center'>
            Completa los detalles de tu reserva.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <label
                  htmlFor='date'
                  className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                >
                  Fecha de la reserva
                </label>
                <Input
                  id='date'
                  name='date'
                  type='datetime-local'
                  value={formData.date}
                  onChange={handleInputChange}
                  className='w-full p-2 border rounded mt-2'
                />
              </div>
              <div className='space-y-2'>
                <label
                  htmlFor='peopleCount'
                  className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                >
                  Número de personas
                </label>
                <Input
                  id='peopleCount'
                  name='peopleCount'
                  type='number'
                  value={formData.peopleCount}
                  onChange={handleInputChange}
                  className='w-full p-2 border rounded mt-2'
                  min='1'
                />
              </div>
              <Button
                type='submit'
                className='w-full font-bold bg-blue-500 hover:bg-blue-600 text-white'
              >
                Reservar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}

export default ReservaPage
