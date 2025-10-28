import express from 'express'
import fileUpload from 'express-fileupload'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'
import sharp from 'sharp'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = 3000

// Middleware
app.use(cors())
app.use(fileUpload({
  createParentPath: true,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
}))
app.use('/uploads', express.static(join(__dirname, 'uploads')))

// Buat folder uploads jika belum ada
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads')
}

// Endpoint upload dengan konversi gambar
app.post('/upload', async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: 'No image uploaded' })
    }

    const image = req.files.image
    const filename = `img_${Date.now()}.jpg`
    const filepath = join(__dirname, 'uploads', filename)

    // Konversi gambar ke JPG dengan sharp
    try {
      await sharp(image.data)
        .jpeg({ 
          quality: 85,
          progressive: true 
        })
        .resize(1200, 1200, { // Resize max 1200px
          fit: 'inside',
          withoutEnlargement: true
        })
        .toFile(filepath)
      
      console.log('✅ Image converted to JPG:', filename)

    } catch (sharpError) {
      console.log('Sharp conversion failed, using original:', sharpError.message)
      // Fallback: simpan asli
      await image.mv(filepath)
    }

    // URL publik
    const publicUrl = `http://panel-api.strangled.net/uploads/${filename}`

    res.json({
      success: true,
      url: publicUrl,
      filename: filename,
      message: 'Image converted to JPG format'
    })

  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'Upload failed: ' + error.message })
  }
})

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Upload Server is running',
    endpoint: 'POST /upload'
  })
})

// Cleanup file
setInterval(() => {
  const uploadsDir = join(__dirname, 'uploads')
  fs.readdir(uploadsDir, (err, files) => {
    if (err) return
    
    const now = Date.now()
    files.forEach(file => {
      const filepath = join(uploadsDir, file)
      try {
        const stats = fs.statSync(filepath)
        if (now - stats.mtime.getTime() > 10 * 60 * 1000) {
          fs.unlinkSync(filepath)
          console.log('🗑️ Deleted:', file)
        }
      } catch (e) {}
    })
  })
}, 2 * 60 * 1000)

app.listen(PORT, '0.0.0.0', () => {
  console.log(`📤 Upload server running on port ${PORT}`)
  console.log(`📍 Domain: http://panel-api.strangled.net`)
})
