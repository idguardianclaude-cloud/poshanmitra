// Read an image File and downscale it in the browser before it's shown or sent.
// Downscaling keeps the persisted chat thumbnail small (localStorage is tiny)
// and keeps the payload to Gemini light, while staying clear enough for vision.
// Returns { dataUrl, base64, mimeType }: dataUrl for display, base64 (no prefix)
// for the Gemini inlineData part.

const MAX_DIM = 512
const MIME = 'image/jpeg'
const QUALITY = 0.82

export function isImageFile(file) {
  return !!file && typeof file.type === 'string' && file.type.startsWith('image/')
}

export function readAndDownscaleImage(file) {
  return new Promise((resolve, reject) => {
    if (!isImageFile(file)) {
      reject(new Error('not-an-image'))
      return
    }
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      try {
        const scale = Math.min(1, MAX_DIM / Math.max(img.width, img.height))
        const w = Math.max(1, Math.round(img.width * scale))
        const h = Math.max(1, Math.round(img.height * scale))
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, w, h)
        const dataUrl = canvas.toDataURL(MIME, QUALITY)
        URL.revokeObjectURL(url)
        resolve({
          dataUrl,
          base64: dataUrl.split(',')[1] || '',
          mimeType: MIME,
        })
      } catch (err) {
        URL.revokeObjectURL(url)
        reject(err)
      }
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('image-load-failed'))
    }
    img.src = url
  })
}
