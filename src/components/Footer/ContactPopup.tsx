import { useEffect } from 'react'
import { X } from 'lucide-react'

interface ContactPopupProps {
  onClose: () => void
}

function ContactPopup({ onClose }: ContactPopupProps) {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEsc)

    return () => {
      window.removeEventListener('keydown', handleEsc)
    }
  }, [onClose])

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 dark:bg-opacity-80 z-50'>
      <div className='bg-white dark:bg-dark-primary-foreground p-8 rounded-lg shadow-lg w-80 relative'>
        <button
          type='button'
          onClick={onClose}
          className='absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
        >
          <X size={24} />
          <span className='sr-only'>Cerrar</span>
        </button>

        <h2 className='text-xl font-bold mb-4 dark:text-white'>
          ¡Contáctanos!
        </h2>
        <p className='mb-4 dark:text-gray-300'>
          Haz clic para chatear con nosotros
        </p>
        <a
          href='https://chat.whatsapp.com/'
          target='_blank'
          rel='noopener noreferrer'
          className='bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition'
        >
          Chatear en WhatsApp
        </a>
      </div>
    </div>
  )
}
export default ContactPopup
