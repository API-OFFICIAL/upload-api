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
const PORT = process.env.PORT || 3000
const DOMAIN = process.env.DOMAIN || 'http://panel-api.strangled.net'

// Middleware untuk VPS
app.use(cors())
app.use(express.json())
app.use(fileUpload({
  createParentPath: true,
  limits: { 
    fileSize: 10 * 1024 * 1024,
    files: 5
  }
}))
app.use('/uploads', express.static(join(__dirname, 'uploads')))

// Buat folder uploads
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads')
}

// HTML Documentation
const htmlDoc = `
<!DOCTYPE html>
<html>
<head>
    <title>Upload API - VPS</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .card { background: #f5f5f5; padding: 20px; margin: 10px 0; border-radius: 8px; }
    </style>
</head>
<body>
    <h1>🚀 Upload API - VPS Edition</h1>
    <p>Domain: ${DOMAIN}</p>
    
    <div class="card">
        <h3>POST /upload</h3>
        <p>Upload image file</p>
    </div>
    
    <div class="card">
        <h3>GET /health</h3>
        <p>Health check</p>
    </div>
</body>
</html>
`

// Routes
app.get('/', (req, res) => {
  res.send(htmlDoc)
})

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    platform: 'VPS',
    domain: DOMAIN,
    timestamp: new Date().toISOString()
  })
})

app.post('/upload', async (req, res) => {
  try {
    if (!req.files?.image) {
      return res.status(400).json({ error: 'No image provided' })
    }

    const image = req.files.image
    const filename = `img_${Date.now()}.jpg`
    const filepath = join(__dirname, 'uploads', filename)

    // Process image
    await sharp(image.data)
      .jpeg({ quality: 85 })
      .resize(1200, 1200, { fit: 'inside' })
      .toFile(filepath)

    const imageUrl = `${DOMAIN}/uploads/${filename}`

    res.json({
      success: true,
      url: imageUrl,
      message: 'Upload successful on VPS'
    })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Cleanup files every 10 minutes
setInterval(() => {
  const uploadsDir = join(__dirname, 'uploads')
  if (fs.existsSync(uploadsDir)) {
    fs.readdir(uploadsDir, (err, files) => {
      if (err) return
      const now = Date.now()
      files.forEach(file => {
        const filepath = join(uploadsDir, file)
        try {
          const stats = fs.statSync(filepath)
          if (now - stats.mtime.getTime() > 10 * 60 * 1000) {
            fs.unlinkSync(filepath)
          }
        } catch (e) {}
      })
    })
  }
}, 10 * 60 * 1000)

app.listen(PORT, () => {
  console.log(`🚀 VPS Server running on port ${PORT}`)
  console.log(`📍 Domain: ${DOMAIN}`)
})
