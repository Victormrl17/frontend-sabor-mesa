// src/components/NotificationContext.tsx

import type React from 'react'
import { createContext, useContext } from 'react'
import { ToastContainer, toast } from 'react-toastify' // Importamos Toastify
import 'react-toastify/dist/ReactToastify.css' // Importamos los estilos

// Creamos el contexto de notificaciones
const NotificationContext = createContext<
  ((message: string) => void) | undefined
>(undefined)

// Hook personalizado para acceder al contexto
export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error(
      'useNotification debe ser usado dentro de un NotificationProvider'
    )
  }
  return context
}

// Proveedor de notificaciones
interface NotificationProviderProps {
  children: React.ReactNode
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children
}) => {
  const notify = (message: string) => toast(message) // Función para mostrar la notificación

  return (
    <NotificationContext.Provider value={notify}>
      {children}
      <ToastContainer />{' '}
      {/* Este es el contenedor que renderiza las notificaciones */}
    </NotificationContext.Provider>
  )
}
