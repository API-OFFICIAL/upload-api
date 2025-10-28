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

// Middleware
app.use(cors())
app.use(express.json())
app.use(fileUpload({
  createParentPath: true,
  limits: { 
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 5
  },
  abortOnLimit: true,
  responseOnLimit: 'File size too large'
}))
app.use('/uploads', express.static(join(__dirname, 'uploads')))

// Buat folder uploads jika belum ada
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads')
}

// ==================== HTML DOCUMENTATION ====================
const htmlDocumentation = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🛠️ Premium Upload API - by Ahmad</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            text-align: center;
            padding: 40px 0;
            color: white;
        }
        
        .header h1 {
            font-size: 3rem;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .header .subtitle {
            font-size: 1.2rem;
            opacity: 0.9;
        }
        
        .badge {
            background: #ff6b6b;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.9rem;
            margin-left: 10px;
        }
        
        .card {
            background: white;
            border-radius: 15px;
            padding: 30px;
            margin: 20px 0;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            transition: transform 0.3s ease;
        }
        
        .card:hover {
            transform: translateY(-5px);
        }
        
        .card h2 {
            color: #667eea;
            margin-bottom: 20px;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
        }
        
        .endpoint {
            background: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 15px;
            margin: 15px 0;
            border-radius: 5px;
        }
        
        .method {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            font-weight: bold;
            margin-right: 10px;
        }
        
        .url {
            font-family: 'Courier New', monospace;
            background: #e9ecef;
            padding: 2px 5px;
            border-radius: 3px;
        }
        
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        
        .feature {
            text-align: center;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 10px;
        }
        
        .feature i {
            font-size: 2rem;
            margin-bottom: 10px;
        }
        
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        
        .stat {
            text-align: center;
            padding: 20px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .stat .number {
            font-size: 2rem;
            font-weight: bold;
            color: #667eea;
        }
        
        .footer {
            text-align: center;
            padding: 40px 0;
            color: white;
            opacity: 0.8;
        }
        
        .code-block {
            background: #2d3748;
            color: #e2e8f0;
            padding: 20px;
            border-radius: 8px;
            margin: 15px 0;
            overflow-x: auto;
            font-family: 'Courier New', monospace;
        }
        
        .btn {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 12px 25px;
            text-decoration: none;
            border-radius: 25px;
            margin: 10px 5px;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
        }
        
        .btn:hover {
            background: #5a67d8;
            transform: translateY(-2px);
        }
        
        .btn-test {
            background: #48bb78;
        }
        
        .btn-test:hover {
            background: #38a169;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🛠️ Premium Upload API <span class="badge">PRO</span></h1>
            <p class="subtitle">High Performance Image Processing Server</p>
            <p>🔥 Built with Express.js & Sharp | 🚀 Auto Image Optimization</p>
        </div>

        <div class="card">
            <h2>📊 Server Statistics</h2>
            <div class="stats">
                <div class="stat">
                    <div class="number">${PORT}</div>
                    <div>Port</div>
                </div>
                <div class="stat">
                    <div class="number">10MB</div>
                    <div>Max File Size</div>
                </div>
                <div class="stat">
                    <div class="number">Auto</div>
                    <div>Cleanup</div>
                </div>
                <div class="stat">
                    <div class="number">${DOMAIN}</div>
                    <div>Domain</div>
                </div>
            </div>
        </div>

        <div class="card">
            <h2>🚀 API Endpoints</h2>
            
            <div class="endpoint">
                <span class="method">GET</span>
                <span class="url">/</span>
                <p>📖 API Documentation (This Page)</p>
            </div>
            
            <div class="endpoint">
                <span class="method">POST</span>
                <span class="url">/upload</span>
                <p>📤 Upload and Process Image</p>
                <p><strong>Parameters:</strong> image (file)</p>
            </div>
            
            <div class="endpoint">
                <span class="method">GET</span>
                <span class="url">/health</span>
                <p>❤️ Health Check</p>
            </div>
            
            <div class="endpoint">
                <span class="method">GET</span>
                <span class="url">/stats</span>
                <p>📈 Server Statistics</p>
            </div>
        </div>

        <div class="card">
            <h2>💡 Features</h2>
            <div class="feature-grid">
                <div class="feature">
                    <div>🖼️</div>
                    <h3>Auto Format</h3>
                    <p>Convert to JPG automatically</p>
                </div>
                <div class="feature">
                    <div>📏</div>
                    <h3>Smart Resize</h3>
                    <p>Optimize image dimensions</p>
                </div>
                <div class="feature">
                    <div>🧹</div>
                    <h3>Auto Cleanup</h3>
                    <p>Remove old files automatically</p>
                </div>
                <div class="feature">
                    <div>⚡</div>
                    <h3>High Speed</h3>
                    <p>Fast processing with Sharp</p>
                </div>
            </div>
        </div>

        <div class="card">
            <h2>🔧 Quick Start</h2>
            <h3>Upload Image:</h3>
            <div class="code-block">
// JavaScript Example
const formData = new FormData();
formData.append('image', fileInput.files[0]);

const response = await fetch('${DOMAIN}/upload', {
    method: 'POST',
    body: formData
});

const result = await response.json();
console.log(result);
            </div>
            
            <h3>Response Format:</h3>
            <div class="code-block">
{
    "success": true,
    "url": "${DOMAIN}/uploads/filename.jpg",
    "filename": "filename.jpg",
    "message": "Image processed successfully"
}
            </div>
            
            <button class="btn btn-test" onclick="testUpload()">🧪 Test Upload API</button>
        </div>

        <div class="card">
            <h2>📞 Support</h2>
            <p>🛠️ <strong>Developer:</strong> Ahmad</p>
            <p>🚀 <strong>Version:</strong> 2.0.0 Premium</p>
            <p>📧 <strong>Support:</strong> Included</p>
            <p>🕒 <strong>Uptime:</strong> 99.9%</p>
        </div>

        <div class="footer">
            <p>© 2024 Premium Upload API - Built with ❤️ by Ahmad</p>
            <p>🚀 Powering your applications with high-performance image processing</p>
        </div>
    </div>

    <script>
        async function testUpload() {
            const btn = event.target;
            const originalText = btn.textContent;
            btn.textContent = '🔄 Testing...';
            btn.disabled = true;
            
            try {
                // Create a simple test image
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = 100;
                canvas.height = 100;
                ctx.fillStyle = '#667eea';
                ctx.fillRect(0, 0, 100, 100);
                ctx.fillStyle = 'white';
                ctx.font = '20px Arial';
                ctx.fillText('TEST', 20, 50);
                
                canvas.toBlob(async (blob) => {
                    const formData = new FormData();
                    formData.append('image', blob, 'test.jpg');
                    
                    const response = await fetch('/upload', {
                        method: 'POST',
                        body: formData
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        alert('✅ Test Successful!\\nImage URL: ' + result.url);
                    } else {
                        alert('❌ Test Failed: ' + (result.error || 'Unknown error'));
                    }
                    
                    btn.textContent = originalText;
                    btn.disabled = false;
                }, 'image/jpeg', 0.8);
                
            } catch (error) {
                alert('❌ Test Error: ' + error.message);
                btn.textContent = originalText;
                btn.disabled = false;
            }
        }
        
        // Live stats update
        function updateStats() {
            fetch('/stats')
                .then(r => r.json())
                .then(data => {
                    // Update stats here if needed
                })
                .catch(console.error);
        }
        
        // Update stats every 30 seconds
        setInterval(updateStats, 30000);
    </script>
</body>
</html>
`

// ==================== API ROUTES ====================

// Home - Documentation
app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html')
  res.send(htmlDocumentation)
})

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    domain: DOMAIN
  })
})

// Server statistics
app.get('/stats', (req, res) => {
  const uploadsDir = join(__dirname, 'uploads')
  let fileCount = 0
  let totalSize = 0
  
  try {
    const files = fs.readdirSync(uploadsDir)
    fileCount = files.length
    files.forEach(file => {
      const stats = fs.statSync(join(uploadsDir, file))
      totalSize += stats.size
    })
  } catch (e) {
    // Ignore error
  }
  
  res.json({
    files_count: fileCount,
    total_size: (totalSize / 1024 / 1024).toFixed(2) + ' MB',
    server_time: new Date().toISOString(),
    domain: DOMAIN,
    port: PORT
  })
})

// Upload endpoint
app.post('/upload', async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ 
        success: false, 
        error: 'No image file provided' 
      })
    }

    const image = req.files.image
    const filename = `img_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.jpg`
    const filepath = join(__dirname, 'uploads', filename)

    console.log(`📥 Processing: ${image.name} -> ${filename}`)

    // Process image with Sharp
    try {
      await sharp(image.data)
        .jpeg({ 
          quality: 90,
          progressive: true,
          optimizeScans: true
        })
        .resize(1600, 1600, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .withMetadata()
        .toFile(filepath)
      
      console.log('✅ Image processed:', filename)

    } catch (sharpError) {
      console.log('⚠️ Sharp failed, using original:', sharpError.message)
      await image.mv(filepath)
    }

    const publicUrl = `${DOMAIN}/uploads/${filename}`

    res.json({
      success: true,
      url: publicUrl,
      filename: filename,
      message: '🎉 Image uploaded and processed successfully!',
      timestamp: new Date().toISOString(),
      size: (fs.statSync(filepath).size / 1024).toFixed(2) + ' KB'
    })

  } catch (error) {
    console.error('❌ Upload error:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Upload failed: ' + error.message 
    })
  }
})

// File cleanup (10 minutes)
setInterval(() => {
  const uploadsDir = join(__dirname, 'uploads')
  try {
    const files = fs.readdirSync(uploadsDir)
    const now = Date.now()
    let deletedCount = 0
    
    files.forEach(file => {
      const filepath = join(uploadsDir, file)
      try {
        const stats = fs.statSync(filepath)
        if (now - stats.mtime.getTime() > 10 * 60 * 1000) {
          fs.unlinkSync(filepath)
          deletedCount++
          console.log('🗑️ Cleaned:', file)
        }
      } catch (e) {
        console.log('⚠️ Cleanup error:', e.message)
      }
    })
    
    if (deletedCount > 0) {
      console.log(`🧹 Cleanup completed: ${deletedCount} files removed`)
    }
  } catch (e) {
    console.log('❌ Cleanup failed:', e.message)
  }
}, 2 * 60 * 1000)

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔═══════════════════════════════════════════════╗
║            🚀 PREMIUM UPLOAD API             ║
║              by Ahmad - v2.0.0               ║
╟───────────────────────────────────────────────╢
║ 📍 Domain: ${DOMAIN} ║
║ 🏃 Port: ${PORT}                                ║
║ ⚡ Status: Running                            ║
║ 🛠️  Mode: Production Ready                   ║
╚═══════════════════════════════════════════════╝
  `)
  console.log('📖 Documentation: http://localhost:' + PORT)
  console.log('🔧 Health Check: http://localhost:' + PORT + '/health')
  console.log('📊 Statistics: http://localhost:' + PORT + '/stats')
})