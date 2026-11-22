export const acceptedPhotoTypes = 'image/jpeg,image/png,image/webp'
const maxSourceSize = 10 * 1024 * 1024
const maxStoredSize = 250 * 1024

export async function prepareReportPhoto(file) {
  if (!acceptedPhotoTypes.split(',').includes(file.type)) {
    throw new Error('Choisissez une image JPG, PNG ou WebP.')
  }

  if (file.size > maxSourceSize) {
    throw new Error('Choisissez une image de 10 Mo ou moins.')
  }

  const url = URL.createObjectURL(file)
  const image = new Image()

  try {
    image.src = url
    await image.decode()
    const canvas = document.createElement('canvas')
    const scale = Math.min(1, 960 / Math.max(image.naturalWidth, image.naturalHeight))
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale))
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale))

    const context = canvas.getContext('2d', { alpha: false })
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.drawImage(image, 0, 0, canvas.width, canvas.height)

    for (const quality of [0.78, 0.6, 0.42]) {
      const preview = canvas.toDataURL('image/jpeg', quality)
      if (preview.length <= maxStoredSize) return preview
    }
  } catch {
    throw new Error('Cette photo est illisible. Choisissez une autre image.')
  } finally {
    URL.revokeObjectURL(url)
  }

  throw new Error('La photo reste trop volumineuse après compression. Essayez une image plus petite.')
}
