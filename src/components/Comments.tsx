import { useEffect, useState } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '@/config'

interface Comment {
  id: number
  content: string
  rating: number
  user: { name: string }
}

const Comments = ({ restaurantId }: { restaurantId: number }) => {
  const [comments, setComments] = useState<Comment[]>([])

  useEffect(() => {
    const fetchComments = async () => {
      const response = await axios.get(
        `${API_BASE_URL}/api/comments/restaurant/${restaurantId}`
      )
      setComments(response.data as Comment[])
    }
    fetchComments()
  }, [restaurantId])

  return (
    <div className='mt-6'>
      <h3 className='text-lg font-bold'>Comentarios</h3>
      {comments.length === 0 ?
        <p>No hay comentarios todavía.</p>
      : <ul>
          {comments.map(comment => (
            <li
              key={comment.id}
              className='mb-4 p-4 bg-gray-100 rounded shadow'
            >
              <p className='text-sm text-gray-700'>{comment.user.name}</p>
              <p className='text-gray-800'>{comment.content}</p>
              <p className='text-yellow-500'>Calificación: {comment.rating}</p>
            </li>
          ))}
        </ul>
      }
    </div>
  )
}

export default Comments
