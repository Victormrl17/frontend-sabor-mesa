import axios from 'axios'

// Carga de la imagen a Cloudinary
export const uploadImageToCloudinary = async (file: File) => {
  const cloudName = 'ddhb31ttg' // Tu Cloudinary Cloud Name
  const uploadPreset = 'my_upload_preset' // Nombre de tu upload preset creado en Cloudinary

  const formData = new FormData()
  formData.append('file', file)
  if (!uploadPreset) {
    throw new Error('Cloudinary upload preset is not defined')
  }
  formData.append('upload_preset', uploadPreset)

  try {
    const response = await axios.post<{ secure_url: string }>(
      `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
      formData
    )
    return response.data.secure_url // Devuelve la URL de la imagen subida
  } catch (error) {
    console.error('Error al subir la imagen a Cloudinary:', error)
    throw new Error('Error al subir la imagen a Cloudinary')
  }
}