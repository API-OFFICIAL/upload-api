import express from 'express'
import fileUpload from 'express-fileupload'
import sharp from 'sharp'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const app = express()

app.use(cors())
app.use(express.json())
app.use(fileUpload())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// buat folder kalau belum ada
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads')

// route utama
app.get('/', (req, res) => {
  res.send(`
    <h1>🚀 Upload API</h1>
    <form method="POST" action="/upload" enctype="multipart/form-data">
      <input type="file" name="image" accept="image/*" required />
      <button type="submit">Upload</button>
    </form>
  `)
})

// upload route
app.post('/upload', async (req, res) => {
  try {
    if (!req.files?.image) return res.status(400).json({ error: 'No image uploaded' })
    const image = req.files.image
    const filename = `img_${Date.now()}.jpg`
    const filepath = path.join(__dirname, 'uploads', filename)

    await sharp(image.data)
      .resize(1600, 1600, { fit: 'inside' })
      .jpeg({ quality: 85 })
      .toFile(filepath)

    const url = `${req.protocol}://${req.get('host')}/uploads/${filename}`
    res.json({ success: true, url })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ⛔ Jangan app.listen() di Vercel!
// ✅ Tambahkan baris ini biar Express bisa dijalankan di serverless
export default (req, res) => app(req, res)
