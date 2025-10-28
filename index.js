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

// Middleware
app.use(cors())
app.use(express.json())
app.use(fileUpload({
  createParentPath: true,
  limits: { fileSize: 10 * 1024 * 1024, files: 5 },
  abortOnLimit: true,
  responseOnLimit: 'File size too large'
}))
app.use('/uploads', express.static(join(__dirname, 'uploads')))

// Buat folder uploads jika belum ada
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads')

// HTML dokumentasi sederhana
const htmlDocumentation = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Premium Upload API</title>
  <style>
    body { font-family: system-ui; background: #0f172a; color: #f1f5f9; text-align: center; padding: 3em; }
    h1 { font-size: 2em; color: #38bdf8; }
    code { background: #1e293b; padding: 3px 6px; border-radius: 4px; }
    a { color: #38bdf8; text-decoration: none; }
  </style>
</head>
<body>
  <h1>🚀 Premium Upload API</h1>
  <p>Use <code>POST /upload</code> with form-data field <code>image</code></p>
  <p><a href="/stats">View stats</a> | <a href="/health">Health check</a></p>
</body>
</html>
`

// ==================== ROUTES ====================

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html')
  res.send(htmlDocumentation)
})

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    host: req.get('host')
  })
})

app.get('/stats', (req, res) => {
  const uploadsDir = join(__dirname, 'uploads')
  let fileCount = 0, totalSize = 0
  try {
    const files = fs.readdirSync(uploadsDir)
    fileCount = files.length
    files.forEach(file => totalSize += fs.statSync(join(uploadsDir, file)).size)
  } catch {}
  res.json({
    files_count: fileCount,
    total_size: (totalSize / 1024 / 1024).toFixed(2) + ' MB',
    time: new Date().toISOString()
  })
})

app.post('/upload', async (req, res) => {
  try {
    if (!req.files || !req.files.image)
      return res.status(400).json({ success: false, error: 'No image file provided' })

    const image = req.files.image
    const filename = `img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.jpg`
    const filepath = join(__dirname, 'uploads', filename)

    try {
      await sharp(image.data)
        .jpeg({ quality: 90, progressive: true, optimizeScans: true })
        .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })
        .withMetadata()
        .toFile(filepath)
    } catch {
      await image.mv(filepath)
    }

    const url = `${req.protocol}://${req.get('host')}/uploads/${filename}`
    res.json({
      success: true,
      url,
      filename,
      message: '🎉 Uploaded successfully!',
      size_kb: (fs.statSync(filepath).size / 1024).toFixed(2),
      time: new Date().toISOString()
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// Jangan app.listen di Vercel
export default app
