import express from 'express'
import fileUpload from 'express-fileupload'
import cors from 'cors'
import sharp from 'sharp'

const app = express()

// Middleware untuk Vercel
app.use(cors())
app.use(express.json())
app.use(fileUpload({
  useTempFiles: false,
  limits: { fileSize: 4 * 1024 * 1024 } // 4MB max for Vercel
}))

// Upload endpoint
app.post('/', async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ 
        success: false, 
        error: 'No image file provided' 
      })
    }

    const image = req.files.image
    
    // Process image dengan Sharp
    const processedImage = await sharp(image.data)
      .jpeg({ 
        quality: 85,
        progressive: true
      })
      .resize(1200, 1200, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .toBuffer()

    // Convert ke base64 untuk response
    const base64Image = processedImage.toString('base64')
    const dataUrl = `data:image/jpeg;base64,${base64Image}`

    res.json({
      success: true,
      data: dataUrl,
      message: 'Image processed successfully on Vercel',
      size: (processedImage.length / 1024).toFixed(2) + ' KB'
    })

  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Upload failed: ' + error.message 
    })
  }
})

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Vercel Upload API is running',
    timestamp: new Date().toISOString()
  })
})

export default app
