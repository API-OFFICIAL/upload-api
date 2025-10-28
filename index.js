import express from 'express'
import fileUpload from 'express-fileupload'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = 3000

// Middleware
app.use(cors())
app.use(fileUpload({
  createParentPath: true,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
}))
app.use('/uploads', express.static(join(__dirname, 'uploads')))

// Buat folder uploads jika belum ada
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads')
}

// Endpoint upload
app.post('/upload', async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: 'No image uploaded' })
    }

    const image = req.files.image
    const filename = `img_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`
    const filepath = join(__dirname, 'uploads', filename)

    // Simpan file
    await image.mv(filepath)

    // URL publik (ganti dengan IP/domain server kamu)
    const publicUrl = `http://localhost:${PORT}/uploads/${filename}`

    res.json({
      success: true,
      url: publicUrl,
      filename: filename
    })

  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'Upload failed' })
  }
})

// Cleanup file otomatis setelah 5 menit
setInterval(() => {
  const uploadsDir = join(__dirname, 'uploads')
  fs.readdir(uploadsDir, (err, files) => {
    if (err) return
    
    const now = Date.now()
    files.forEach(file => {
      const filepath = join(uploadsDir, file)
      const stats = fs.statSync(filepath)
      if (now - stats.mtime.getTime() > 5 * 60 * 1000) { // 5 menit
        fs.unlinkSync(filepath)
        console.log('Deleted old file:', file)
      }
    })
  })
}, 60 * 1000) // Cek setiap 1 menit

app.listen(PORT, '0.0.0.0', () => {
  console.log(`📤 Upload server running on port ${PORT}`)
  console.log(`📍 Access via: http://localhost:${PORT}`)
})
