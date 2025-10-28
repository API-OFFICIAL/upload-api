import express from 'express'
import fileUpload from 'express-fileupload'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(fileUpload({ createParentPath: true }))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Pastikan folder uploads ada
if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
  fs.mkdirSync(path.join(__dirname, 'uploads'))
}

// Home route
app.get('/', (req, res) => {
  res.send(`
    <h1>🚀 Simple Upload API</h1>
    <form method="POST" action="/upload" enctype="multipart/form-data">
      <input type="file" name="image" accept="image/*" />
      <button type="submit">Upload</button>
    </form>
  `)
})

// Upload route
app.post('/upload', async (req, res) => {
  try {
    if (!req.files || !req.files.image)
      return res.status(400).json({ success: false, error: 'No file uploaded' })

    const image = req.files.image
    const filename = `img_${Date.now()}.jpg`
    const filepath = path.join(__dirname, 'uploads', filename)

    await sharp(image.data)
      .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toFile(filepath)

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${filename}`

    res.json({
      success: true,
      message: '✅ Image uploaded successfully!',
      filename,
      url: fileUrl
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

// ✅ Ekspor app (buat Vercel)
export default app

// ✅ Jalankan lokal
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`))
}
